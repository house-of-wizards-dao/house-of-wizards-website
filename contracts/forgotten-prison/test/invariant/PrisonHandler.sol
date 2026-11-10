/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import {Test} from "forge-std/Test.sol";
import {ForgottenPrison} from "../../src/ForgottenPrison.sol";
import {MockERC721} from "../mocks/MockERC721.sol";
import {MockVRFCoordinator} from "../mocks/MockVRFCoordinator.sol";
import {ForceETH, RejectingRecipient} from "../mocks/Adversaries.sol";

/**
 * @title Bid and ETH Invariant Handler
 * @notice Execute valid auction actions while maintaining independent bidder, refund, and proceeds
 *   accounting.
 * @dev Inapplicable random actions return early; successful transitions have separate counters.
 */
contract PrisonHandler is Test {
    ForgottenPrison public prison;
    MockERC721 public nft;
    MockERC721 public wizards;
    MockERC721 public boxes;
    MockVRFCoordinator public vrf;
    RejectingRecipient public rejector;
    address[8] public actors;
    mapping(address => uint256) public modelBids;
    mapping(address => uint256) public modelSequences;
    mapping(address => uint256) public modelRefunds;
    mapping(uint256 => bool) public assigned;
    uint256 public sequence;
    uint256 public ethIn;
    uint256 public ethOut;
    uint256 public earned;
    uint256 public proceedsWithdrawn;
    uint256 public modelPending;
    uint256 public surplus;
    uint256 public lockedDrawCount;
    mapping(uint256 => address) public lockedWinners;
    mapping(uint256 => uint256) public lockedPrices;
    uint256 public assignedCount;
    uint256 public claims;
    uint256 public successfulBids;
    uint256 public successfulDraws;
    uint256 public successfulFinalizations;
    uint256 public successfulCancellations;
    uint256 public successfulRefunds;
    uint256 public successfulProceedsWithdrawals;

    /**
     * @notice Deploy an auction with 32 warriors and eight funded bidding actors.
     */
    constructor() {
        nft = new MockERC721();
        wizards = new MockERC721();
        boxes = new MockERC721();
        vrf = new MockVRFCoordinator();
        rejector = new RejectingRecipient();
        prison = new ForgottenPrison(
            address(this),
            address(nft),
            address(wizards),
            address(boxes),
            ForgottenPrison.VRFConfig(address(vrf), 1, bytes32(uint256(1)), 150_000, 3, true)
        );
        for (uint256 i; i < 32; i++) {
            nft.mint(address(this), i);
            nft.safeTransferFrom(address(this), address(prison), i);
        }
        for (uint256 i; i < actors.length; i++) {
            actors[i] = address(uint160(1000 + i));
            vm.deal(actors[i], 1_000_000 ether);
        }
    }

    /**
     * @notice Place a bounded valid bid and update the independent balance and tie-order model.
     * @param who Seed selecting one of eight actors.
     * @param value Additional payment seed bounded to 1 wei-10 ETH.
     */
    function bid(uint256 who, uint256 value) external {
        if (prison.closed() || block.timestamp >= prison.nextDrawAt() || prison.availableTokenCount() == 0) {
            return;
        }
        address actor = actors[who % actors.length];
        uint256 amount = bound(value, 1, 10 ether);
        vm.prank(actor);
        prison.bid{value: amount}();
        modelBids[actor] += amount;
        modelSequences[actor] = ++sequence;
        ethIn += amount;
        successfulBids++;
    }

    /**
     * @notice Cancel a selected actor's active bid when its timing allows and update ETH outflow.
     * @param who Seed selecting the actor.
     */
    function cancel(uint256 who) public {
        address actor = actors[who % actors.length];
        if (modelBids[actor] == 0) return;
        if (!prison.closed() && prison.availableTokenCount() != 0 && block.timestamp >= prison.nextDrawAt()) {
            return;
        }
        uint256 amount = modelBids[actor];
        vm.prank(actor);
        prison.cancelBid(payable(actor));
        ethOut += amount;
        modelBids[actor] = 0;
        successfulCancellations++;
    }

    /**
     * @notice Move the simulated timestamp forward.
     * @param elapsed Seed bounded to 0-2 days.
     */
    function advance(uint256 elapsed) external {
        vm.warp(block.timestamp + bound(elapsed, 0, 2 days));
    }

    /**
     * @notice Start an eligible day and compare its locked winner and price against the linear bid model.
     */
    function start() external {
        if (prison.closed() || prison.pendingDrawId() != 0 || block.timestamp < prison.nextDrawAt()) return;
        (address winner, uint256 price) = expectedTop();
        bool empty = price == 0 || prison.availableTokenCount() == 0;
        uint256 id = prison.startDailyDraw();
        if (empty) {
            assertEq(id, 0);
            return;
        }
        assertEq(prison.getDraw(id).winner, winner);
        assertEq(prison.getDraw(id).price, price);
        assertEq(id, ++lockedDrawCount);
        lockedWinners[id] = winner;
        lockedPrices[id] = price;
        modelBids[winner] = 0;
        modelPending = price;
        successfulDraws++;
    }

    /**
     * @notice Deliver main randomness for the pending draw with a losing bonus word.
     * @param word Unrestricted mock main-prize randomness.
     */
    function fulfill(uint256 word) external {
        if (prison.pendingDrawId() == 0) return;
        ForgottenPrison.Draw memory draw = prison.getDraw(prison.pendingDrawId());
        vrf.fulfill(address(prison), draw.requestId, word);
    }

    /**
     * @notice Finalize a ready draw, reject duplicate NFT awards, and update independent earned proceeds.
     */
    function finalize() public {
        if (prison.pendingDrawId() == 0) return;
        uint256 id = prison.pendingDrawId();
        if (prison.getDraw(id).status != ForgottenPrison.DrawStatus.Ready) return;
        prison.finalizeDraw();
        uint256 token = prison.getDraw(id).tokenId;
        assertFalse(assigned[token]);
        assigned[token] = true;
        assignedCount++;
        earned += modelPending;
        modelPending = 0;
        successfulFinalizations++;
    }

    /**
     * @notice Claim a selected finalized round to its winner and track custody leaving the auction.
     * @param seed Seed bounded to existing draw IDs.
     */
    function claim(uint256 seed) public {
        if (prison.drawCount() == 0) return;
        uint256 id = bound(seed, 1, prison.drawCount());
        ForgottenPrison.Draw memory draw = prison.getDraw(id);
        if (draw.status != ForgottenPrison.DrawStatus.Finalized || draw.claimed) return;
        vm.prank(draw.winner);
        prison.claimNFT(id, draw.winner);
        claims++;
    }

    /**
     * @notice Withdraw bounded earned proceeds and update the independent ETH outflow model.
     * @param value Amount seed bounded to positive unwithdrawn proceeds.
     */
    function withdraw(uint256 value) public {
        uint256 available = earned - proceedsWithdrawn;
        if (available == 0) return;
        uint256 amount = bound(value, 1, available);
        prison.withdrawProceeds(payable(address(this)), amount);
        ethOut += amount;
        successfulProceedsWithdrawals++;
        proceedsWithdrawn += amount;
    }

    /**
     * @notice Close only after the terminal timeout and convert any pending payment into model refunds.
     */
    function shutdown() public {
        if (prison.closed()) return;
        uint256 id = prison.pendingDrawId();
        if (id == 0) {
            if (block.timestamp < prison.nextDrawAt() + 7 days) return;
        } else {
            ForgottenPrison.Draw memory draw = prison.getDraw(id);
            if (
                draw.status != ForgottenPrison.DrawStatus.Requested
                    || block.timestamp < draw.requestedAt + 7 days
            ) return;
            modelRefunds[draw.winner] += modelPending;
            modelPending = 0;
        }
        prison.shutdownStalledAuction();
    }

    /**
     * @notice Withdraw a selected actor's positive aborted-draw refund and update the model.
     * @param who Seed selecting one of eight actors.
     */
    function refund(uint256 who) public {
        address actor = actors[who % actors.length];
        uint256 amount = modelRefunds[actor];
        if (amount == 0) return;
        vm.prank(actor);
        prison.withdrawRefund(payable(actor));
        modelRefunds[actor] = 0;
        ethOut += amount;
        successfulRefunds++;
    }

    /**
     * @notice Force ETH into custody without changing any bidder or owner credit.
     * @param value Forced donation bounded to 1 wei-10 ETH.
     */
    function forceETH(uint256 value) external {
        uint256 amount = bound(value, 1, 10 ether);
        vm.deal(address(this), address(this).balance + amount);
        new ForceETH{value: amount}(payable(address(prison)));
        surplus += amount;
    }

    /**
     * @notice Probe owner-only payments, over-withdrawals, and refund-transfer rollback during sequences.
     * @param who Seed selecting the actor whose cancellation may fail.
     */
    function probePayout(uint256 who) external {
        address actor = actors[who % actors.length];
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", actor));
        vm.prank(actor);
        prison.withdrawProceeds(payable(actor), 1);
        vm.expectRevert(ForgottenPrison.InsufficientProceeds.selector);
        prison.withdrawProceeds(payable(address(this)), earned - proceedsWithdrawn + 1);
        if (modelBids[actor] == 0) return;
        if (!prison.closed() && prison.availableTokenCount() != 0 && block.timestamp >= prison.nextDrawAt()) {
            return;
        }
        vm.expectRevert(ForgottenPrison.TransferFailed.selector);
        vm.prank(actor);
        prison.cancelBid(payable(address(rejector)));
    }

    /**
     * @notice Exclude setup activity from generated-operation metrics without changing the reference model.
     */
    function resetMetrics() external {
        successfulBids = 0;
        successfulDraws = 0;
        successfulFinalizations = 0;
        successfulCancellations = 0;
        successfulRefunds = 0;
        successfulProceedsWithdrawals = 0;
    }

    /**
     * @notice Settle or time out the final request and prove that every bidder credit can leave custody.
     * @dev Called after measuring generated actions. Unassigned inventory stays in this fixed-stock model.
     */
    function exitAll() external {
        finalize();
        uint256 id = prison.pendingDrawId();
        uint256 deadline = id == 0 ? prison.nextDrawAt() : prison.getDraw(id).requestedAt;
        vm.warp(block.timestamp > deadline + 7 days ? block.timestamp : deadline + 7 days);
        shutdown();
        for (uint256 i; i < actors.length; i++) {
            cancel(i);
            refund(i);
        }
        for (uint256 drawId = 1; drawId <= lockedDrawCount; drawId++) {
            claim(drawId);
        }
        withdraw(earned - proceedsWithdrawn);
        assertEq(address(prison).balance, surplus);
        assertEq(prison.totalBidEscrow(), 0);
        assertEq(prison.pendingPayments(), 0);
        assertEq(prison.totalRefunds(), 0);
        assertEq(prison.proceeds(), 0);
    }

    /**
     * @notice Find the expected highest and earliest bid with a linear scan independent of the tree.
     * @return winner Leading account or zero when empty.
     * @return amount Leading funded amount in wei or zero when empty.
     */
    function expectedTop() public view returns (address winner, uint256 amount) {
        uint256 earliest = type(uint256).max;
        for (uint256 i; i < actors.length; i++) {
            address actor = actors[i];
            uint256 bidAmount = modelBids[actor];
            if (
                bidAmount > amount
                    || (bidAmount != 0 && bidAmount == amount && modelSequences[actor] < earliest)
            ) {
                winner = actor;
                amount = bidAmount;
                earliest = modelSequences[actor];
            }
        }
    }
    /**
     * @notice Accept owner proceeds withdrawn by the handler.
     */
    receive() external payable {}
}
