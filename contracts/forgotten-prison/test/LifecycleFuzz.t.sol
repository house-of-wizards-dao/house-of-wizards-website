/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;

import {Test} from "forge-std/Test.sol";
import {InventoryHandler} from "./invariant/InventoryHandler.sol";

/**
 * @title Adversarial Lifecycle Fuzz Tests
 * @notice Guarantee useful multi-round sequences while fuzzing randomness, returns, timing, and shutdown.
 * @dev Complements arbitrary handler interleavings with mandatory successful transitions. No completed
 *   sale is seeded in setUp, so transition assertions cannot be satisfied by fixture initialization.
 */
contract LifecycleFuzzTest is Test {
    InventoryHandler internal handler;

    /**
     * @notice Deploy an empty auction model with funded actors and externally owned NFTs.
     */
    function setUp() public {
        handler = new InventoryHandler();
    }

    /**
     * @notice Freeze an exact mixed pool while old winners return, new gifts arrive, and callbacks repeat.
     * @param word Unrestricted first main random word.
     * @param bonus Unrestricted first bonus word, covering both coin-flip outcomes.
     * @param unsafe Return the old warrior by plain transfer when true, the old box otherwise.
     * @param afterNextCutoff Register late gifts after the following cutoff when true.
     */
    function testFuzz_FrozenDrawSurvivesLateGiftsReturnsAndDuplicateCallbacks(
        uint256 word,
        uint256 bonus,
        bool unsafe,
        bool afterNextCutoff
    ) external {
        handler.donate(0, false);
        handler.donate(16, false);
        handler.donate(32, false);
        handler.donate(33, false);
        _request();
        handler.fulfill(0, 0);
        handler.finalize();
        handler.assertAll();

        handler.donate(1, false);
        handler.donate(17, false);
        handler.donate(34, false);
        _request();
        if (afterNextCutoff) vm.warp(handler.modelNextDrawAt());
        handler.claim(0);
        handler.claim(32);
        handler.donate(0, unsafe);
        handler.donate(32, !unsafe);
        handler.sync(0);
        handler.sync(32);
        handler.donate(2, false);
        handler.donate(18, true);
        handler.sync(18);
        handler.donate(35, false);
        handler.assertAll();

        for (uint256 variant; variant < 4; variant++) {
            handler.invalidCallback(variant, ~word);
            handler.assertAll();
        }
        handler.fulfill(word, bonus);
        handler.assertAll();
        handler.fulfill(~word, ~bonus);
        handler.assertAll();
        handler.probeClaim(0, false);
        handler.probeClaim(0, true);
        handler.finalize();
        handler.assertAll();
        handler.probeClaim(1, false);
        handler.probeClaim(1, true);
        for (uint256 key; key < 48; key++) {
            handler.claimWithReentry(key);
        }
        handler.forceETH(bonus);
        handler.withdraw();
        handler.assertAll();
        assertEq(handler.finalizations(), 2);
        assertEq(handler.acceptedResponses(), 2);
        assertGt(handler.ignoredResponses(), 0);
        assertEq(handler.returnedPrizes(), 2);
        assertGt(handler.staleClaimChecks(), 0);
        assertGt(handler.failedClaimChecks(), 0);
        assertGt(handler.reentryChecks(), 0);
        handler.exitAll();
    }

    /**
     * @notice Repeatedly award the same wizard and box while preserving every prior consumed claim.
     * @param word Unrestricted main randomness, mixed with the round number.
     * @param bonus Box-selection bits; clear only the independent coin bit to guarantee a bonus each round.
     * @param roundsSeed Number of successful generations bounded to 2-6.
     * @param unsafe Choose which asset uses plain transfer plus sync when it returns.
     */
    function testFuzz_RepeatedWinsKeepEveryHistoricalClaimConsumed(
        uint256 word,
        uint256 bonus,
        uint8 roundsSeed,
        bool unsafe
    ) external {
        uint256 rounds = bound(roundsSeed, 2, 6);
        handler.donate(16, false);
        handler.donate(32, false);
        for (uint256 round; round < rounds; round++) {
            _request();
            handler.fulfill(word ^ round, (bonus ^ round) & ~uint256(1));
            handler.assertAll();
            handler.finalize();
            handler.probeClaim(round, false);
            handler.probeClaim(round, true);
            handler.assertAll();
            handler.claimWithReentry(16);
            handler.claim(32);
            handler.donate(16, unsafe);
            handler.donate(32, !unsafe);
            handler.sync(16);
            handler.sync(32);
            for (uint256 old; old <= round; old++) {
                handler.probeClaim(old, false);
                handler.probeClaim(old, true);
            }
            handler.forceETH(word);
            handler.withdraw();
            handler.assertAll();
        }
        assertEq(handler.finalizations(), rounds);
        assertEq(handler.acceptedResponses(), rounds);
        assertEq(handler.returnedPrizes(), 2 * rounds);
        assertEq(handler.staleClaimChecks(), rounds * (rounds + 1));
        assertEq(handler.failedClaimChecks(), 2 * rounds);
        assertEq(handler.reentryChecks(), rounds);
        handler.exitAll();
    }

    /**
     * @notice Distinguish an unfulfilled timeout/refund from a ready draw that must settle without rerolling.
     * @param word Unrestricted main randomness when ready.
     * @param bonus Unrestricted bonus randomness when ready.
     * @param delay Additional delay bounded to 0-30 days after the seven-day timeout.
     * @param ready Deliver randomness before attempting closure when true.
     */
    function testFuzz_TimeoutRefundsRequestedDrawButCannotAbortReadyDraw(
        uint256 word,
        uint256 bonus,
        uint256 delay,
        bool ready
    ) external {
        handler.donate(0, false);
        handler.donate(32, false);
        _request();
        if (ready) handler.fulfill(word, bonus);
        vm.warp(block.timestamp + 7 days + bound(delay, 0, 30 days));
        handler.shutdown();
        handler.assertAll();
        assertEq(handler.modelClosed(), !ready);
        handler.invalidCallback(3, ~word);
        handler.assertAll();
        if (ready) handler.finalize();
        handler.forceETH(word);
        handler.withdraw();
        handler.assertAll();
        handler.exitAll();
    }

    /**
     * @dev Fund a new standing bid and request its draw exactly at the independently tracked cutoff.
     */
    function _request() internal {
        handler.bid();
        vm.warp(handler.modelNextDrawAt());
        handler.start();
        handler.assertAll();
    }
}
