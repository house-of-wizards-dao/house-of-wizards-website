/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import {Test} from "forge-std/Test.sol";
import {ForgottenPrison} from "../src/ForgottenPrison.sol";
import {MockERC721} from "./mocks/MockERC721.sol";
import {MockVRFCoordinator} from "./mocks/MockVRFCoordinator.sol";
import {RejectingRecipient, ReentrantRecipient, ForceETH} from "./mocks/Adversaries.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

/**
 * @title Forgotten Prison Test Fixture
 * @notice Shared auction, token, oracle, actor, and accounting setup for unit and fuzz tests.
 */
abstract contract PrisonTestBase is Test {
    ForgottenPrison internal prison;
    MockERC721 internal nft;
    MockERC721 internal wizards;
    MockERC721 internal boxes;
    MockVRFCoordinator internal vrf;
    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);
    address internal carol = address(0xCA401);

    /**
     * @notice Deploy three mock collections and an auction, donate four warriors, and fund test actors.
     * @dev Called by Foundry before each test; the default inventory includes token ID zero.
     */
    function setUp() public virtual {
        nft = new MockERC721();
        wizards = new MockERC721();
        boxes = new MockERC721();
        vrf = new MockVRFCoordinator();
        prison = new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), _config());
        for (uint256 i; i < 4; i++) {
            nft.mint(address(this), i);
            nft.safeTransferFrom(address(this), address(prison), i);
        }
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(carol, 100 ether);
        vm.deal(address(this), 100 ether);
    }

    /**
     * @dev Build the fixture's native-payment VRF settings for its mock coordinator.
     * @return Mock subscription configuration with 150,000 callback gas and three confirmations.
     */
    function _config() internal view returns (ForgottenPrison.VRFConfig memory) {
        return ForgottenPrison.VRFConfig(address(vrf), 1, bytes32(uint256(1)), 150_000, 3, true);
    }

    /**
     * @dev Submit an ETH bid while impersonating a test actor.
     * @param bidder Funded actor placing the bid.
     * @param amount Additional ETH in wei.
     */
    function _bid(address bidder, uint256 amount) internal {
        vm.prank(bidder);
        prison.bid{value: amount}();
    }

    /**
     * @dev Warp to the next cutoff and start a round.
     * @return Created draw identifier, or zero for an empty day.
     */
    function _start() internal returns (uint256) {
        vm.warp(prison.nextDrawAt());
        return prison.startDailyDraw();
    }

    /**
     * @dev Fulfill the pending request with a chosen main word and an odd bonus word.
     * @param word Main-prize randomness used by the mock.
     */
    function _fulfill(uint256 word) internal {
        ForgottenPrison.Draw memory draw = prison.getDraw(prison.pendingDrawId());
        vrf.fulfill(address(prison), draw.requestId, word);
    }

    /**
     * @dev Mint an NFT to a test actor and safely donate it to the auction.
     * @param token Mock collection to mint from.
     * @param sender Donor impersonated for the transfer.
     * @param id Token ID to mint and transfer.
     */
    function _donate(MockERC721 token, address sender, uint256 id) internal {
        token.mint(sender, id);
        vm.prank(sender);
        token.safeTransferFrom(sender, address(prison), id);
    }

    /**
     * @dev Start, fulfill, and finalize a round with no bonus win.
     * @param word Mock main-prize randomness.
     * @return drawId Finalized round identifier.
     */
    function _settle(uint256 word) internal returns (uint256 drawId) {
        drawId = _start();
        _fulfill(word);
        prison.finalizeDraw();
    }

    /**
     * @dev Assert exact ETH conservation across active bids, pending payments, proceeds, and refunds.
     */
    function _assertAccounting() internal view {
        assertEq(
            address(prison).balance,
            prison.totalBidEscrow() + prison.pendingPayments() + prison.proceeds() + prison.totalRefunds()
        );
    }
    /**
     * @notice Accept ETH sent to the test fixture during proceeds and refund checks.
     */
    receive() external payable {}
}
