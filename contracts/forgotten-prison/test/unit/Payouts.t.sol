// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import "../Base.t.sol";

contract PayoutsTest is PrisonTestBase {
    function test_WhenAPaymentIsPending() external {
        _bid(alice, 1 ether);
        _start();
        vm.expectRevert(ForgottenPrison.InsufficientProceeds.selector);
        prison.withdrawProceeds(payable(address(this)), 1 ether);
        _assertAccounting();
    }

    function test_WhenTheOwnerWithdrawsCompletedSales() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        _settle(0);
        prison.withdrawProceeds(payable(carol), 2 ether);
        assertEq(carol.balance, 102 ether);
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        assertEq(bob.balance, 100 ether);
        assertEq(address(prison).balance, 0);
        _assertAccounting();
    }

    function test_RevertWhen_ANonOwnerWithdrawsProceeds() external {
        _bid(alice, 1 ether);
        _settle(0);
        vm.expectRevert();
        vm.prank(alice);
        prison.withdrawProceeds(payable(alice), 1 ether);
    }

    function test_WhenTheRecipientRejectsProceeds() external {
        _bid(alice, 1 ether);
        _settle(0);
        RejectingRecipient rejector = new RejectingRecipient();
        vm.expectRevert(ForgottenPrison.TransferFailed.selector);
        prison.withdrawProceeds(payable(address(rejector)), 1 ether);
        prison.withdrawProceeds(payable(carol), 1 ether);
        assertEq(carol.balance, 101 ether);
        _assertAccounting();
    }

    function test_RevertWhen_ANonWinnerClaimsTheNFT() external {
        _bid(alice, 1 ether);
        _settle(0);
        vm.expectRevert(ForgottenPrison.NotWinner.selector);
        vm.prank(bob);
        prison.claimNFT(1, bob);
    }

    function test_RevertWhen_TheWinnerClaimsBeforeAssignment() external {
        _bid(alice, 1 ether);
        _start();
        vm.expectRevert(ForgottenPrison.RandomnessNotReady.selector);
        vm.prank(alice);
        prison.claimNFT(1, alice);
    }

    function test_WhenTheWinnerClaimsToAnotherAddress() external {
        _bid(alice, 1 ether);
        _settle(0);
        vm.prank(alice);
        prison.claimNFT(1, carol);
        assertEq(nft.ownerOf(0), carol);
        vm.expectRevert(ForgottenPrison.AlreadyClaimed.selector);
        vm.prank(alice);
        prison.claimNFT(1, bob);
    }

    function test_WhenTheNFTRecipientRejectsTheTransfer() external {
        _bid(alice, 1 ether);
        _settle(0);
        RejectingRecipient rejector = new RejectingRecipient();
        vm.expectRevert();
        vm.prank(alice);
        prison.claimNFT(1, address(rejector));
        vm.prank(alice);
        prison.claimNFT(1, carol);
        assertEq(nft.ownerOf(0), carol);
    }

    function test_WhenTheOwnerWithdrawsBeforeTheNFTIsClaimed() external {
        _bid(alice, 1 ether);
        _settle(0);
        prison.withdrawProceeds(payable(carol), 1 ether);
        vm.prank(alice);
        prison.claimNFT(1, bob);
        assertEq(nft.ownerOf(0), bob);
        _assertAccounting();
    }

    function test_WhenAnETHRecipientReentersOwnerWithdrawal() external {
        _bid(alice, 2 ether);
        _settle(0);
        ReentrantRecipient attacker = new ReentrantRecipient(prison);
        prison.transferOwnership(address(attacker));
        attacker.acceptOwnership();
        attacker.setPayload(abi.encodeCall(prison.withdrawProceeds, (payable(address(attacker)), 1 ether)));
        attacker.withdraw(1 ether);
        assertFalse(attacker.reentrySucceeded());
        assertEq(prison.proceeds(), 1 ether);
        assertEq(address(attacker).balance, 1 ether);
        _assertAccounting();
    }

    function test_RevertWhen_ProceedsRecipientsOrAmountsAreInvalid() external {
        _bid(alice, 1 ether);
        _settle(0);
        vm.expectRevert(ForgottenPrison.ZeroAmount.selector);
        prison.withdrawProceeds(payable(carol), 0);
        vm.expectRevert(ForgottenPrison.InvalidRecipient.selector);
        prison.withdrawProceeds(payable(address(0)), 1 ether);
        vm.expectRevert(ForgottenPrison.InsufficientProceeds.selector);
        prison.withdrawProceeds(payable(carol), 2 ether);
    }

    function test_WhenETHIsForcedIntoTheContract() external {
        _bid(alice, 1 ether);
        new ForceETH{value: 1 ether}(payable(address(prison)));
        vm.expectRevert(ForgottenPrison.InsufficientProceeds.selector);
        prison.withdrawProceeds(payable(carol), 1 ether);
        vm.prank(alice);
        prison.cancelBid(payable(alice));
        assertEq(alice.balance, 100 ether);
        assertEq(address(prison).balance, 1 ether);
    }
}
