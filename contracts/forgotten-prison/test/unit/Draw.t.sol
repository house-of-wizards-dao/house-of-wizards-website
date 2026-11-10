/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import "../Base.t.sol";

/**
 * @title Daily Draw Behavior Tests
 * @notice Bulloak scenarios for daily draw behavior.
 */
contract DrawTest is PrisonTestBase {
    /**
     * @notice Verify: revert.
     * @dev Scenario: when called before the daily deadline.
     */
    function test_RevertWhen_CalledBeforeTheDailyDeadline() external {
        vm.expectRevert(ForgottenPrison.TooEarly.selector);
        prison.startDailyDraw();
    }

    /**
     * @notice Verify: lock the highest bid and request two random words.
     * @dev Scenario: when anyone calls at the deadline.
     */
    function test_WhenAnyoneCallsAtTheDeadline() external {
        _bid(alice, 1 ether);
        _bid(bob, 2 ether);
        vm.warp(prison.nextDrawAt());
        vm.prank(carol);
        uint256 id = prison.startDailyDraw();
        ForgottenPrison.Draw memory draw = prison.getDraw(id);
        assertEq(draw.winner, bob);
        assertEq(draw.price, 2 ether);
        assertEq(prison.bidOf(bob), 0);
        VRFV2PlusClient.RandomWordsRequest memory request = vrf.lastRequest();
        assertEq(request.numWords, 2);
        assertEq(request.subId, 1);
        assertEq(request.requestConfirmations, 3);
        assertEq(request.extraArgs, VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1(true)));
        assertEq(vrf.lastConsumer(), address(prison));
        _assertAccounting();
    }

    /**
     * @notice Verify: revert.
     * @dev Scenario: when a request is already pending.
     */
    function test_RevertWhen_ARequestIsAlreadyPending() external {
        _bid(alice, 1 ether);
        _start();
        vm.warp(prison.nextDrawAt());
        vm.expectRevert(ForgottenPrison.DrawPending.selector);
        prison.startDailyDraw();
        assertEq(vrf.requestCount(), 1);
    }

    /**
     * @notice Verify: preserve the winner funds and deadline.
     * @dev Scenario: when the subscription request fails.
     */
    function test_WhenTheSubscriptionRequestFails() external {
        _bid(alice, 1 ether);
        vrf.setFailRequests(true);
        vm.warp(prison.nextDrawAt());
        uint256 deadline = prison.nextDrawAt();
        vm.expectRevert(bytes("subscription unavailable"));
        prison.startDailyDraw();
        assertEq(prison.nextDrawAt(), deadline);
        assertEq(prison.pendingPayments(), 0);
        assertEq(prison.drawCount(), 0);
        vrf.setFailRequests(false);
        prison.startDailyDraw();
        assertEq(prison.getDraw(1).winner, alice);
        _assertAccounting();
    }

    /**
     * @notice Verify: advance the day without requesting randomness.
     * @dev Scenario: when the day has no bids.
     */
    function test_WhenTheDayHasNoBids() external {
        vm.warp(prison.nextDrawAt());
        assertEq(prison.startDailyDraw(), 0);
        assertEq(vrf.requestCount(), 0);
        _bid(alice, 1 ether);
        uint256 id = _start();
        assertEq(prison.getDraw(id).winner, alice);
    }

    /**
     * @notice Verify: advance the day without requesting randomness.
     * @dev Scenario: when the day has no inventory.
     */
    function test_WhenTheDayHasNoInventory() external {
        ForgottenPrison empty =
            new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), _config());
        vm.warp(empty.nextDrawAt());
        assertEq(empty.startDailyDraw(), 0);
        assertEq(vrf.requestCount(), 0);
    }

    /**
     * @notice Verify: revert.
     * @dev Scenario: when an unauthorized account fulfills.
     */
    function test_RevertWhen_AnUnauthorizedAccountFulfills() external {
        _bid(alice, 1 ether);
        _start();
        uint256[] memory words = new uint256[](1);
        vm.expectRevert();
        vm.prank(alice);
        prison.rawFulfillRandomWords(1, words);
        assertEq(uint256(prison.getDraw(1).status), uint256(ForgottenPrison.DrawStatus.Requested));
    }

    /**
     * @notice Verify: leave the draw waiting.
     * @dev Scenario: when the wrong request is fulfilled.
     */
    function test_WhenTheWrongRequestIsFulfilled() external {
        _bid(alice, 1 ether);
        _start();
        vrf.fulfill(address(prison), 777, 0);
        vm.expectRevert(ForgottenPrison.RandomnessNotReady.selector);
        prison.finalizeDraw();
    }

    /**
     * @notice Verify: select a valid token including token zero.
     * @dev Scenario: when zero randomness is returned.
     */
    function test_WhenZeroRandomnessIsReturned() external {
        _bid(alice, 1 ether);
        uint256 id = _settle(0);
        vm.prank(alice);
        prison.claimNFT(id, carol);
        assertEq(nft.ownerOf(0), carol);
        _assertAccounting();
    }

    /**
     * @notice Verify: preserve the first result.
     * @dev Scenario: when randomness is duplicated.
     */
    function test_WhenRandomnessIsDuplicated() external {
        _bid(alice, 1 ether);
        _start();
        _fulfill(2);
        _fulfill(3);
        prison.finalizeDraw();
        assertEq(prison.getDraw(1).tokenId, 2);
    }

    /**
     * @notice Verify: revert.
     * @dev Scenario: when finalization precedes randomness.
     */
    function test_RevertWhen_FinalizationPrecedesRandomness() external {
        _bid(alice, 1 ether);
        _start();
        vm.expectRevert(ForgottenPrison.RandomnessNotReady.selector);
        prison.finalizeDraw();
    }

    /**
     * @notice Verify: reserve one token and recognize only the winning payment.
     * @dev Scenario: when anyone finalizes a ready draw.
     */
    function test_WhenAnyoneFinalizesAReadyDraw() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        _start();
        _fulfill(1);
        vm.prank(carol);
        prison.finalizeDraw();
        assertEq(prison.proceeds(), 2 ether);
        assertEq(prison.pendingPayments(), 0);
        assertEq(prison.availableTokenCount(), 3);
        vm.prank(alice);
        prison.claimNFT(1, alice);
        assertEq(nft.ownerOf(1), alice);
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        assertEq(bob.balance, 100 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: revert.
     * @dev Scenario: when a draw is finalized twice.
     */
    function test_RevertWhen_ADrawIsFinalizedTwice() external {
        _bid(alice, 1 ether);
        _settle(0);
        vm.expectRevert(ForgottenPrison.NoPendingDraw.selector);
        prison.finalizeDraw();
    }

    /**
     * @notice Verify: never assign the same token twice.
     * @dev Scenario: when multiple days are drawn.
     */
    function test_WhenMultipleDaysAreDrawn() external {
        bool[4] memory seen;
        for (uint256 i; i < 4; i++) {
            _bid(alice, 1 ether);
            uint256 id = _settle(type(uint256).max - i);
            uint256 token = prison.getDraw(id).tokenId;
            assertFalse(seen[token]);
            seen[token] = true;
        }
        assertEq(prison.availableTokenCount(), 0);
        assertEq(prison.proceeds(), 4 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: schedule the next draw a full day later.
     * @dev Scenario: when a late caller starts a draw.
     */
    function test_WhenALateCallerStartsADraw() external {
        _bid(alice, 1 ether);
        vm.warp(prison.nextDrawAt() + 3 days);
        prison.startDailyDraw();
        assertEq(prison.nextDrawAt(), block.timestamp + 1 days);
        _fulfill(0);
        prison.finalizeDraw();
        vm.expectRevert(ForgottenPrison.TooEarly.selector);
        prison.startDailyDraw();
    }

    /**
     * @notice Verify: freeze changes to next day bids.
     * @dev Scenario: when a pending draw outlasts the next cutoff.
     */
    function test_WhenAPendingDrawOutlastsTheNextCutoff() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        _start();
        vm.warp(prison.nextDrawAt());
        vm.expectRevert(ForgottenPrison.CutoffReached.selector);
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        vm.expectRevert(ForgottenPrison.CutoffReached.selector);
        vm.prank(carol);
        prison.bid{value: 3 ether}();
        _fulfill(0);
        prison.finalizeDraw();
        prison.startDailyDraw();
        assertEq(prison.getDraw(2).winner, bob);
    }
}
