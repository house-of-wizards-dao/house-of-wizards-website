// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import {Test} from "forge-std/Test.sol";
import {ForgottenPrison} from "../../src/ForgottenPrison.sol";
import {MockERC721} from "../mocks/MockERC721.sol";
import {
    IVRFCoordinatorV2Plus
} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";

contract MainnetVRFTest is Test {
    // Chainlink official Ethereum mainnet V2.5 deployment; re-check before production use.
    address internal constant COORDINATOR = 0xD7f86b4b8Cae7D942340FF628F82735b7a20893a;
    bytes32 internal constant KEY_HASH = 0x8077df514608a09f83e4e8d300645594e5d7234665448ba83f51a50f842bd3d9;
    uint256 internal constant FORK_BLOCK = 26_327_000;

    function testFork_RealCoordinatorAcceptsSubscriptionAndCommitsTheRequest() external {
        // Explicit fork target fails if MAINNET_RPC_URL is missing; no silent skipped integration tests.
        vm.createSelectFork(vm.envString("MAINNET_RPC_URL"), FORK_BLOCK);
        assertEq(block.chainid, 1);
        assertGt(COORDINATOR.code.length, 0);
        IVRFCoordinatorV2Plus coordinator = IVRFCoordinatorV2Plus(COORDINATOR);
        uint256 subId = coordinator.createSubscription();
        vm.deal(address(this), 2 ether);
        coordinator.fundSubscriptionWithNative{value: 1 ether}(subId);
        MockERC721 nft = new MockERC721();
        ForgottenPrison prison = new ForgottenPrison(
            address(this),
            address(nft),
            address(new MockERC721()),
            address(new MockERC721()),
            ForgottenPrison.VRFConfig(COORDINATOR, subId, KEY_HASH, 150_000, 10, true)
        );
        coordinator.addConsumer(subId, address(prison));
        nft.mint(address(this), 77);
        nft.safeTransferFrom(address(this), address(prison), 77);
        address bidder = address(0xB1D);
        vm.deal(bidder, 1 ether);
        vm.prank(bidder);
        prison.bid{value: 0.1 ether}();
        vm.warp(prison.nextDrawAt());
        prison.startDailyDraw();
        ForgottenPrison.Draw memory draw = prison.getDraw(1);
        (bool ok, bytes memory data) =
            COORDINATOR.staticcall(abi.encodeWithSignature("s_requestCommitments(uint256)", draw.requestId));
        assertTrue(ok);
        assertTrue(abi.decode(data, (bytes32)) != bytes32(0));
        assertTrue(coordinator.pendingRequestExists(subId));
        assertEq(address(prison).balance, 0.1 ether); // Subscription funds never touch bidder funds.

        // Test only the consumer callback ABI/authentication here. No fabricated cryptographic proof:
        // a live oracle cannot fulfill a locally created request, so impersonation is explicitly scoped.
        uint256[] memory words = new uint256[](2);
        words[0] = 123;
        vm.prank(COORDINATOR);
        prison.rawFulfillRandomWords(draw.requestId, words);
        prison.finalizeDraw();
        vm.prank(bidder);
        prison.claimNFT(1, bidder);
        assertEq(nft.ownerOf(77), bidder);
        assertEq(prison.proceeds(), 0.1 ether);
    }
}
