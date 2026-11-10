// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import {Test} from "forge-std/Test.sol";
import {ForgottenPrison} from "../../src/ForgottenPrison.sol";
import {MockERC721} from "../mocks/MockERC721.sol";
import {MockVRFCoordinator} from "../mocks/MockVRFCoordinator.sol";

contract PrisonHandler is Test {
    ForgottenPrison public prison;
    MockERC721 public nft;
    MockERC721 public wizards;
    MockERC721 public boxes;
    MockVRFCoordinator public vrf;
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
    uint256 public assignedCount;
    uint256 public claims;
    uint256 public successfulBids;
    uint256 public successfulDraws;
    uint256 public successfulFinalizations;
    uint256 public successfulCancellations;
    uint256 public successfulRefunds;
    uint256 public successfulProceedsWithdrawals;

    constructor() {
        nft = new MockERC721();
        wizards = new MockERC721();
        boxes = new MockERC721();
        vrf = new MockVRFCoordinator();
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

    function cancel(uint256 who) external {
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

    function advance(uint256 elapsed) external {
        vm.warp(block.timestamp + bound(elapsed, 0, 2 days));
    }

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
        modelBids[winner] = 0;
        modelPending = price;
        successfulDraws++;
    }

    function fulfill(uint256 word) external {
        if (prison.pendingDrawId() == 0) return;
        ForgottenPrison.Draw memory draw = prison.getDraw(prison.pendingDrawId());
        vrf.fulfill(address(prison), draw.requestId, word);
    }

    function finalize() external {
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

    function claim(uint256 seed) external {
        if (prison.drawCount() == 0) return;
        uint256 id = bound(seed, 1, prison.drawCount());
        ForgottenPrison.Draw memory draw = prison.getDraw(id);
        if (draw.status != ForgottenPrison.DrawStatus.Finalized || draw.claimed) return;
        vm.prank(draw.winner);
        prison.claimNFT(id, draw.winner);
        claims++;
    }

    function withdraw(uint256 value) external {
        uint256 available = earned - proceedsWithdrawn;
        if (available == 0) return;
        uint256 amount = bound(value, 1, available);
        prison.withdrawProceeds(payable(address(this)), amount);
        ethOut += amount;
        successfulProceedsWithdrawals++;
        proceedsWithdrawn += amount;
    }

    function shutdown() external {
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

    function refund(uint256 who) external {
        address actor = actors[who % actors.length];
        uint256 amount = modelRefunds[actor];
        if (amount == 0) return;
        vm.prank(actor);
        prison.withdrawRefund(payable(actor));
        modelRefunds[actor] = 0;
        ethOut += amount;
        successfulRefunds++;
    }

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
    receive() external payable {}
}
