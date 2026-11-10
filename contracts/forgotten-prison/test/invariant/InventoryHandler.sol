/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;

import {Test} from "forge-std/Test.sol";
import {ForgottenPrison} from "../../src/ForgottenPrison.sol";
import {MockERC721} from "../mocks/MockERC721.sol";
import {MockVRFCoordinator} from "../mocks/MockVRFCoordinator.sol";
import {ForceETH, SyncOnReceipt} from "../mocks/Adversaries.sol";

/**
 * @title Inventory and Draw Invariant Handler
 * @notice Model custody, immutable draws, historical claims, and ETH across arbitrary auction actions.
 * @dev Registration times independently determine eligibility. Pool order is captured before requesting
 *   randomness, then frozen; assigned prizes and accepted words are never copied from the auction.
 *   One funded bidder isolates inventory behavior; the bid-book campaign models competing bidders.
 */
contract InventoryHandler is Test {
    /**
     * @dev Model custody distinguishes outside ownership, unsynced transfers, stock, and reserved claims.
     */
    enum State {
        Outside,
        Unregistered,
        Available,
        Reserved
    }

    /**
     * @dev Recorded inputs, expected lifecycle, and permanently consumed claims for one round.
     */
    struct ModelDraw {
        uint256 price;
        uint256 requestedAt;
        uint256 requestId;
        uint256 word;
        uint256 bonus;
        uint256[] mainKeys;
        uint256[] boxKeys;
        ForgottenPrison.DrawStatus status;
        bool claimed;
        bool bonusClaimed;
    }

    ForgottenPrison public prison;
    MockVRFCoordinator public vrf;
    SyncOnReceipt public receiver;
    MockERC721[3] public tokens;
    State[48] public states;
    address[48] public holders;
    uint256[48] public registeredAt;
    uint256[48] public reservation;
    bool[48] public registeredEver;
    bool[48] public everClaimed;
    mapping(uint256 => ModelDraw) internal draws;
    uint256 public modelNextDrawAt;
    uint256 public modelDrawCount;
    uint256 public modelPendingId;
    uint256 public modelBid;
    uint256 public modelProceeds;
    uint256 public modelRefund;
    uint256 public ethIn;
    uint256 public ethOut;
    uint256 public surplus;
    bool public modelClosed;
    uint256 public finalizations;
    uint256 public donations;
    uint256 public returnedPrizes;
    uint256 public acceptedResponses;
    uint256 public ignoredResponses;
    uint256 public staleClaimChecks;
    uint256 public failedClaimChecks;
    uint256 public reentryChecks;
    address public bidder = address(0xB1D);
    address public donor = address(0xD00);

    /**
     * @notice Mint 16 tokens per collection, deploy the auction, and fund the bidding actor.
     */
    constructor() {
        for (uint256 c; c < 3; c++) {
            tokens[c] = new MockERC721();
            for (uint256 id; id < 16; id++) {
                tokens[c].mint(donor, id);
                holders[c * 16 + id] = donor;
            }
        }
        vrf = new MockVRFCoordinator();
        prison = new ForgottenPrison(
            address(this),
            address(tokens[0]),
            address(tokens[1]),
            address(tokens[2]),
            ForgottenPrison.VRFConfig(address(vrf), 1, bytes32(uint256(1)), 150_000, 3, true)
        );
        receiver = new SyncOnReceipt(prison);
        modelNextDrawAt = block.timestamp + 1 days;
        vm.deal(bidder, 1_000_000 ether);
    }

    /**
     * @notice Reset activity counters after seeding without changing ghost state.
     * @dev Excluded from fuzzer selectors, so counters measure generated actions only.
     */
    function resetMetrics() external {
        finalizations = 0;
        donations = 0;
        returnedPrizes = 0;
        acceptedResponses = 0;
        ignoredResponses = 0;
        staleClaimChecks = 0;
        failedClaimChecks = 0;
        reentryChecks = 0;
    }

    /**
     * @notice Donate an externally held asset, including prior prizes and plain transfers after closure.
     * @param seed Collection/token key modulo 48.
     * @param unsafe Use transferFrom when true; safe donations are excluded after closure.
     */
    function donate(uint256 seed, bool unsafe) public {
        uint256 key = seed % 48;
        if (states[key] != State.Outside || (modelClosed && !unsafe)) return;
        address holder = holders[key];
        vm.prank(holder);
        if (unsafe) {
            tokens[key / 16].transferFrom(holder, address(prison), key % 16);
            states[key] = State.Unregistered;
        } else {
            tokens[key / 16].safeTransferFrom(holder, address(prison), key % 16);
            _register(key);
        }
        holders[key] = address(prison);
        donations++;
        if (everClaimed[key]) returnedPrizes++;
    }

    /**
     * @notice Sync an unsynced asset as an unrelated account and record its registration time.
     * @param seed Collection/token key modulo 48.
     */
    function sync(uint256 seed) public {
        uint256 key = seed % 48;
        if (states[key] != State.Unregistered) return;
        vm.prank(address(0x5151));
        prison.syncReceivedNFT(address(tokens[key / 16]), key % 16);
        _register(key);
    }

    /**
     * @notice Add one ETH when independent timing and inventory permit bidding.
     */
    function bid() public {
        if (modelClosed || block.timestamp >= modelNextDrawAt || _available(false) == 0) return;
        vm.prank(bidder);
        prison.bid{value: 1 ether}();
        modelBid += 1 ether;
        ethIn += 1 ether;
    }

    /**
     * @notice Cancel the active bid when the independent model permits withdrawal.
     */
    function cancel() public {
        if (modelBid == 0) return;
        if (!modelClosed && _available(false) != 0 && block.timestamp >= modelNextDrawAt) return;
        vm.prank(bidder);
        prison.cancelBid(payable(bidder));
        ethOut += modelBid;
        modelBid = 0;
    }

    /**
     * @notice Move time forward to exercise cutoffs and prolonged pending requests.
     * @param elapsed Time increment bounded to 0-2 days.
     */
    function advance(uint256 elapsed) public {
        vm.warp(block.timestamp + bound(elapsed, 0, 2 days));
    }

    /**
     * @notice Capture eligible pool order before requesting a draw and lock independent inputs.
     * @dev Membership and counts come from model states/timestamps. Public order defines the request-time
     *   selection domain without reproducing the contract's swap-and-pop algorithm.
     */
    function start() public {
        if (modelClosed || modelPendingId != 0 || block.timestamp < modelNextDrawAt) return;
        (uint256 mainCount, uint256 boxCount) = _eligible();
        uint256 expectedId = modelDrawCount + 1;
        if (mainCount != 0 && modelBid != 0) {
            ModelDraw storage draw = draws[expectedId];
            for (uint256 i; i < mainCount; i++) {
                draw.mainKeys.push(_mainKeyAt(i));
            }
            for (uint256 i; i < boxCount; i++) {
                draw.boxKeys.push(32 + prison.availableBoxAt(i));
            }
            draw.price = modelBid;
            draw.requestedAt = block.timestamp;
            draw.requestId = vrf.requestCount() + 1;
            draw.status = ForgottenPrison.DrawStatus.Requested;
        }
        vm.prank(donor);
        uint256 id = prison.startDailyDraw();
        modelNextDrawAt = block.timestamp + 1 days;
        if (mainCount == 0 || modelBid == 0) {
            assertEq(id, 0);
            return;
        }
        assertEq(id, expectedId);
        modelDrawCount = expectedId;
        modelPendingId = expectedId;
        modelBid = 0;
    }

    /**
     * @notice Deliver arbitrary words; only the first response to a requested round changes the model.
     * @param word Main-prize random word.
     * @param bonus Independent bonus coin flip and selection word.
     */
    function fulfill(uint256 word, uint256 bonus) public {
        if (modelPendingId == 0) return;
        ModelDraw storage draw = draws[modelPendingId];
        vrf.fulfillPair(address(prison), draw.requestId, word, bonus);
        if (draw.status == ForgottenPrison.DrawStatus.Requested) {
            draw.word = word;
            draw.bonus = bonus;
            draw.status = ForgottenPrison.DrawStatus.Ready;
            acceptedResponses++;
        } else {
            ignoredResponses++;
        }
    }

    /**
     * @notice Exercise stale, wrong-ID, malformed, and unauthorized callbacks without changing the model.
     * @param seed Select a variant and historical round.
     * @param word Attempted replacement randomness.
     */
    function invalidCallback(uint256 seed, uint256 word) public {
        uint256 id = modelDrawCount == 0 ? 0 : seed % modelDrawCount + 1;
        uint256 requestId = draws[id].requestId;
        uint256 variant = seed % 4;
        if (variant == 0) {
            vrf.fulfillPair(address(prison), type(uint256).max, word, word);
        } else if (variant == 1) {
            uint256 length = (seed / 4) % 4;
            vm.prank(address(vrf));
            prison.rawFulfillRandomWords(requestId, new uint256[](length < 2 ? length : length + 1));
        } else if (variant == 2) {
            vm.expectRevert(
                abi.encodeWithSignature("OnlyCoordinatorCanFulfill(address,address)", donor, address(vrf))
            );
            vm.prank(donor);
            prison.rawFulfillRandomWords(requestId, new uint256[](2));
        } else {
            if (id == modelPendingId && draws[id].status == ForgottenPrison.DrawStatus.Requested) return;
            vrf.fulfillPair(address(prison), requestId, word, word);
        }
        ignoredResponses++;
    }

    /**
     * @notice Reserve exactly the assets predicted from the frozen model and recognize the locked price.
     */
    function finalize() public {
        uint256 id = modelPendingId;
        if (id == 0 || draws[id].status != ForgottenPrison.DrawStatus.Ready) return;
        ModelDraw storage draw = draws[id];
        uint256 key = draw.mainKeys[draw.word % draw.mainKeys.length];
        vm.prank(donor);
        prison.finalizeDraw();
        _reserve(key, id);
        if (_winsBox(draw)) _reserve(draw.boxKeys[(draw.bonus >> 1) % draw.boxKeys.length], id);
        draw.status = ForgottenPrison.DrawStatus.Finalized;
        modelProceeds += draw.price;
        modelPendingId = 0;
        finalizations++;
    }

    /**
     * @notice Claim a reserved asset to the donor while keeping historical consumption permanent.
     * @param seed Collection/token key modulo 48.
     */
    function claim(uint256 seed) public {
        _claim(seed % 48, donor);
    }

    /**
     * @notice Claim to a receiver that attempts sync during transfer and verify the exact guard error.
     * @param seed Collection/token key modulo 48.
     */
    function claimWithReentry(uint256 seed) public {
        uint256 key = seed % 48;
        if (states[key] != State.Reserved) return;
        _claim(key, address(receiver));
        assertFalse(receiver.succeeded());
        assertEq(receiver.failureSelector(), bytes4(keccak256("ReentrancyGuardReentrantCall()")));
        reentryChecks++;
    }

    /**
     * @notice Find a reserved asset, claim and return it, then prove its old claim stays consumed.
     * @dev This composite action improves exploration of repeated generations. Assertions between steps
     *   prevent a later step from hiding an earlier divergence. The bounded scan is test-only.
     * @param seed Starting point for the reservation scan.
     * @param unsafe Return by plain transfer plus permissionless sync when true.
     */
    function recycle(uint256 seed, bool unsafe) public {
        if (modelClosed) return;
        for (uint256 i; i < 48; i++) {
            uint256 key = (seed % 48 + i) % 48;
            if (states[key] != State.Reserved) continue;
            uint256 id = reservation[key];
            claimWithReentry(key);
            assertAll();
            donate(key, unsafe);
            sync(key);
            probeClaim(id - 1, key >= 32);
            assertAll();
            return;
        }
    }

    /**
     * @notice Probe stale claims, wrong winners, rejecting recipients, and reserved-asset registration.
     * @param seed Select a historical draw.
     * @param bonus Probe its bonus claim instead of its main claim.
     */
    function probeClaim(uint256 seed, bool bonus) public {
        if (modelDrawCount == 0) return;
        uint256 id = seed % modelDrawCount + 1;
        ModelDraw storage draw = draws[id];
        if (draw.status != ForgottenPrison.DrawStatus.Finalized || (bonus && !_winsBox(draw))) return;
        bool consumed = bonus ? draw.bonusClaimed : draw.claimed;
        bytes memory payload = bonus
            ? abi.encodeCall(prison.claimBonus, (id, donor))
            : abi.encodeCall(prison.claimNFT, (id, donor));
        _expectFailure(donor, payload, abi.encodeWithSelector(ForgottenPrison.NotWinner.selector));
        if (consumed) {
            _expectFailure(bidder, payload, abi.encodeWithSelector(ForgottenPrison.AlreadyClaimed.selector));
            staleClaimChecks++;
        } else {
            payload = bonus
                ? abi.encodeCall(prison.claimBonus, (id, address(this)))
                : abi.encodeCall(prison.claimNFT, (id, address(this)));
            _expectFailure(
                bidder, payload, abi.encodeWithSignature("ERC721InvalidReceiver(address)", address(this))
            );
            uint256 key = bonus
                ? draw.boxKeys[(draw.bonus >> 1) % draw.boxKeys.length]
                : draw.mainKeys[draw.word % draw.mainKeys.length];
            vm.expectRevert(
                abi.encodeWithSelector(
                    ForgottenPrison.InvalidToken.selector, address(tokens[key / 16]), key % 16
                )
            );
            prison.syncReceivedNFT(address(tokens[key / 16]), key % 16);
            if (modelClosed) {
                vm.expectRevert(
                    abi.encodeWithSelector(
                        ForgottenPrison.InvalidToken.selector, address(tokens[key / 16]), key % 16
                    )
                );
                prison.recoverUnsoldNFT(address(tokens[key / 16]), key % 16, donor);
            }
            failedClaimChecks++;
        }
    }

    /**
     * @notice Advance one valid lifecycle step so generated sequences keep reaching real draws.
     * @param word Main randomness used when a response is due.
     * @param bonus Bonus randomness used when a response is due.
     */
    function progress(uint256 word, uint256 bonus) public {
        if (modelClosed) return;
        if (modelPendingId == 0) {
            bid();
            vm.warp(block.timestamp < modelNextDrawAt ? modelNextDrawAt : block.timestamp);
            start();
        } else if (draws[modelPendingId].status == ForgottenPrison.DrawStatus.Requested) {
            fulfill(word, bonus);
        } else {
            finalize();
        }
    }

    /**
     * @notice Close only after the independent timeout, asserting that ready draws cannot be aborted.
     */
    function shutdown() public {
        if (modelClosed) return;
        uint256 id = modelPendingId;
        uint256 deadline = id == 0 ? modelNextDrawAt : draws[id].requestedAt;
        if (block.timestamp < deadline + 7 days) return;
        if (id != 0 && draws[id].status == ForgottenPrison.DrawStatus.Ready) {
            vm.expectRevert(ForgottenPrison.CannotShutdown.selector);
            prison.shutdownStalledAuction();
            return;
        }
        prison.shutdownStalledAuction();
        if (id != 0) {
            draws[id].status = ForgottenPrison.DrawStatus.Aborted;
            modelRefund += draws[id].price;
            modelPendingId = 0;
        }
        modelClosed = true;
    }

    /**
     * @notice Recover only modeled available stock after closure.
     * @param seed Collection/token key modulo 48.
     */
    function recover(uint256 seed) public {
        uint256 key = seed % 48;
        if (!modelClosed || states[key] != State.Available) return;
        prison.recoverUnsoldNFT(address(tokens[key / 16]), key % 16, donor);
        states[key] = State.Outside;
        holders[key] = donor;
    }

    /**
     * @notice Withdraw earned proceeds and any aborted payment independently of prize claims.
     */
    function withdraw() public {
        if (modelProceeds != 0) {
            prison.withdrawProceeds(payable(address(this)), modelProceeds);
            ethOut += modelProceeds;
            modelProceeds = 0;
        }
        if (modelRefund != 0) {
            vm.prank(bidder);
            prison.withdrawRefund(payable(bidder));
            ethOut += modelRefund;
            modelRefund = 0;
        }
    }

    /**
     * @notice Force ETH into the auction without creating bidder or owner credit.
     * @param value Donation bounded to 1 wei-10 ETH.
     */
    function forceETH(uint256 value) public {
        uint256 amount = bound(value, 1, 10 ether);
        vm.deal(address(this), address(this).balance + amount);
        new ForceETH{value: amount}(payable(address(prison)));
        surplus += amount;
    }

    /**
     * @notice Check custody, inventory uniqueness/eligibility, liabilities, and every historical draw.
     */
    function assertAll() public view {
        assertEq(prison.closed(), modelClosed);
        assertEq(prison.nextDrawAt(), modelNextDrawAt);
        assertEq(prison.drawCount(), modelDrawCount);
        assertEq(prison.pendingDrawId(), modelPendingId);
        assertEq(prison.bidOf(bidder), modelBid);
        assertEq(prison.totalBidEscrow(), modelBid);
        assertEq(prison.pendingPayments(), draws[modelPendingId].price);
        assertEq(prison.proceeds(), modelProceeds);
        assertEq(prison.refunds(bidder), modelRefund);
        assertEq(prison.totalRefunds(), modelRefund);
        assertEq(address(prison).balance, ethIn - ethOut + surplus);
        assertEq(
            address(prison).balance,
            modelBid + draws[modelPendingId].price + modelProceeds + modelRefund + surplus
        );
        assertCustody();
        for (uint256 id = 1; id <= modelDrawCount; id++) {
            _assertDraw(id);
        }
    }

    /**
     * @notice Compare exact token owners/statuses with the model, including unsynced and reserved assets.
     */
    function assertCustody() public view {
        uint256[3] memory held;
        bool[48] memory seen;
        for (uint256 key; key < 48; key++) {
            assertEq(tokens[key / 16].ownerOf(key % 16), holders[key]);
            if (states[key] != State.Outside) held[key / 16]++;
            ForgottenPrison.TokenStatus expected =
                registeredEver[key] ? ForgottenPrison.TokenStatus.Claimed : ForgottenPrison.TokenStatus.None;
            if (states[key] == State.Available) expected = ForgottenPrison.TokenStatus.Available;
            if (states[key] == State.Reserved) expected = ForgottenPrison.TokenStatus.Assigned;
            assertEq(uint256(prison.tokenStatus(address(tokens[key / 16]), key % 16)), uint256(expected));
        }
        uint256 mains = _available(false);
        uint256 boxes = _available(true);
        assertEq(prison.availableTokenCount(), mains);
        assertEq(prison.availableBoxCount(), boxes);
        (uint256 mainEligible, uint256 boxEligible) = _eligible();
        (uint256 actualMain, uint256 actualBox) = prison.eligibleInventoryCounts();
        assertEq(actualMain, mainEligible);
        assertEq(actualBox, boxEligible);
        for (uint256 i; i < mains + boxes; i++) {
            bool main = i < mains;
            uint256 index = main ? i : i - mains;
            uint256 key = main ? _mainKeyAt(index) : 32 + prison.availableBoxAt(index);
            assertLt(key, 48);
            assertFalse(seen[key]);
            seen[key] = true;
            assertEq(uint256(states[key]), uint256(State.Available));
            assertEq(registeredAt[key] < modelNextDrawAt, index < (main ? mainEligible : boxEligible));
        }
        for (uint256 c; c < 3; c++) {
            assertEq(tokens[c].balanceOf(address(prison)), held[c]);
        }
    }

    /**
     * @notice Prove every generated sequence still allows settlement and exit of all claims and balances.
     * @dev Callers report generated-action metrics before invoking these separate teardown actions.
     */
    function exitAll() external {
        if (modelPendingId != 0 && draws[modelPendingId].status == ForgottenPrison.DrawStatus.Ready) {
            finalize();
        }
        uint256 deadline = modelPendingId == 0 ? modelNextDrawAt : draws[modelPendingId].requestedAt;
        vm.warp(block.timestamp > deadline + 7 days ? block.timestamp : deadline + 7 days);
        shutdown();
        assertAll();
        cancel();
        withdraw();
        for (uint256 key; key < 48; key++) {
            claim(key);
            sync(key);
            recover(key);
        }
        assertAll();
        assertEq(address(prison).balance, surplus);
        for (uint256 c; c < 3; c++) {
            assertEq(tokens[c].balanceOf(address(prison)), 0);
        }
    }

    /**
     * @dev Check immutable inputs, consumed claims, exact awards, and each pending ordered prefix.
     * @param id Historical draw identifier.
     */
    function _assertDraw(uint256 id) internal view {
        ModelDraw storage expected = draws[id];
        ForgottenPrison.Draw memory actual = prison.getDraw(id);
        assertEq(actual.winner, bidder);
        assertEq(actual.price, expected.price);
        assertEq(actual.requestedAt, expected.requestedAt);
        assertEq(actual.requestId, expected.requestId);
        assertEq(actual.inventorySize, expected.mainKeys.length);
        assertEq(actual.boxInventorySize, expected.boxKeys.length);
        assertEq(actual.randomWord, expected.word);
        assertEq(actual.bonusWord, expected.bonus);
        assertEq(uint256(actual.status), uint256(expected.status));
        assertEq(actual.claimed, expected.claimed);
        assertEq(actual.bonusClaimed, expected.bonusClaimed);
        bool finalized = expected.status == ForgottenPrison.DrawStatus.Finalized;
        assertEq(actual.bonusAwarded, finalized && _winsBox(expected));
        if (finalized) {
            uint256 key = expected.mainKeys[expected.word % expected.mainKeys.length];
            assertEq(actual.collection, address(tokens[key / 16]));
            assertEq(actual.tokenId, key % 16);
            if (!expected.claimed) _assertReservation(key, id);
            if (_winsBox(expected)) {
                key = expected.boxKeys[(expected.bonus >> 1) % expected.boxKeys.length];
                assertEq(actual.boxTokenId, key % 16);
                if (!expected.bonusClaimed) _assertReservation(key, id);
            } else {
                assertEq(actual.boxTokenId, 0);
            }
        } else {
            assertEq(actual.collection, address(0));
            assertEq(actual.tokenId, 0);
            assertEq(actual.boxTokenId, 0);
        }
        if (id == modelPendingId) {
            for (uint256 i; i < expected.mainKeys.length; i++) {
                assertEq(_mainKeyAt(i), expected.mainKeys[i]);
            }
            for (uint256 i; i < expected.boxKeys.length; i++) {
                assertEq(32 + prison.availableBoxAt(i), expected.boxKeys[i]);
            }
        }
    }

    /**
     * @dev Check exclusive outstanding ownership of a prize by its historical round.
     * @param key Collection/token key.
     * @param id Expected reservation holder.
     */
    function _assertReservation(uint256 key, uint256 id) internal view {
        assertEq(uint256(states[key]), uint256(State.Reserved));
        assertEq(reservation[key], id);
    }

    /**
     * @dev Record registration without touching historical claims.
     * @param key Collection/token key.
     */
    function _register(uint256 key) internal {
        states[key] = State.Available;
        registeredAt[key] = block.timestamp;
        registeredEver[key] = true;
    }

    /**
     * @dev Reserve independently predicted available stock exactly once.
     * @param key Collection/token key.
     * @param id Draw entitled to the asset.
     */
    function _reserve(uint256 key, uint256 id) internal {
        assertEq(uint256(states[key]), uint256(State.Available));
        states[key] = State.Reserved;
        reservation[key] = id;
    }

    /**
     * @dev Consume the current claim before allowing the asset to return.
     * @param key Reserved collection/token key.
     * @param recipient Destination accepting the transfer.
     */
    function _claim(uint256 key, address recipient) internal {
        if (states[key] != State.Reserved) return;
        uint256 id = reservation[key];
        vm.prank(bidder);
        if (key < 32) {
            prison.claimNFT(id, recipient);
            draws[id].claimed = true;
        } else {
            prison.claimBonus(id, recipient);
            draws[id].bonusClaimed = true;
        }
        states[key] = State.Outside;
        holders[key] = recipient;
        everClaimed[key] = true;
    }

    /**
     * @dev Count available stock, including queued assets, independently of auction getters.
     * @param boxes Select bonus stock when true, main stock otherwise.
     * @return count Number of available assets.
     */
    function _available(bool boxes) internal view returns (uint256 count) {
        for (uint256 key = boxes ? 32 : 0; key < (boxes ? 48 : 32); key++) {
            if (states[key] == State.Available) count++;
        }
    }

    /**
     * @dev Derive eligibility from registration times and the independent deadline.
     * @return mains Eligible main assets.
     * @return boxes Eligible bonus assets.
     */
    function _eligible() internal view returns (uint256 mains, uint256 boxes) {
        for (uint256 key; key < 48; key++) {
            if (states[key] != State.Available || registeredAt[key] >= modelNextDrawAt) continue;
            if (key < 32) mains++;
            else boxes++;
        }
    }

    /**
     * @dev Resolve a public main-pool entry to a validated model key.
     * @param index Main inventory index.
     * @return Collection/token model key.
     */
    function _mainKeyAt(uint256 index) internal view returns (uint256) {
        ForgottenPrison.Asset memory asset = prison.availableTokenAt(index);
        assertTrue(asset.collection == address(tokens[0]) || asset.collection == address(tokens[1]));
        assertLt(asset.tokenId, 16);
        return (asset.collection == address(tokens[0]) ? 0 : 16) + asset.tokenId;
    }

    /**
     * @dev Apply the bonus rule to first-accepted input randomness and frozen stock.
     * @param draw Independent draw model.
     * @return True when stock existed and the coin flip wins.
     */
    function _winsBox(ModelDraw storage draw) internal view returns (bool) {
        return draw.boxKeys.length != 0 && draw.bonus % 2 == 0;
    }

    /**
     * @dev Check exact failure bytes without discarding an expected adversarial action.
     * @param caller Impersonated actor.
     * @param payload Auction calldata.
     * @param expected Expected revert bytes.
     */
    function _expectFailure(address caller, bytes memory payload, bytes memory expected) internal {
        vm.prank(caller);
        (bool success, bytes memory result) = address(prison).call(payload);
        assertFalse(success);
        assertEq(result, expected);
    }

    /**
     * @notice Accept finalized proceeds from model withdrawals.
     */
    receive() external payable {}
}
