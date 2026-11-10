// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import "../Base.t.sol";

contract ShutdownTest is PrisonTestBase {
    function test_RevertWhen_TheTimeoutHasNotElapsed() external {
        vm.expectRevert(ForgottenPrison.CannotShutdown.selector);
        prison.shutdownStalledAuction();
        _bid(alice, 1 ether);
        _start();
        vm.warp(block.timestamp + 7 days - 1);
        vm.expectRevert(ForgottenPrison.CannotShutdown.selector);
        prison.shutdownStalledAuction();
    }

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

    function test_WhenAnUnstartedDayStallsForSevenDays() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        vm.warp(prison.nextDrawAt() + 7 days);
        prison.shutdownStalledAuction();
        vm.prank(alice);
        prison.cancelBid(payable(alice));
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        _assertAccounting();
    }

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
