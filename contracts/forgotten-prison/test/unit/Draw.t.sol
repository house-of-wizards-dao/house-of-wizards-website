// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import "../Base.t.sol";

contract DrawTest is PrisonTestBase {
    function test_RevertWhen_CalledBeforeTheDailyDeadline() external {
        vm.expectRevert(ForgottenPrison.TooEarly.selector);
        prison.startDailyDraw();
    }

    function test_WhenAnyoneCallsAtTheDeadline() external {
        _bid(alice, 1 ether);
        _bid(bob, 2 ether);
        vm.warp(prison.nextDrawAt());
        vm.prank(carol);
        uint256 id = prison.startDailyDraw();
        ForgottenPrison.Draw memory draw = prison.getDraw(id);
        assertEq(draw.winner, bob);
        assertEq(draw.price, 2 ether);
        assertEq(prison.bidOf(bob), 0);
        VRFV2PlusClient.RandomWordsRequest memory request = vrf.lastRequest();
        assertEq(request.numWords, 2);
        assertEq(request.subId, 1);
        assertEq(request.requestConfirmations, 3);
        assertEq(request.extraArgs, VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1(true)));
        assertEq(vrf.lastConsumer(), address(prison));
        _assertAccounting();
    }

    function test_RevertWhen_ARequestIsAlreadyPending() external {
        _bid(alice, 1 ether);
        _start();
        vm.warp(prison.nextDrawAt());
        vm.expectRevert(ForgottenPrison.DrawPending.selector);
        prison.startDailyDraw();
        assertEq(vrf.requestCount(), 1);
    }

    function test_WhenTheSubscriptionRequestFails() external {
        _bid(alice, 1 ether);
        vrf.setFailRequests(true);
        vm.warp(prison.nextDrawAt());
        uint256 deadline = prison.nextDrawAt();
        vm.expectRevert(bytes("subscription unavailable"));
        prison.startDailyDraw();
        assertEq(prison.nextDrawAt(), deadline);
        assertEq(prison.pendingPayments(), 0);
        assertEq(prison.drawCount(), 0);
        vrf.setFailRequests(false);
        prison.startDailyDraw();
        assertEq(prison.getDraw(1).winner, alice);
        _assertAccounting();
    }

    function test_WhenTheDayHasNoBids() external {
        vm.warp(prison.nextDrawAt());
        assertEq(prison.startDailyDraw(), 0);
        assertEq(vrf.requestCount(), 0);
        _bid(alice, 1 ether);
        uint256 id = _start();
        assertEq(prison.getDraw(id).winner, alice);
    }

    function test_WhenTheDayHasNoInventory() external {
        ForgottenPrison empty =
            new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), _config());
        vm.warp(empty.nextDrawAt());
        assertEq(empty.startDailyDraw(), 0);
        assertEq(vrf.requestCount(), 0);
    }

    function test_RevertWhen_AnUnauthorizedAccountFulfills() external {
        _bid(alice, 1 ether);
        _start();
        uint256[] memory words = new uint256[](1);
        vm.expectRevert();
        vm.prank(alice);
        prison.rawFulfillRandomWords(1, words);
        assertEq(uint256(prison.getDraw(1).status), uint256(ForgottenPrison.DrawStatus.Requested));
    }

    function test_WhenTheWrongRequestIsFulfilled() external {
        _bid(alice, 1 ether);
        _start();
        vrf.fulfill(address(prison), 777, 0);
        vm.expectRevert(ForgottenPrison.RandomnessNotReady.selector);
        prison.finalizeDraw();
    }

    function test_WhenZeroRandomnessIsReturned() external {
        _bid(alice, 1 ether);
        uint256 id = _settle(0);
        vm.prank(alice);
        prison.claimNFT(id, carol);
        assertEq(nft.ownerOf(0), carol);
        _assertAccounting();
    }

    function test_WhenRandomnessIsDuplicated() external {
        _bid(alice, 1 ether);
        _start();
        _fulfill(2);
        _fulfill(3);
        prison.finalizeDraw();
        assertEq(prison.getDraw(1).tokenId, 2);
    }

    function test_RevertWhen_FinalizationPrecedesRandomness() external {
        _bid(alice, 1 ether);
        _start();
        vm.expectRevert(ForgottenPrison.RandomnessNotReady.selector);
        prison.finalizeDraw();
    }

    function test_WhenAnyoneFinalizesAReadyDraw() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        _start();
        _fulfill(1);
        vm.prank(carol);
        prison.finalizeDraw();
        assertEq(prison.proceeds(), 2 ether);
        assertEq(prison.pendingPayments(), 0);
        assertEq(prison.availableTokenCount(), 3);
        vm.prank(alice);
        prison.claimNFT(1, alice);
        assertEq(nft.ownerOf(1), alice);
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        assertEq(bob.balance, 100 ether);
        _assertAccounting();
    }

    function test_RevertWhen_ADrawIsFinalizedTwice() external {
        _bid(alice, 1 ether);
        _settle(0);
        vm.expectRevert(ForgottenPrison.NoPendingDraw.selector);
        prison.finalizeDraw();
    }

    function test_WhenMultipleDaysAreDrawn() external {
        bool[4] memory seen;
        for (uint256 i; i < 4; i++) {
            _bid(alice, 1 ether);
            uint256 id = _settle(type(uint256).max - i);
            uint256 token = prison.getDraw(id).tokenId;
            assertFalse(seen[token]);
            seen[token] = true;
        }
        assertEq(prison.availableTokenCount(), 0);
        assertEq(prison.proceeds(), 4 ether);
        _assertAccounting();
    }

    function test_WhenALateCallerStartsADraw() external {
        _bid(alice, 1 ether);
        vm.warp(prison.nextDrawAt() + 3 days);
        prison.startDailyDraw();
        assertEq(prison.nextDrawAt(), block.timestamp + 1 days);
        _fulfill(0);
        prison.finalizeDraw();
        vm.expectRevert(ForgottenPrison.TooEarly.selector);
        prison.startDailyDraw();
    }

    function test_WhenAPendingDrawOutlastsTheNextCutoff() external {
        _bid(alice, 2 ether);
        _bid(bob, 1 ether);
        _start();
        vm.warp(prison.nextDrawAt());
        vm.expectRevert(ForgottenPrison.CutoffReached.selector);
        vm.prank(bob);
        prison.cancelBid(payable(bob));
        vm.expectRevert(ForgottenPrison.CutoffReached.selector);
        vm.prank(carol);
        prison.bid{value: 3 ether}();
        _fulfill(0);
        prison.finalizeDraw();
        prison.startDailyDraw();
        assertEq(prison.getDraw(2).winner, bob);
    }
}
