// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import {Test} from "forge-std/Test.sol";
import {ForgottenPrison} from "../../src/ForgottenPrison.sol";
import {MockERC721} from "../mocks/MockERC721.sol";
import {MockVRFCoordinator} from "../mocks/MockVRFCoordinator.sol";

/// @dev Independent per-token custody model. Eligibility uses registration timestamps, never pool indices.
contract InventoryHandler is Test {
    enum State {
        Outside,
        Unregistered,
        Available,
        Reserved
    }
    ForgottenPrison public prison;
    MockVRFCoordinator public vrf;
    MockERC721[3] public tokens;
    State[48] public states;
    uint256[48] public registeredAt;
    bool[48] public frozen;
    uint256[48] public reservation;
    uint256 public frozenBoxes;
    uint256 public finalizations;
    uint256 public donations;
    uint256 public returnedPrizes;
    bool[48] public everClaimed;
    address public bidder = address(0xB1D);
    address public donor = address(0xD00);

    constructor() {
        for (uint256 c; c < 3; c++) {
            tokens[c] = new MockERC721();
            for (uint256 id; id < 16; id++) {
                tokens[c].mint(donor, id);
            }
        }
        vrf = new MockVRFCoordinator();
        prison = new ForgottenPrison(
            address(this),
            address(tokens[0]),
            address(tokens[1]),
            address(tokens[2]),
            ForgottenPrison.VRFConfig(address(vrf), 1, bytes32(uint256(1)), 150_000, 3, true)
        );
        vm.deal(bidder, 1_000_000 ether);
    }

    function donate(uint256 seed, bool unsafe) public {
        uint256 key = seed % 48;
        if (states[key] != State.Outside || prison.closed()) return;
        MockERC721 token = tokens[key / 16];
        uint256 id = key % 16;
        address holder = token.ownerOf(id);
        vm.prank(holder);
        if (unsafe) {
            token.transferFrom(holder, address(prison), id);
            states[key] = State.Unregistered;
        } else {
            token.safeTransferFrom(holder, address(prison), id);
            states[key] = State.Available;
            registeredAt[key] = block.timestamp;
        }
        donations++;
        if (everClaimed[key]) returnedPrizes++;
    }

    function sync(uint256 seed) public {
        uint256 key = seed % 48;
        if (states[key] != State.Unregistered) return;
        prison.syncReceivedNFT(address(tokens[key / 16]), key % 16);
        states[key] = State.Available;
        registeredAt[key] = block.timestamp;
    }

    function bid() public {
        if (prison.closed() || block.timestamp >= prison.nextDrawAt() || prison.availableTokenCount() == 0) {
            return;
        }
        vm.prank(bidder);
        prison.bid{value: 1 ether}();
    }

    function advance(uint256 elapsed) public {
        vm.warp(block.timestamp + bound(elapsed, 0, 2 days));
    }

    function start() public {
        if (prison.closed() || prison.pendingDrawId() != 0 || block.timestamp < prison.nextDrawAt()) return;
        uint256 mainCount;
        uint256 boxCount;
        for (uint256 key; key < 48; key++) {
            frozen[key] = states[key] == State.Available && registeredAt[key] < prison.nextDrawAt();
            if (!frozen[key]) continue;
            if (key < 32) mainCount++;
            else boxCount++;
        }
        (, uint256 price) = prison.highestBid();
        uint256 id = prison.startDailyDraw();
        if (mainCount == 0 || price == 0) {
            assertEq(id, 0);
            return;
        }
        assertGt(id, 0);
        ForgottenPrison.Draw memory draw = prison.getDraw(id);
        assertEq(draw.inventorySize, mainCount);
        assertEq(draw.boxInventorySize, boxCount);
        frozenBoxes = boxCount;
    }

    function fulfill(uint256 word, uint256 bonus) public {
        uint256 id = prison.pendingDrawId();
        if (id == 0) return;
        vrf.fulfillPair(address(prison), prison.getDraw(id).requestId, word, bonus);
    }

    function finalize() public {
        uint256 id = prison.pendingDrawId();
        if (id == 0 || prison.getDraw(id).status != ForgottenPrison.DrawStatus.Ready) return;
        prison.finalizeDraw();
        ForgottenPrison.Draw memory draw = prison.getDraw(id);
        uint256 key = (draw.collection == address(tokens[0]) ? 0 : 16) + draw.tokenId;
        assertTrue(draw.collection == address(tokens[0]) || draw.collection == address(tokens[1]));
        assertTrue(frozen[key]);
        assertEq(uint256(states[key]), uint256(State.Available));
        states[key] = State.Reserved;
        reservation[key] = id;
        assertEq(draw.bonusAwarded, frozenBoxes > 0 && draw.bonusWord % 2 == 0);
        if (draw.bonusAwarded) {
            key = 32 + draw.boxTokenId;
            assertTrue(frozen[key]);
            assertEq(uint256(states[key]), uint256(State.Available));
            states[key] = State.Reserved;
            reservation[key] = id;
        }
        finalizations++;
    }

    function claim(uint256 seed) public {
        uint256 key = seed % 48;
        if (states[key] != State.Reserved) return;
        uint256 id = reservation[key];
        vm.prank(bidder);
        if (key < 32) prison.claimNFT(id, donor);
        else prison.claimBonus(id, donor);
        states[key] = State.Outside;
        everClaimed[key] = true;
    }

    function shutdown() public {
        if (prison.closed()) return;
        uint256 id = prison.pendingDrawId();
        uint256 deadline = prison.nextDrawAt();
        if (id != 0) {
            ForgottenPrison.Draw memory draw = prison.getDraw(id);
            if (draw.status != ForgottenPrison.DrawStatus.Requested) return;
            deadline = draw.requestedAt;
        }
        if (block.timestamp < deadline + 7 days) return;
        prison.shutdownStalledAuction();
    }

    function recover(uint256 seed) public {
        uint256 key = seed % 48;
        if (!prison.closed() || states[key] != State.Available) return;
        prison.recoverUnsoldNFT(address(tokens[key / 16]), key % 16, donor);
        states[key] = State.Outside;
    }

    function assertCustody() external view {
        uint256 mainCount;
        uint256 boxCount;
        uint256[3] memory held;
        for (uint256 key; key < 48; key++) {
            MockERC721 token = tokens[key / 16];
            uint256 tokenId = key % 16;
            if (states[key] != State.Outside) held[key / 16]++;
            assertEq(token.ownerOf(tokenId) == address(prison), states[key] != State.Outside);
            if (states[key] == State.Available) {
                if (key < 32) mainCount++;
                else boxCount++;
                assertEq(
                    uint256(prison.tokenStatus(address(token), tokenId)),
                    uint256(ForgottenPrison.TokenStatus.Available)
                );
            }
            if (states[key] == State.Reserved) {
                assertEq(
                    uint256(prison.tokenStatus(address(token), tokenId)),
                    uint256(ForgottenPrison.TokenStatus.Assigned)
                );
                ForgottenPrison.Draw memory draw = prison.getDraw(reservation[key]);
                assertFalse(key < 32 ? draw.claimed : draw.bonusClaimed);
            }
        }
        assertEq(prison.availableTokenCount(), mainCount);
        assertEq(prison.availableBoxCount(), boxCount);
        bool[48] memory seen;
        for (uint256 i; i < mainCount; i++) {
            ForgottenPrison.Asset memory asset = prison.availableTokenAt(i);
            assertTrue(asset.collection == address(tokens[0]) || asset.collection == address(tokens[1]));
            uint256 key = (asset.collection == address(tokens[0]) ? 0 : 16) + asset.tokenId;
            assertFalse(seen[key]);
            assertEq(uint256(states[key]), uint256(State.Available));
            seen[key] = true;
        }
        for (uint256 i; i < boxCount; i++) {
            uint256 key = 32 + prison.availableBoxAt(i);
            assertFalse(seen[key]);
            assertEq(uint256(states[key]), uint256(State.Available));
            seen[key] = true;
        }
        for (uint256 c; c < 3; c++) {
            assertEq(tokens[c].balanceOf(address(prison)), held[c]);
        }
    }
}
