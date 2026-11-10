// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import "../Base.t.sol";
import {SyncOnReceipt} from "../mocks/Adversaries.sol";

contract InventoryTest is PrisonTestBase {
    function test_WhenAnyoneSafelyTransfersASupportedNFT() external {
        _donate(nft, bob, 40);
        _donate(wizards, carol, 40);
        assertEq(nft.ownerOf(40), address(prison));
        assertEq(wizards.ownerOf(40), address(prison));
        assertEq(prison.availableTokenCount(), 6);
        (uint256 eligible,) = prison.eligibleInventoryCounts();
        assertEq(eligible, 6);
    }

    function test_WhenAnyoneSyncsAnUnsafeTransfer() external {
        nft.mint(alice, 99);
        vm.prank(alice);
        nft.transferFrom(alice, address(prison), 99);
        assertEq(prison.availableTokenCount(), 4);
        vm.prank(bob);
        prison.syncReceivedNFT(address(nft), 99);
        assertEq(prison.availableTokenCount(), 5);
        vm.expectRevert(abi.encodeWithSelector(ForgottenPrison.InvalidToken.selector, address(nft), 99));
        prison.syncReceivedNFT(address(nft), 99);
    }

    function test_RevertWhen_ATokenIsNotHeldByTheAuction() external {
        nft.mint(alice, 99);
        vm.expectRevert(abi.encodeWithSelector(ForgottenPrison.InvalidToken.selector, address(nft), 99));
        prison.syncReceivedNFT(address(nft), 99);
    }

    function test_RevertWhen_AnUnrelatedCollectionIsSent() external {
        MockERC721 other = new MockERC721();
        other.mint(alice, 0);
        vm.expectRevert(ForgottenPrison.InvalidConfiguration.selector);
        vm.prank(alice);
        other.safeTransferFrom(alice, address(prison), 0);
        vm.prank(alice);
        other.transferFrom(alice, address(prison), 0);
        vm.expectRevert(ForgottenPrison.InvalidConfiguration.selector);
        prison.syncReceivedNFT(address(other), 0);
    }

    function test_RevertWhen_AReceiverCallbackIsForged() external {
        vm.expectRevert(ForgottenPrison.InvalidConfiguration.selector);
        prison.onERC721Received(alice, alice, 0, "");
        nft.mint(alice, 99);
        vm.expectRevert(abi.encodeWithSelector(ForgottenPrison.InvalidToken.selector, address(nft), 99));
        vm.prank(address(nft));
        prison.onERC721Received(alice, alice, 99, "");
    }

    function test_RevertWhen_AnAssignedPrizeIsSynced() external {
        _bid(alice, 1 ether);
        _settle(0);
        vm.expectRevert(abi.encodeWithSelector(ForgottenPrison.InvalidToken.selector, address(nft), 0));
        prison.syncReceivedNFT(address(nft), 0);
        assertEq(prison.availableTokenCount(), 3);
        vm.prank(alice);
        prison.claimNFT(1, alice);
        assertEq(nft.ownerOf(0), alice);
    }

    function test_WhenAClaimedPrizeIsSafelyReturned() external {
        _bid(alice, 1 ether);
        _settle(0);
        vm.prank(alice);
        prison.claimNFT(1, carol);
        vm.prank(carol);
        nft.safeTransferFrom(carol, address(prison), 0);
        _bid(bob, 1 ether);
        uint256 second = _settle(3);
        assertEq(prison.getDraw(second).tokenId, 0);
        vm.expectRevert(ForgottenPrison.AlreadyClaimed.selector);
        vm.prank(alice);
        prison.claimNFT(1, alice);
        vm.prank(bob);
        prison.claimNFT(second, bob);
        assertEq(nft.ownerOf(0), bob);
    }

    function test_WhenAClaimedPrizeIsUnsafelyReturned() external {
        _bid(alice, 1 ether);
        _settle(0);
        vm.prank(alice);
        prison.claimNFT(1, alice);
        vm.prank(alice);
        nft.transferFrom(alice, address(prison), 0);
        assertEq(prison.availableTokenCount(), 3);
        vm.prank(bob);
        prison.syncReceivedNFT(address(nft), 0);
        assertEq(prison.availableTokenCount(), 4);
        _bid(bob, 1 ether);
        _settle(3);
        vm.prank(bob);
        prison.claimNFT(2, bob);
        assertEq(nft.ownerOf(0), bob);
    }

    function test_WhenAnNFTArrivesAtTheCutoff() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        vm.warp(prison.nextDrawAt());
        _donate(wizards, carol, 0);
        (uint256 eligible,) = prison.eligibleInventoryCounts();
        assertEq(eligible, 4);
        prison.startDailyDraw();
        _fulfill(4);
        prison.finalizeDraw();
        assertEq(prison.getDraw(1).collection, address(nft));
        assertEq(prison.getDraw(1).tokenId, 0);
        _settle(0); // Queued wizard replaced the removed entry only after the locked selection.
        assertEq(prison.getDraw(2).collection, address(wizards));
    }

    function test_WhenAnNFTArrivesAfterRandomnessIsKnown() external {
        _bid(alice, 2 ether);
        _start();
        _fulfill(5);
        _donate(wizards, bob, 99);
        prison.finalizeDraw();
        assertEq(prison.getDraw(1).collection, address(nft));
        assertEq(prison.getDraw(1).tokenId, 1);
        _bid(bob, 1 ether);
        _settle(1);
        assertEq(prison.getDraw(2).collection, address(wizards));
    }

    function test_WhenALateArrivalRemainsBehindTheNextCutoff() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        _start();
        vm.warp(prison.nextDrawAt());
        _donate(wizards, carol, 99);
        _fulfill(0);
        prison.finalizeDraw();
        (uint256 eligible,) = prison.eligibleInventoryCounts();
        assertEq(eligible, 3);
        assertEq(prison.availableTokenAt(3).collection, address(wizards));
        prison.startDailyDraw();
        _fulfill(3);
        prison.finalizeDraw();
        assertEq(prison.getDraw(2).collection, address(nft));
        _bid(alice, 1 ether);
        _settle(0);
        assertEq(prison.getDraw(3).collection, address(wizards));
    }

    function test_WhenARawTransferPredatesCutoffButSyncFollowsIt() external {
        _bid(alice, 1 ether);
        wizards.mint(bob, 99);
        vm.prank(bob);
        wizards.transferFrom(bob, address(prison), 99);
        vm.warp(prison.nextDrawAt());
        prison.syncReceivedNFT(address(wizards), 99);
        prison.startDailyDraw();
        _fulfill(4);
        prison.finalizeDraw();
        assertEq(prison.getDraw(1).collection, address(nft));
    }

    function test_WhenAnEmptyDayHasOnlyQueuedPrizes() external {
        ForgottenPrison empty =
            new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), _config());
        vm.warp(empty.nextDrawAt());
        nft.mint(alice, 99);
        vm.prank(alice);
        nft.safeTransferFrom(alice, address(empty), 99);
        assertEq(empty.startDailyDraw(), 0);
        vm.prank(bob);
        empty.bid{value: 1 ether}();
        vm.warp(empty.nextDrawAt());
        assertEq(empty.startDailyDraw(), 1);
    }

    function test_RevertWhen_UnsoldRecoveryIsAttemptedWhileOpen() external {
        vm.expectRevert(ForgottenPrison.NotClosed.selector);
        prison.recoverUnsoldNFT(address(nft), 0, alice);
    }

    function test_WhenAClosedAuctionReceivesAnUnsafeTransfer() external {
        vm.warp(prison.nextDrawAt() + 7 days);
        prison.shutdownStalledAuction();
        nft.mint(alice, 99);
        vm.prank(alice);
        nft.transferFrom(alice, address(prison), 99);
        vm.prank(bob);
        prison.syncReceivedNFT(address(nft), 99);
        prison.recoverUnsoldNFT(address(nft), 99, carol);
        assertEq(nft.ownerOf(99), carol);
        assertTrue(prison.closed());
    }

    function test_WhenARecipientAttemptsReentrancyWhileClaiming() external {
        _bid(alice, 1 ether);
        _settle(0);
        SyncOnReceipt receiver = new SyncOnReceipt(prison);
        vm.prank(alice);
        prison.claimNFT(1, address(receiver));
        assertFalse(receiver.succeeded());
        assertEq(receiver.failureSelector(), bytes4(keccak256("ReentrancyGuardReentrantCall()")));
        assertEq(prison.availableTokenCount(), 3);
        assertEq(nft.ownerOf(0), address(receiver));
    }
}
