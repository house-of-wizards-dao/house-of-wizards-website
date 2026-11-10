/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;

import "../Base.t.sol";

/**
 * @title Auction Gas Benchmarks
 * @notice Reproducible call snapshots for the auction's funded success paths.
 * @dev Isolation gives each external call a fresh transaction context. Snapshots exclude fixture work;
 *   NFT and VRF interactions use mocks and are not estimates of oracle fees or live NFT transfer costs.
 * forge-config: default.isolate = true
 */
contract GasTest is PrisonTestBase {
    /**
     * @notice Measure inserting distinct and tied prices, topping up, and cancelling with live competitors.
     */
    function test_WhenBenchmarkingBidUpdates() external {
        assertTrue(vm.isIsolateMode());
        _bid(alice, 1 ether);
        vm.snapshotGasLastFrame("Gas", "bid_first");
        _bid(bob, 2 ether);
        vm.snapshotGasLastFrame("Gas", "bid_new_price");
        _bid(carol, 2 ether);
        vm.snapshotGasLastFrame("Gas", "bid_tied_price");
        _bid(alice, 1 ether);
        vm.snapshotGasLastFrame("Gas", "bid_top_up_into_tie");
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        vm.snapshotGasLastFrame("Gas", "cancel_tie_head");
        (address leader, uint256 amount) = prison.highestBid();
        assertEq(leader, carol);
        assertEq(amount, 2 ether);
        _assertAccounting();
    }

    /**
     * @notice Measure tree operations after funding 128 distinct standing bid amounts.
     */
    function test_WhenBenchmarkingAPopulatedBidBook() external {
        for (uint256 i = 1; i <= 128; i++) {
            address actor = address(uint160(0x1000 + i));
            vm.deal(actor, i * 1 ether);
            _bid(actor, i * 1 ether);
        }
        vm.deal(alice, 129 ether);
        _bid(alice, 129 ether);
        vm.snapshotGasLastFrame("Gas", "bid_after_128_prices");
        uint256 id = _start();
        vm.snapshotGasLastFrame("Gas", "start_after_128_prices");
        assertEq(prison.getDraw(id).winner, alice);
        _assertAccounting();
    }

    /**
     * @notice Measure automatic registration and permissionless registration after a plain transfer.
     */
    function test_WhenBenchmarkingDonationPaths() external {
        _donate(wizards, bob, 7);
        vm.snapshotGasLastFrame("Gas", "donate_wizard_safe");
        _donate(boxes, carol, 7);
        vm.snapshotGasLastFrame("Gas", "donate_box_safe");
        nft.mint(bob, 7);
        vm.prank(bob);
        nft.transferFrom(bob, address(prison), 7);
        prison.syncReceivedNFT(address(nft), 7);
        vm.snapshotGasLastFrame("Gas", "sync_warrior");
        assertEq(prison.availableTokenCount(), 6);
        assertEq(prison.availableBoxCount(), 1);
    }

    /**
     * @notice Measure a complete sale without a box, preserving the losing standing bid.
     */
    function test_WhenBenchmarkingADrawWithoutABonus() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        uint256 id = _start();
        vm.snapshotGasLastFrame("Gas", "start_two_bidders");
        _fulfill(1);
        vm.snapshotGasLastFrame("Gas", "callback_no_bonus");
        prison.finalizeDraw();
        vm.snapshotGasLastFrame("Gas", "finalize_no_bonus");
        vm.prank(alice);
        prison.claimNFT(id, alice);
        vm.snapshotGasLastFrame("Gas", "claim_main");
        prison.withdrawProceeds(payable(address(this)), 2 ether);
        vm.snapshotGasLastFrame("Gas", "withdraw_proceeds");
        assertEq(nft.ownerOf(1), alice);
        assertEq(prison.bidOf(bob), 1 ether);
        _assertAccounting();
    }

    /**
     * @notice Measure reserving both prizes and claiming the bonus independently.
     */
    function test_WhenBenchmarkingADrawWithABonus() external {
        _donate(boxes, carol, 1);
        _donate(boxes, carol, 2);
        _bid(alice, 1 ether);
        uint256 id = _start();
        vrf.fulfillPair(address(prison), prison.getDraw(id).requestId, 1, 0);
        prison.finalizeDraw();
        vm.snapshotGasLastFrame("Gas", "finalize_with_bonus");
        vm.prank(alice);
        prison.claimBonus(id, alice);
        vm.snapshotGasLastFrame("Gas", "claim_bonus");
        assertEq(boxes.ownerOf(1), alice);
        assertFalse(prison.getDraw(id).claimed);
        _assertAccounting();
    }

    /**
     * @notice Measure finalization when queued arrivals require a separate eligible-boundary and tail move.
     */
    function test_WhenBenchmarkingLateArrivals() external {
        _bid(alice, 1 ether);
        uint256 id = _start();
        _fulfill(1);
        vm.warp(prison.nextDrawAt());
        _donate(wizards, carol, 7);
        prison.finalizeDraw();
        vm.snapshotGasLastFrame("Gas", "finalize_with_queued_tail");
        assertEq(prison.getDraw(id).tokenId, 1);
        (uint256 eligible,) = prison.eligibleInventoryCounts();
        assertEq(eligible, 3);
        assertEq(prison.availableTokenCount(), 4);
    }

    /**
     * @notice Measure aborting an unfulfilled request, returning its payment, and recovering unassigned stock.
     */
    function test_WhenBenchmarkingTerminalExit() external {
        _bid(alice, 1 ether);
        _start();
        vm.warp(block.timestamp + prison.STALL_TIMEOUT());
        prison.shutdownStalledAuction();
        vm.snapshotGasLastFrame("Gas", "shutdown_pending");
        vm.prank(alice);
        prison.withdrawRefund(payable(alice));
        vm.snapshotGasLastFrame("Gas", "withdraw_refund");
        prison.recoverUnsoldNFT(address(nft), 1, alice);
        vm.snapshotGasLastFrame("Gas", "recover_unsold");
        assertEq(alice.balance, 100 ether);
        assertEq(nft.ownerOf(1), alice);
        _assertAccounting();
    }
}
