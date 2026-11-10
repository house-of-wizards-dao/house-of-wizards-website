// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import {StdInvariant} from "forge-std/StdInvariant.sol";
import {Test} from "forge-std/Test.sol";
import {InventoryHandler} from "./InventoryHandler.sol";

contract InventoryInvariantTest is StdInvariant, Test {
    InventoryHandler internal handler;

    function setUp() public {
        handler = new InventoryHandler();
        bytes4[] memory selectors = new bytes4[](10);
        selectors[0] = handler.donate.selector;
        selectors[1] = handler.sync.selector;
        selectors[2] = handler.bid.selector;
        selectors[3] = handler.advance.selector;
        selectors[4] = handler.start.selector;
        selectors[5] = handler.fulfill.selector;
        selectors[6] = handler.finalize.selector;
        selectors[7] = handler.claim.selector;
        selectors[8] = handler.shutdown.selector;
        selectors[9] = handler.recover.selector;
        targetContract(address(handler));
        targetSelector(FuzzSelector(address(handler), selectors));
        // Begin with mixed stock, an awarded/returned NFT, and an unsafe unsynced donation.
        handler.donate(0, false);
        handler.donate(16, false);
        handler.donate(32, false);
        handler.donate(33, true);
        handler.bid();
        handler.advance(1 days);
        handler.start();
        handler.fulfill(0, 0);
        handler.finalize();
        handler.claim(0);
        handler.donate(0, false);
    }

    function invariant_CustodyReservationsAndEligibleSnapshotsMatchIndependentModel() public view {
        handler.assertCustody();
    }

    function afterInvariant() public view {
        assertGt(handler.finalizations(), 0);
        assertGt(handler.returnedPrizes(), 0);
        assertGt(handler.donations(), 4);
    }
}
