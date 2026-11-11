/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import "../Base.t.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Terminal Shutdown Behavior Tests
 * @notice Bulloak scenarios for terminal shutdown behavior.
 */
contract ShutdownTest is PrisonTestBase {
    /**
     * @notice Verify: revert.
     * @dev Scenario: when the timeout has not elapsed.
     */
    function test_RevertWhen_TheTimeoutHasNotElapsed() external {
        vm.expectRevert(ForgottenPrison.CannotShutdown.selector);
        prison.shutdownStalledAuction();
        _bid(alice, 1 ether);
        _start();
        vm.warp(block.timestamp + 7 days - 1);
        vm.expectRevert(ForgottenPrison.CannotShutdown.selector);
        prison.shutdownStalledAuction();
    }

    /**
     * @notice Verify: close permanently and refund the locked winner.
     * @dev Scenario: when a VRF request stalls for seven days.
     */
    function test_WhenAVRFRequestStallsForSevenDays() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        _start();
        vm.warp(block.timestamp + 7 days);
        vm.prank(carol);
        prison.shutdownStalledAuction();
        vm.prank(alice);
        prison.withdrawRefund(payable(alice));
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        assertEq(alice.balance, 100 ether);
        assertEq(bob.balance, 100 ether);
        assertEq(prison.proceeds(), 0);
        assertTrue(prison.closed());
        _assertAccounting();
    }

    /**
     * @notice Verify: revert.
     * @dev Scenario: when a stranger closes an idle day after seven days. The oracle is healthy and a start
     *   would succeed, so a non-owner must not be able to brick the deployment.
     */
    function test_RevertWhen_AStrangerClosesAnIdleDayAfterSevenDays() external {
        _bid(alice, 2 ether);
        vm.warp(prison.nextDrawAt() + 7 days);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, carol));
        vm.prank(carol);
        prison.shutdownStalledAuction();
        assertFalse(prison.closed());
        uint256 id = prison.startDailyDraw();
        assertEq(prison.getDraw(id).winner, alice);
        _assertAccounting();
    }

    /**
     * @notice Verify: unlock every standing bid.
     * @dev Scenario: when the owner closes an idle day after seven days.
     */
    function test_WhenTheOwnerClosesAnIdleDayAfterSevenDays() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        vm.warp(prison.nextDrawAt() + 7 days - 1);
        vm.expectRevert(ForgottenPrison.CannotShutdown.selector);
        prison.shutdownStalledAuction();
        vm.warp(prison.nextDrawAt() + 7 days);
        prison.shutdownStalledAuction();
        assertTrue(prison.closed());
        vm.prank(alice);
        prison.cancelBid(payable(alice));
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        _assertAccounting();
    }

    /**
     * @notice Verify: require finalization instead of aborting.
     * @dev Scenario: when a random result is already available.
     */
    function test_WhenARandomResultIsAlreadyAvailable() external {
        _bid(alice, 1 ether);
        _start();
        _fulfill(0);
        vm.warp(block.timestamp + 7 days);
        vm.expectRevert(ForgottenPrison.CannotShutdown.selector);
        prison.shutdownStalledAuction();
        prison.finalizeDraw();
        assertEq(prison.proceeds(), 1 ether);
    }

    /**
     * @notice Verify: ignore the callback.
     * @dev Scenario: when a late callback follows shutdown.
     */
    function test_WhenALateCallbackFollowsShutdown() external {
        _bid(alice, 1 ether);
        _start();
        vm.warp(block.timestamp + 7 days);
        prison.shutdownStalledAuction();
        vrf.fulfill(address(prison), 1, 0);
        assertEq(prison.proceeds(), 0);
        assertEq(prison.totalRefunds(), 1 ether);
        assertEq(uint256(prison.getDraw(1).status), uint256(ForgottenPrison.DrawStatus.Aborted));
        _assertAccounting();
    }

    /**
     * @notice Verify: revert on the second withdrawal.
     * @dev Scenario: when a refunded winner withdraws twice.
     */
    function test_WhenARefundedWinnerWithdrawsTwice() external {
        _bid(alice, 1 ether);
        _start();
        vm.warp(block.timestamp + 7 days);
        prison.shutdownStalledAuction();
        vm.prank(alice);
        prison.withdrawRefund(payable(alice));
        vm.expectRevert(ForgottenPrison.ZeroAmount.selector);
        vm.prank(alice);
        prison.withdrawRefund(payable(alice));
        _assertAccounting();
    }

    /**
     * @notice Verify: preserve already assigned prizes.
     * @dev Scenario: when the owner recovers unsold inventory after shutdown.
     */
    function test_WhenTheOwnerRecoversUnsoldInventoryAfterShutdown() external {
        _bid(alice, 1 ether);
        _settle(0);
        vm.warp(prison.nextDrawAt() + 7 days);
        prison.shutdownStalledAuction();
        prison.recoverUnsoldNFT(address(nft), 1, bob);
        assertEq(nft.ownerOf(1), bob);
        assertEq(prison.availableTokenCount(), 2);
        for (uint256 i; i < prison.availableTokenCount(); i++) {
            uint256 availableId = prison.availableTokenAt(i).tokenId;
            assertTrue(availableId != 0 && availableId != 1);
            assertEq(nft.ownerOf(availableId), address(prison));
        }
        vm.expectRevert(abi.encodeWithSelector(ForgottenPrison.InvalidToken.selector, address(nft), 0));
        prison.recoverUnsoldNFT(address(nft), 0, bob);
        vm.prank(alice);
        prison.claimNFT(1, alice);
        assertEq(nft.ownerOf(0), alice);
    }

    /**
     * @notice Verify: reject bids draws and deposits.
     * @dev Scenario: when a closed auction receives new activity.
     */
    function test_WhenAClosedAuctionReceivesNewActivity() external {
        vm.warp(prison.nextDrawAt() + 7 days);
        prison.shutdownStalledAuction();
        vm.expectRevert(ForgottenPrison.AuctionClosed.selector);
        vm.prank(alice);
        prison.bid{value: 1 ether}();
        vm.expectRevert(ForgottenPrison.AuctionClosed.selector);
        prison.startDailyDraw();
        nft.mint(alice, 100);
        vm.expectRevert(ForgottenPrison.AuctionClosed.selector);
        vm.prank(alice);
        nft.safeTransferFrom(alice, address(prison), 100);
    }

    /**
     * @notice Verify: preserve the refund credit.
     * @dev Scenario: when a refund transfer fails.
     */
    function test_WhenARefundTransferFails() external {
        _bid(alice, 1 ether);
        _start();
        vm.warp(block.timestamp + 7 days);
        prison.shutdownStalledAuction();
        RejectingRecipient rejector = new RejectingRecipient();
        vm.expectRevert(ForgottenPrison.TransferFailed.selector);
        vm.prank(alice);
        prison.withdrawRefund(payable(address(rejector)));
        vm.prank(alice);
        prison.withdrawRefund(payable(alice));
        assertEq(alice.balance, 100 ether);
        _assertAccounting();
    }
}
