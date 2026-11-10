// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import {Test} from "forge-std/Test.sol";
import {ForgottenPrison} from "../src/ForgottenPrison.sol";
import {MockERC721} from "./mocks/MockERC721.sol";
import {MockVRFCoordinator} from "./mocks/MockVRFCoordinator.sol";
import {RejectingRecipient, ReentrantRecipient, ForceETH} from "./mocks/Adversaries.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

abstract contract PrisonTestBase is Test {
    ForgottenPrison internal prison;
    MockERC721 internal nft;
    MockERC721 internal wizards;
    MockERC721 internal boxes;
    MockVRFCoordinator internal vrf;
    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);
    address internal carol = address(0xCA401);

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

    function _config() internal view returns (ForgottenPrison.VRFConfig memory) {
        return ForgottenPrison.VRFConfig(address(vrf), 1, bytes32(uint256(1)), 150_000, 3, true);
    }

    function _bid(address bidder, uint256 amount) internal {
        vm.prank(bidder);
        prison.bid{value: amount}();
    }

    function _start() internal returns (uint256) {
        vm.warp(prison.nextDrawAt());
        return prison.startDailyDraw();
    }

    function _fulfill(uint256 word) internal {
        ForgottenPrison.Draw memory draw = prison.getDraw(prison.pendingDrawId());
        vrf.fulfill(address(prison), draw.requestId, word);
    }

    function _donate(MockERC721 token, address sender, uint256 id) internal {
        token.mint(sender, id);
        vm.prank(sender);
        token.safeTransferFrom(sender, address(prison), id);
    }

    function _settle(uint256 word) internal returns (uint256 drawId) {
        drawId = _start();
        _fulfill(word);
        prison.finalizeDraw();
    }

    function _assertAccounting() internal view {
        assertEq(
            address(prison).balance,
            prison.totalBidEscrow() + prison.pendingPayments() + prison.proceeds() + prison.totalRefunds()
        );
    }
    receive() external payable {}
}
