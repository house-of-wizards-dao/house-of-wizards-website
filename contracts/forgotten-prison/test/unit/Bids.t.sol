// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import "../Base.t.sol";

contract BidsTest is PrisonTestBase {
    function test_RevertWhen_ThePaymentIsZero() external {
        vm.expectRevert(ForgottenPrison.ZeroAmount.selector);
        vm.prank(alice);
        prison.bid();
    }

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

    function test_RevertWhen_ThereIsNoInventory() external {
        ForgottenPrison empty =
            new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), _config());
        vm.expectRevert(ForgottenPrison.NoInventory.selector);
        vm.prank(alice);
        empty.bid{value: 1 ether}();
    }

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

    function test_WhenARefundRecipientAttemptsReentrancy() external {
        ReentrantRecipient attacker = new ReentrantRecipient(prison);
        attacker.placeBid{value: 1 ether}();
        attacker.setPayload(abi.encodeCall(prison.cancelBid, (payable(address(attacker)))));
        attacker.cancel();
        assertFalse(attacker.reentrySucceeded());
        assertEq(address(attacker).balance, 1 ether);
        _assertAccounting();
    }

    function test_RevertWhen_TheRecipientIsInvalid() external {
        _bid(alice, 1 ether);
        vm.expectRevert(ForgottenPrison.InvalidRecipient.selector);
        vm.prank(alice);
        prison.cancelBid(payable(address(0)));
        vm.expectRevert(ForgottenPrison.InvalidRecipient.selector);
        vm.prank(alice);
        prison.cancelBid(payable(address(prison)));
    }

    function test_RevertWhen_TheBidderHasNoOffer() external {
        vm.expectRevert(ForgottenPrison.NoBid.selector);
        vm.prank(alice);
        prison.cancelBid(payable(alice));
    }

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
