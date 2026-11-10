/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import "../Base.t.sol";

/**
 * @title Imp Box Bonus Behavior Tests
 * @notice Bulloak scenarios for imp box bonus behavior.
 */
contract BonusTest is PrisonTestBase {
    /**
     * @dev Start, fulfill with explicit main/bonus words, and finalize a test round.
     * @param word Mock main-prize randomness.
     * @param bonus Mock bonus randomness.
     * @return id Finalized draw identifier.
     */
    function _settleBonus(uint256 word, uint256 bonus) internal returns (uint256 id) {
        id = _start();
        vrf.fulfillPair(address(prison), prison.getDraw(id).requestId, word, bonus);
        prison.finalizeDraw();
    }

    /**
     * @notice Verify: reserve a box and allow independent claims.
     * @dev Scenario: when the bonus coin flip wins.
     */
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

    /**
     * @notice Verify: leave every box available.
     * @dev Scenario: when the bonus coin flip loses.
     */
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

    /**
     * @notice Verify: not be awarded again.
     * @dev Scenario: when the last box is awarded but unclaimed.
     */
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

    /**
     * @notice Verify: resume the bonus on a later eligible draw.
     * @dev Scenario: when boxes are replenished.
     */
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

    /**
     * @notice Verify: not change the locked bonus.
     * @dev Scenario: when a box arrives after cutoff or after randomness.
     */
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

    /**
     * @notice Verify: preserve the bonus claim and permit the main claim.
     * @dev Scenario: when a bonus transfer fails.
     */
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

    /**
     * @notice Verify: revert.
     * @dev Scenario: when a different account claims a bonus.
     */
    function test_RevertWhen_ADifferentAccountClaimsABonus() external {
        _donate(boxes, bob, 0);
        _bid(alice, 1 ether);
        _settleBonus(0, 0);
        vm.expectRevert(ForgottenPrison.NotWinner.selector);
        vm.prank(bob);
        prison.claimBonus(1, bob);
    }

    /**
     * @notice Verify: be reusable without reopening the previous claim.
     * @dev Scenario: when a won box returns.
     */
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

    /**
     * @notice Verify: draw every wizard alongside warriors without replacement.
     * @dev Scenario: when three wizards share the prize pool.
     */
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

    /**
     * @notice Verify: remain reserved while unassigned boxes are recoverable.
     * @dev Scenario: when a finalized bonus survives shutdown.
     */
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

    /**
     * @notice Verify: ignore it and accept the subsequent valid response.
     * @dev Scenario: when the callback contains an incorrect number of words.
     */
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
