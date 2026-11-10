/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import {Test} from "forge-std/Test.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import {ForgottenPrison} from "../../src/ForgottenPrison.sol";
import {MockVRFCoordinator} from "../mocks/MockVRFCoordinator.sol";

/**
 * @title Mainnet NFT Integration Test
 * @notice Validate actual warrior, wizard, and Imp Box transfer behavior in a pinned local fork.
 */
contract MainnetAssetsTest is Test {
    address internal constant WARRIORS = 0x9690b63Eb85467BE5267A3603f770589Ab12Dc95;
    address internal constant WIZARDS = 0x521f9C7505005CFA19A8E5786a9c3c9c9F5e6f42;
    address internal constant BOXES = 0x59775fD5F266C216D7566eB216153aB8863C9c84;
    uint256 internal constant FORK_BLOCK = 26_327_000;

    /**
     * @notice Exercise real NFT identities, safe/plain donations, syncing, both claims, and returned-prize
     *   reuse.
     * @dev Forks block 26,327,000 using MAINNET_RPC_URL. NFT holders are impersonated only in local fork
     *   state; the oracle is a mock and no NFT or ETH transfers are broadcast.
     */
    function testFork_RealAssetsCanBeDonatedSyncedAwardedClaimedAndReturned() external {
        vm.createSelectFork(vm.envString("MAINNET_RPC_URL"), FORK_BLOCK);
        assertEq(block.chainid, 1);
        _identity(WARRIORS, "ForgottenRunesWarriorsGuild");
        _identity(WIZARDS, "ForgottenRunesWizardsCult");
        _identity(BOXES, "NightmareImpTreasureBox");
        MockVRFCoordinator vrf = new MockVRFCoordinator();
        ForgottenPrison prison = new ForgottenPrison(
            address(this),
            WARRIORS,
            WIZARDS,
            BOXES,
            ForgottenPrison.VRFConfig(address(vrf), 1, bytes32(uint256(1)), 150_000, 3, true)
        );

        _send(WARRIORS, 1, address(prison), true);
        _send(WIZARDS, 0, address(prison), false);
        prison.syncReceivedNFT(WIZARDS, 0);
        _send(BOXES, 1, address(prison), true);
        address winner = address(0xB1D);
        vm.deal(winner, 2 ether);
        vm.prank(winner);
        prison.bid{value: 1 ether}();
        vm.warp(prison.nextDrawAt());
        prison.startDailyDraw();
        vrf.fulfillPair(address(prison), 1, 1, 0);
        prison.finalizeDraw();
        vm.prank(winner);
        prison.claimNFT(1, winner);
        vm.prank(winner);
        prison.claimBonus(1, winner);
        assertEq(IERC721(WIZARDS).ownerOf(0), winner);
        assertEq(IERC721(BOXES).ownerOf(1), winner);
        _send(WIZARDS, 0, address(prison), true);
        _send(BOXES, 1, address(prison), false);
        prison.syncReceivedNFT(BOXES, 1);
        vm.prank(winner);
        prison.bid{value: 1 ether}();
        vm.warp(prison.nextDrawAt());
        prison.startDailyDraw();
        vrf.fulfillPair(address(prison), 2, 0, 0);
        prison.finalizeDraw();
        vm.prank(winner);
        prison.claimNFT(2, winner);
        vm.prank(winner);
        prison.claimBonus(2, winner);
        assertEq(IERC721(WARRIORS).ownerOf(1), winner);
        assertEq(IERC721(BOXES).ownerOf(1), winner);
        assertEq(IERC721(WIZARDS).ownerOf(0), address(prison));
        assertEq(prison.availableTokenCount(), 1);
        assertEq(prison.proceeds(), 2 ether);
    }

    /**
     * @dev Verify deployed bytecode, ERC721 interface support, and the expected collection name.
     * @param collection Mainnet collection to inspect.
     * @param name Expected name returned by the collection.
     */
    function _identity(address collection, string memory name) private view {
        assertGt(collection.code.length, 0);
        assertTrue(IERC721(collection).supportsInterface(0x80ac58cd));
        assertEq(IERC721Metadata(collection).name(), name);
    }

    /**
     * @dev Impersonate the current holder only in the local fork and transfer an actual collection asset.
     * @param collection Mainnet NFT collection.
     * @param tokenId Existing token ID to transfer.
     * @param target Local auction receiving the token.
     * @param safe Whether to invoke the ERC721 receiver callback.
     */
    function _send(address collection, uint256 tokenId, address target, bool safe) private {
        IERC721 token = IERC721(collection);
        address holder = token.ownerOf(tokenId);
        vm.prank(holder);
        if (safe) token.safeTransferFrom(holder, target, tokenId);
        else token.transferFrom(holder, target, tokenId);
    }
}
