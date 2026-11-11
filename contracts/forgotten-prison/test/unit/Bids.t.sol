/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import "../Base.t.sol";

/**
 * @title Standing Bid Behavior Tests
 * @notice Bulloak scenarios for standing bid behavior.
 */
contract BidsTest is PrisonTestBase {
    /**
     * @notice Verify: revert.
     * @dev Scenario: when the payment is zero.
     */
    function test_RevertWhen_ThePaymentIsZero() external {
        vm.expectRevert(ForgottenPrison.ZeroAmount.selector);
        vm.prank(alice);
        prison.bid();
    }

    /**
     * @notice Verify: reject new bids and cancellation.
     * @dev Scenario: when the cutoff is reached.
     */
    function test_WhenTheCutoffIsReached() external {
        _bid(alice, 1 ether);
        vm.warp(prison.nextDrawAt());
        vm.expectRevert(ForgottenPrison.CutoffReached.selector);
        vm.prank(bob);
        prison.bid{value: 2 ether}();
        vm.expectRevert(ForgottenPrison.CutoffReached.selector);
        vm.prank(alice);
        prison.cancelBid(payable(alice));
        _assertAccounting();
    }

    /**
     * @notice Verify: allow cancellation without closing.
     * @dev Scenario: when a cutoff stalls for seven days. Frozen bidders regain an exit while the auction
     *   stays open, and a later start still works for whoever stayed in.
     */
    function test_WhenACutoffStallsForSevenDays() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        vm.warp(prison.nextDrawAt() + 7 days - 1);
        vm.expectRevert(ForgottenPrison.CutoffReached.selector);
        vm.prank(alice);
        prison.cancelBid(payable(alice));
        vm.warp(prison.nextDrawAt() + 7 days);
        vm.prank(alice);
        prison.cancelBid(payable(alice));
        assertEq(alice.balance, 100 ether);
        assertFalse(prison.closed());
        vm.expectRevert(ForgottenPrison.CutoffReached.selector);
        vm.prank(carol);
        prison.bid{value: 3 ether}();
        uint256 id = prison.startDailyDraw();
        assertEq(prison.getDraw(id).winner, bob);
        assertEq(prison.getDraw(id).price, 1 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: revert.
     * @dev Scenario: when there is no inventory.
     */
    function test_RevertWhen_ThereIsNoInventory() external {
        ForgottenPrison empty =
            new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), _config());
        vm.expectRevert(ForgottenPrison.NoInventory.selector);
        vm.prank(alice);
        empty.bid{value: 1 ether}();
    }

    /**
     * @notice Verify: charge only the top up and preserve total escrow.
     * @dev Scenario: when a bidder increases their offer.
     */
    function test_WhenABidderIncreasesTheirOffer() external {
        _bid(alice, 1 ether);
        _bid(bob, 2 ether);
        _bid(alice, 2 ether);
        (address leader, uint256 amount) = prison.highestBid();
        assertEq(leader, alice);
        assertEq(amount, 3 ether);
        assertEq(alice.balance, 97 ether);
        assertEq(prison.totalBidEscrow(), 5 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: prefer the earlier accepted amount.
     * @dev Scenario: when equal bids exist.
     */
    function test_WhenEqualBidsExist() external {
        _bid(alice, 1 ether);
        _bid(bob, 2 ether);
        _bid(alice, 1 ether);
        (address leader,) = prison.highestBid();
        assertEq(leader, bob);
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        (leader,) = prison.highestBid();
        assertEq(leader, alice);
    }

    /**
     * @notice Verify: refund only their funds and preserve the leader.
     * @dev Scenario: when a losing bidder cancels.
     */
    function test_WhenALosingBidderCancels() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        vm.prank(bob);
        prison.cancelBid(payable(carol));
        assertEq(carol.balance, 101 ether);
        assertEq(bob.balance, 99 ether);
        (address leader,) = prison.highestBid();
        assertEq(leader, alice);
        _assertAccounting();
    }

    /**
     * @notice Verify: promote the next highest bid.
     * @dev Scenario: when the leader cancels before cutoff.
     */
    function test_WhenTheLeaderCancelsBeforeCutoff() external {
        _bid(alice, 3 ether);
        _bid(bob, 2 ether);
        _bid(carol, 1 ether);
        vm.prank(alice);
        prison.cancelBid(payable(alice));
        uint256 id = _start();
        assertEq(prison.getDraw(id).winner, bob);
        assertEq(alice.balance, 100 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: revert without removing the bid.
     * @dev Scenario: when the refund recipient rejects ETH.
     */
    function test_WhenTheRefundRecipientRejectsETH() external {
        _bid(alice, 1 ether);
        RejectingRecipient rejector = new RejectingRecipient();
        vm.expectRevert(ForgottenPrison.TransferFailed.selector);
        vm.prank(alice);
        prison.cancelBid(payable(address(rejector)));
        vm.prank(alice);
        prison.cancelBid(payable(alice));
        assertEq(alice.balance, 100 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: remain funded without charging again.
     * @dev Scenario: when a bid rolls into the next day.
     */
    function test_WhenABidRollsIntoTheNextDay() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        _settle(12);
        uint256 id = _start();
        assertEq(prison.getDraw(id).winner, bob);
        assertEq(prison.getDraw(id).price, 1 ether);
        assertEq(bob.balance, 99 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: create a separate funded offer.
     * @dev Scenario: when the winner bids again.
     */
    function test_WhenTheWinnerBidsAgain() external {
        _bid(alice, 2 ether);
        _start();
        _bid(alice, 1 ether);
        assertEq(prison.pendingPayments(), 2 ether);
        assertEq(prison.totalBidEscrow(), 1 ether);
        _fulfill(0);
        prison.finalizeDraw();
        uint256 id = _start();
        assertEq(prison.getDraw(id).price, 1 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: block duplicate withdrawal.
     * @dev Scenario: when a refund recipient attempts reentrancy.
     */
    function test_WhenARefundRecipientAttemptsReentrancy() external {
        ReentrantRecipient attacker = new ReentrantRecipient(prison);
        attacker.placeBid{value: 1 ether}();
        attacker.setPayload(abi.encodeCall(prison.cancelBid, (payable(address(attacker)))));
        attacker.cancel();
        assertFalse(attacker.reentrySucceeded());
        assertEq(address(attacker).balance, 1 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: revert.
     * @dev Scenario: when the recipient is invalid.
     */
    function test_RevertWhen_TheRecipientIsInvalid() external {
        _bid(alice, 1 ether);
        vm.expectRevert(ForgottenPrison.InvalidRecipient.selector);
        vm.prank(alice);
        prison.cancelBid(payable(address(0)));
        vm.expectRevert(ForgottenPrison.InvalidRecipient.selector);
        vm.prank(alice);
        prison.cancelBid(payable(address(prison)));
    }

    /**
     * @notice Verify: revert.
     * @dev Scenario: when the bidder has no offer.
     */
    function test_RevertWhen_TheBidderHasNoOffer() external {
        vm.expectRevert(ForgottenPrison.NoBid.selector);
        vm.prank(alice);
        prison.cancelBid(payable(alice));
    }

    /**
     * @notice Verify: preserve the remaining queue and lower price bids.
     * @dev Scenario: when middle and tail bidders at an equal price cancel.
     */
    function test_WhenMiddleAndTailBiddersAtAnEqualPriceCancel() external {
        address dave = address(0xDA7E);
        vm.deal(dave, 1 ether);
        _bid(alice, 2 ether);
        _bid(bob, 2 ether);
        _bid(carol, 2 ether);
        _bid(dave, 1 ether);
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        vm.prank(carol);
        prison.cancelBid(payable(carol));
        (address leader,) = prison.highestBid();
        assertEq(leader, alice);
        vm.prank(alice);
        prison.cancelBid(payable(alice));
        uint256 id = _start();
        assertEq(prison.getDraw(id).winner, dave);
        assertEq(bob.balance, 100 ether);
        assertEq(carol.balance, 100 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: roll the remaining bidders forward in their original order.
     * @dev Scenario: when the head of an equal price queue wins.
     */
    function test_WhenTheHeadOfAnEqualPriceQueueWins() external {
        _bid(alice, 1 ether);
        _bid(bob, 1 ether);
        _bid(carol, 1 ether);
        uint256 first = _settle(0);
        uint256 second = _settle(0);
        uint256 third = _settle(0);
        assertEq(prison.getDraw(first).winner, alice);
        assertEq(prison.getDraw(second).winner, bob);
        assertEq(prison.getDraw(third).winner, carol);
        assertEq(prison.proceeds(), 3 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: restore ordering without retaining stale bidders.
     * @dev Scenario: when an emptied price level is reused.
     */
    function test_WhenAnEmptiedPriceLevelIsReused() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        vm.prank(alice);
        prison.cancelBid(payable(alice));
        _bid(carol, 2 ether);
        uint256 id = _settle(1);
        assertEq(prison.getDraw(id).winner, carol);
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        (address leader, uint256 amount) = prison.highestBid();
        assertEq(leader, address(0));
        assertEq(amount, 0);
        _bid(alice, 2 ether);
        id = _start();
        assertEq(prison.getDraw(id).winner, alice);
        _assertAccounting();
    }

    /**
     * @notice Verify: join after the existing equal bids.
     * @dev Scenario: when a top up joins an occupied price level.
     */
    function test_WhenATopUpJoinsAnOccupiedPriceLevel() external {
        _bid(alice, 1 ether);
        _bid(bob, 2 ether);
        _bid(carol, 2 ether);
        _bid(alice, 1 ether);
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        uint256 first = _settle(0);
        uint256 second = _settle(0);
        assertEq(prison.getDraw(first).winner, carol);
        assertEq(prison.getDraw(second).winner, alice);
        assertEq(prison.proceeds(), 4 ether);
        _assertAccounting();
    }
}
