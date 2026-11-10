/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import {StdInvariant} from "forge-std/StdInvariant.sol";
import {Test} from "forge-std/Test.sol";
import {PrisonHandler} from "./PrisonHandler.sol";
import {ForgottenPrison} from "../../src/ForgottenPrison.sol";

/**
 * @title Bid, ETH, and Main-Prize Invariants
 * @notice Stateful Foundry invariant tests driven by valid-action handlers.
 */
contract PrisonInvariantTest is StdInvariant, Test {
    PrisonHandler internal handler;
    ForgottenPrison internal prison;

    /**
     * @notice Target the valid-action handler and seed a completed sale plus live standing bids.
     */
    function setUp() public {
        handler = new PrisonHandler();
        prison = handler.prison();
        bytes4[] memory selectors = new bytes4[](10);
        selectors[0] = handler.bid.selector;
        selectors[1] = handler.cancel.selector;
        selectors[2] = handler.advance.selector;
        selectors[3] = handler.start.selector;
        selectors[4] = handler.fulfill.selector;
        selectors[5] = handler.finalize.selector;
        selectors[6] = handler.claim.selector;
        selectors[7] = handler.withdraw.selector;
        selectors[8] = handler.shutdown.selector;
        selectors[9] = handler.refund.selector;
        targetContract(address(handler));
        targetSelector(FuzzSelector(address(handler), selectors));

        handler.bid(0, 1 ether);
        handler.bid(1, 2 ether);
        handler.advance(1 days);
        handler.start();
        handler.fulfill(0);
        handler.finalize();
        handler.bid(1, 0.5 ether);
    }

    /**
     * @notice Ensure the campaign reached successful bids, starts, and finalizations.
     */
    function afterInvariant() public view {
        assertGt(handler.successfulBids(), 2);
        assertGt(handler.successfulDraws(), 0);
        assertGt(handler.successfulFinalizations(), 0);
    }

    /**
     * @notice Assert every ETH liability and auction balance equals the independently tracked payments and
     *   withdrawals.
     */
    function invariant_ETHAndEveryLiabilityMatchIndependentAccounting() public view {
        uint256 escrow;
        uint256 refunds;
        for (uint256 i; i < 8; i++) {
            address actor = handler.actors(i);
            assertEq(prison.bidOf(actor), handler.modelBids(actor));
            assertEq(prison.refunds(actor), handler.modelRefunds(actor));
            escrow += handler.modelBids(actor);
            refunds += handler.modelRefunds(actor);
        }
        assertEq(prison.totalBidEscrow(), escrow);
        assertEq(prison.totalRefunds(), refunds);
        assertEq(prison.pendingPayments(), handler.modelPending());
        assertEq(prison.proceeds(), handler.earned() - handler.proceedsWithdrawn());
        assertEq(address(prison).balance, handler.ethIn() - handler.ethOut());
        assertEq(address(prison).balance, escrow + refunds + handler.modelPending() + prison.proceeds());
    }

    /**
     * @notice Assert the Solady-backed leader matches a linear model after arbitrary valid actions.
     */
    function invariant_BidBookLeaderMatchesIndependentLinearOrdering() public view {
        (address expected, uint256 amount) = handler.expectedTop();
        (address actual, uint256 actualAmount) = prison.highestBid();
        assertEq(actual, expected);
        assertEq(actualAmount, amount);
    }

    /**
     * @notice Assert all 32 fixture NFTs remain accounted for as unique stock, reserved prizes, or claims.
     */
    function invariant_NoDuplicatePrizesOrLostNFTs() public view {
        assertEq(prison.availableTokenCount() + handler.assignedCount(), 32);
        assertEq(handler.nft().balanceOf(address(prison)) + handler.claims(), 32);
        bool[32] memory seen;
        for (uint256 i; i < prison.availableTokenCount(); i++) {
            uint256 tokenId = prison.availableTokenAt(i).tokenId;
            assertFalse(seen[tokenId]);
            seen[tokenId] = true;
            assertFalse(handler.assigned(tokenId));
            assertEq(handler.nft().ownerOf(tokenId), address(prison));
        }
    }
}
