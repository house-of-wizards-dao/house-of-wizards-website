// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import "../Base.t.sol";

contract BonusTest is PrisonTestBase {
    function _settleBonus(uint256 word, uint256 bonus) internal returns (uint256 id) {
        id = _start();
        vrf.fulfillPair(address(prison), prison.getDraw(id).requestId, word, bonus);
        prison.finalizeDraw();
    }

    function test_WhenTheBonusCoinFlipWins() external {
        _donate(boxes, bob, 0);
        _donate(wizards, carol, 0);
        _bid(alice, 1 ether);
        uint256 id = _settleBonus(4, 0);
        assertEq(prison.getDraw(id).collection, address(wizards));
        assertTrue(prison.getDraw(id).bonusAwarded);
        vm.prank(alice);
        prison.claimBonus(id, bob);
        vm.prank(alice);
        prison.claimNFT(id, carol);
        assertEq(boxes.ownerOf(0), bob);
        assertEq(wizards.ownerOf(0), carol);
        assertEq(nft.ownerOf(0), address(prison));
        vm.expectRevert(ForgottenPrison.AlreadyClaimed.selector);
        vm.prank(alice);
        prison.claimBonus(id, alice);
        _assertAccounting();
    }

    function test_WhenTheBonusCoinFlipLoses() external {
        _donate(boxes, bob, 0);
        _bid(alice, 1 ether);
        uint256 id = _settleBonus(0, type(uint256).max);
        assertFalse(prison.getDraw(id).bonusAwarded);
        assertEq(prison.availableBoxCount(), 1);
        vm.expectRevert(ForgottenPrison.NoBonus.selector);
        vm.prank(alice);
        prison.claimBonus(id, alice);
    }

    function test_WhenTheLastBoxIsAwardedButUnclaimed() external {
        _donate(boxes, bob, 0);
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        _settleBonus(0, 0);
        _settleBonus(0, 0);
        assertFalse(prison.getDraw(2).bonusAwarded);
        assertEq(prison.availableBoxCount(), 0);
        assertEq(boxes.ownerOf(0), address(prison));
        vm.expectRevert(abi.encodeWithSelector(ForgottenPrison.InvalidToken.selector, address(boxes), 0));
        prison.syncReceivedNFT(address(boxes), 0);
        vm.prank(alice);
        prison.claimBonus(1, alice);
        assertEq(boxes.ownerOf(0), alice);
    }

    function test_WhenBoxesAreReplenished() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        _settleBonus(0, 0);
        assertFalse(prison.getDraw(1).bonusAwarded);
        _donate(boxes, carol, 42);
        _settleBonus(0, 0);
        vm.prank(bob);
        prison.claimBonus(2, bob);
        assertEq(boxes.ownerOf(42), bob);
    }

    function test_WhenABoxArrivesAfterCutoffOrAfterRandomness() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        vm.warp(prison.nextDrawAt());
        _donate(boxes, carol, 0);
        prison.startDailyDraw();
        vrf.fulfillPair(address(prison), 1, 0, 0);
        _donate(boxes, carol, 1);
        prison.finalizeDraw();
        assertFalse(prison.getDraw(1).bonusAwarded);
        _settleBonus(0, 2);
        assertEq(prison.getDraw(2).boxTokenId, 1);
        assertTrue(prison.getDraw(2).bonusAwarded);
    }

    function test_WhenABonusTransferFails() external {
        _donate(boxes, bob, 0);
        _bid(alice, 1 ether);
        _settleBonus(0, 0);
        RejectingRecipient rejector = new RejectingRecipient();
        vm.expectRevert();
        vm.prank(alice);
        prison.claimBonus(1, address(rejector));
        assertFalse(prison.getDraw(1).bonusClaimed);
        vm.prank(alice);
        prison.claimNFT(1, alice);
        vm.prank(alice);
        prison.claimBonus(1, alice);
        assertEq(nft.ownerOf(0), alice);
        assertEq(boxes.ownerOf(0), alice);
    }

    function test_RevertWhen_ADifferentAccountClaimsABonus() external {
        _donate(boxes, bob, 0);
        _bid(alice, 1 ether);
        _settleBonus(0, 0);
        vm.expectRevert(ForgottenPrison.NotWinner.selector);
        vm.prank(bob);
        prison.claimBonus(1, bob);
    }

    function test_WhenAWonBoxReturns() external {
        _donate(boxes, bob, 0);
        _bid(alice, 1 ether);
        _settleBonus(0, 0);
        vm.prank(alice);
        prison.claimBonus(1, alice);
        vm.prank(alice);
        boxes.transferFrom(alice, address(prison), 0);
        vm.prank(carol);
        prison.syncReceivedNFT(address(boxes), 0);
        _bid(bob, 1 ether);
        _settleBonus(0, 0);
        vm.expectRevert(ForgottenPrison.AlreadyClaimed.selector);
        vm.prank(alice);
        prison.claimBonus(1, alice);
        vm.prank(bob);
        prison.claimBonus(2, bob);
        assertEq(boxes.ownerOf(0), bob);
    }

    function test_WhenThreeWizardsShareThePrizePool() external {
        for (uint256 i; i < 3; i++) {
            _donate(wizards, bob, i);
        }
        for (uint256 i; i < 7; i++) {
            _bid(alice, 1 ether);
            uint256 id = _settleBonus(prison.availableTokenCount() - 1, 1);
            vm.prank(alice);
            prison.claimNFT(id, alice);
        }
        assertEq(wizards.balanceOf(alice), 3);
        assertEq(nft.balanceOf(alice), 4);
        assertEq(prison.availableTokenCount(), 0);
    }

    function test_WhenAFinalizedBonusSurvivesShutdown() external {
        _donate(boxes, bob, 0);
        _donate(boxes, bob, 1);
        _bid(alice, 1 ether);
        _settleBonus(0, 0);
        vm.warp(prison.nextDrawAt() + 7 days);
        prison.shutdownStalledAuction();
        vm.expectRevert(abi.encodeWithSelector(ForgottenPrison.InvalidToken.selector, address(boxes), 0));
        prison.recoverUnsoldNFT(address(boxes), 0, carol);
        prison.recoverUnsoldNFT(address(boxes), 1, carol);
        vm.prank(alice);
        prison.claimBonus(1, alice);
        assertEq(boxes.ownerOf(1), carol);
        assertEq(boxes.ownerOf(0), alice);
    }

    function test_WhenTheCallbackContainsAnIncorrectNumberOfWords() external {
        _bid(alice, 1 ether);
        _start();
        uint256[] memory words = new uint256[](1);
        vm.prank(address(vrf));
        prison.rawFulfillRandomWords(1, words);
        assertEq(uint256(prison.getDraw(1).status), uint256(ForgottenPrison.DrawStatus.Requested));
        _fulfill(0);
        prison.finalizeDraw();
        assertEq(prison.proceeds(), 1 ether);
    }
}
