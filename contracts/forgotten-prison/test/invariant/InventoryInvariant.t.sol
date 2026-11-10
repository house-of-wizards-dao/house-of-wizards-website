/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import {StdInvariant} from "forge-std/StdInvariant.sol";
import {Test} from "forge-std/Test.sol";
import {InventoryHandler} from "./InventoryHandler.sol";

/**
 * @title Shared Inventory Campaign Fixture
 * @notice Seed history, then separately measure generated actions and validate terminal exits.
 */
abstract contract InventoryInvariantBase is StdInvariant, Test {
    InventoryHandler internal handler;

    /**
     * @dev Configure open-auction or terminal-exit action selection with mixed and returned inventory.
     * @param terminal Include shutdown and recovery in random actions when true.
     */
    function _setUp(bool terminal) internal {
        handler = new InventoryHandler();
        bytes4[] memory selectors = new bytes4[](terminal ? 18 : 16);
        selectors[0] = handler.donate.selector;
        selectors[1] = handler.sync.selector;
        selectors[2] = handler.bid.selector;
        selectors[3] = handler.advance.selector;
        selectors[4] = handler.start.selector;
        selectors[5] = handler.fulfill.selector;
        selectors[6] = handler.finalize.selector;
        selectors[7] = handler.claim.selector;
        selectors[8] = handler.withdraw.selector;
        selectors[9] = handler.cancel.selector;
        selectors[10] = handler.forceETH.selector;
        selectors[11] = handler.invalidCallback.selector;
        selectors[12] = handler.probeClaim.selector;
        selectors[13] = handler.claimWithReentry.selector;
        selectors[14] = handler.progress.selector;
        selectors[15] = handler.recycle.selector;
        if (terminal) {
            selectors[16] = handler.shutdown.selector;
            selectors[17] = handler.recover.selector;
        }
        targetContract(address(handler));
        targetSelector(FuzzSelector(address(handler), selectors));

        for (uint256 i; i < 4; i++) {
            handler.donate(i, false);
            handler.donate(16 + i, false);
            handler.donate(32 + i, false);
        }
        handler.donate(36, true);
        handler.bid();
        handler.advance(1 days);
        handler.start();
        handler.fulfill(0, 0);
        handler.finalize();
        handler.claim(0);
        handler.claim(32);
        handler.donate(0, false);
        handler.donate(32, true);
        handler.assertAll();
        handler.resetMetrics();
    }

    /**
     * @notice Check immutable results, historical claims, custody, eligibility, and ETH after each action.
     */
    function invariant_DrawsClaimsInventoryAndETHMatchIndependentModel() public view {
        handler.assertAll();
    }

    /**
     * @notice Report generated activity before teardown, then settle or abort and exit every claim/balance.
     * @dev Setup cannot satisfy these counters. Exit checks apply even to sequences with no completed draw.
     */
    function afterInvariant() public {
        emit log_named_uint("generated finalizations", handler.finalizations());
        emit log_named_uint("generated accepted responses", handler.acceptedResponses());
        emit log_named_uint("generated ignored responses", handler.ignoredResponses());
        emit log_named_uint("generated returned prizes", handler.returnedPrizes());
        emit log_named_uint("generated stale claim checks", handler.staleClaimChecks());
        emit log_named_uint("generated failed claim checks", handler.failedClaimChecks());
        emit log_named_uint("generated reentry checks", handler.reentryChecks());
        handler.exitAll();
    }
}

/**
 * @title Continuing Inventory Invariants
 * @notice Explore repeated rounds and returned prizes without early terminal closure dominating the run.
 */
contract InventoryInvariantTest is InventoryInvariantBase {
    /**
     * @notice Select continuing-auction actions and seed independent model history.
     */
    function setUp() public {
        _setUp(false);
    }
}

/**
 * @title Terminal Inventory Invariants
 * @notice Explore timeout, late callbacks, raw gifts after closure, and recovery alongside normal actions.
 */
contract InventoryShutdownInvariantTest is InventoryInvariantBase {
    /**
     * @notice Include terminal closure and unsold recovery in random action selection.
     */
    function setUp() public {
        _setUp(true);
    }
}
