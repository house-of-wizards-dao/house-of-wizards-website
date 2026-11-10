/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import "./Base.t.sol";

/**
 * @title Forgotten Prison Fuzz Tests
 * @notice Explore bid ordering, accounting, configuration boundaries, and prize randomness over generated
 *   inputs.
 */
contract PrisonFuzzTest is PrisonTestBase {
    /**
     * @notice Compare 64 generated bid/top-up/cancel actions against independent linear ordering and ETH
     *   accounting.
     * @param seed Seed expanded into actor choices, small tied prices, and operations.
     */
    function testFuzz_BidBookMatchesReferenceAcrossTiesTopUpsAndCancellations(uint256 seed) external {
        address[8] memory actors;
        uint256[8] memory amounts;
        uint256[8] memory sequences;
        uint256 sequence;
        for (uint256 i; i < actors.length; i++) {
            actors[i] = address(uint160(1000 + i));
            vm.deal(actors[i], 1_000 ether);
        }
        for (uint256 step; step < 64; step++) {
            uint256 random = uint256(keccak256(abi.encode(seed, step)));
            uint256 index = (random >> 8) % actors.length;
            bool cancel = random % 4 == 0;
            if (cancel && amounts[index] != 0) {
                vm.prank(actors[index]);
                prison.cancelBid(payable(actors[index]));
                amounts[index] = 0;
            } else if (!cancel) {
                uint256 value = (1 + ((random >> 16) % 4)) * 1 ether;
                _bid(actors[index], value);
                amounts[index] += value;
                sequences[index] = ++sequence;
            }
            address expected;
            uint256 best;
            uint256 earliest = type(uint256).max;
            uint256 escrow;
            for (uint256 i; i < actors.length; i++) {
                escrow += amounts[i];
                if (amounts[i] > best || (amounts[i] != 0 && amounts[i] == best && sequences[i] < earliest)) {
                    expected = actors[i];
                    best = amounts[i];
                    earliest = sequences[i];
                }
            }
            (address actual, uint256 actualAmount) = prison.highestBid();
            assertEq(actual, expected);
            assertEq(actualAmount, best);
            assertEq(prison.totalBidEscrow(), escrow);
            _assertAccounting();
        }
        for (uint256 i; i < actors.length; i++) {
            if (amounts[i] != 0) {
                vm.prank(actors[i]);
                prison.cancelBid(payable(actors[i]));
            }
            assertEq(actors[i].balance, 1_000 ether);
        }
        assertEq(address(prison).balance, 0);
    }

    /**
     * @notice Verify full-width bid prices survive ordering, cancellation, and settlement without
     *   truncation.
     * @param firstSeed Input bounded from 2^160 through the uint192 maximum.
     * @param secondSeed Independent input bounded to the same range.
     */
    function testFuzz_PricesAbove160BitsPreserveOrderingAndCancellation(uint192 firstSeed, uint192 secondSeed)
        external
    {
        uint256 first = bound(uint256(firstSeed), uint256(1) << 160, type(uint192).max);
        uint256 second = bound(uint256(secondSeed), uint256(1) << 160, type(uint192).max);
        vm.deal(alice, first);
        vm.deal(bob, second);
        _bid(alice, first);
        _bid(bob, second);
        address winner = first >= second ? alice : bob;
        uint256 price = first >= second ? first : second;
        (address actual, uint256 amount) = prison.highestBid();
        assertEq(actual, winner);
        assertEq(amount, price);
        vm.prank(winner);
        prison.cancelBid(payable(winner));
        uint256 id = _settle(0);
        assertEq(prison.getDraw(id).winner, winner == alice ? bob : alice);
        assertEq(prison.getDraw(id).price, first >= second ? second : first);
        _assertAccounting();
    }

    /**
     * @notice Deploy successfully across the full supported callback-gas and confirmation domains.
     * @param gasSeed Input bounded to 100,000-2,500,000 gas.
     * @param confirmationSeed Input bounded to 3-200 confirmations.
     */
    function testFuzz_ValidVRFConfigurationAcrossTheAcceptedDomain(uint32 gasSeed, uint16 confirmationSeed)
        external
    {
        ForgottenPrison.VRFConfig memory config = _config();
        config.callbackGasLimit = uint32(bound(gasSeed, 100_000, 2_500_000));
        config.requestConfirmations = uint16(bound(confirmationSeed, 3, 200));
        new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), config);
    }

    /**
     * @notice Conserve actor balances through competing bids, a top-up, loser cancellation, and owner
     *   withdrawal.
     * @param a First bidder's initial payment seed, bounded to positive uint128 values.
     * @param b Competing bidder's payment seed, bounded to positive uint128 values.
     * @param c First bidder's top-up seed, bounded to positive uint128 values.
     */
    function testFuzz_BidsConserveETHThroughTopUpsCancellationAndSale(uint128 a, uint128 b, uint128 c)
        external
    {
        uint256 first = bound(uint256(a), 1, type(uint128).max);
        uint256 second = bound(uint256(b), 1, type(uint128).max);
        uint256 topUp = bound(uint256(c), 1, type(uint128).max);
        vm.deal(alice, first + topUp);
        vm.deal(bob, second);
        _bid(alice, first);
        _bid(bob, second);
        _bid(alice, topUp);
        uint256 id = _settle(0);
        address expectedWinner = first + topUp > second ? alice : bob;
        uint256 expectedPrice = first + topUp > second ? first + topUp : second;
        assertEq(prison.getDraw(id).winner, expectedWinner);
        assertEq(prison.getDraw(id).price, expectedPrice);
        address loser = expectedWinner == alice ? bob : alice;
        vm.prank(loser);
        prison.cancelBid(payable(loser));
        prison.withdrawProceeds(payable(carol), expectedPrice);
        assertEq(address(prison).balance, 0);
        assertEq(alice.balance + bob.balance + carol.balance, first + topUp + second + 100 ether);
    }

    /**
     * @notice Verify arbitrary main randomness selects and transfers exactly one escrowed NFT.
     * @param word Unrestricted uint256 VRF output.
     */
    function testFuzz_AnyVRFWordAssignsExactlyOneEscrowedToken(uint256 word) external {
        _bid(alice, 1 ether);
        uint256 id = _settle(word);
        vm.prank(alice);
        prison.claimNFT(id, alice);
        assertEq(nft.balanceOf(alice), 1);
        assertEq(nft.balanceOf(address(prison)), 3);
        for (uint256 i; i < prison.availableTokenCount(); i++) {
            assertEq(nft.ownerOf(prison.availableTokenAt(i).tokenId), address(prison));
            assertTrue(prison.availableTokenAt(i).tokenId != prison.getDraw(id).tokenId);
        }
        _assertAccounting();
    }

    /**
     * @notice Reject confirmation settings outside 3-200 and accept values inside that range.
     * @param confirmations Unrestricted uint16 confirmation setting.
     */
    function testFuzz_RequestConfirmationsAcceptedExactlyWithinBounds(uint16 confirmations) external {
        ForgottenPrison.VRFConfig memory config = _config();
        config.requestConfirmations = confirmations;
        if (confirmations < 3 || confirmations > 200) {
            vm.expectRevert(ForgottenPrison.InvalidConfiguration.selector);
        }
        new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), config);
    }

    /**
     * @notice Reject callback gas outside 100,000-2,500,000 and accept values inside that range.
     * @param gasLimit Unrestricted uint32 callback-gas setting.
     */
    function testFuzz_CallbackGasAcceptedExactlyWithinBounds(uint32 gasLimit) external {
        ForgottenPrison.VRFConfig memory config = _config();
        config.callbackGasLimit = gasLimit;
        if (gasLimit < 100_000 || gasLimit > 2_500_000) {
            vm.expectRevert(ForgottenPrison.InvalidConfiguration.selector);
        }
        new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), config);
    }

    /**
     * @notice Conserve mixed NFT custody while excluding late donations from both locked prize selections.
     * @param word Unrestricted main-prize randomness.
     * @param bonus Unrestricted bonus randomness.
     * @param afterNextCutoff Whether donations also miss the following cutoff.
     */
    function testFuzz_MixedPrizesAndBonusExcludeAllLateArrivals(
        uint256 word,
        uint256 bonus,
        bool afterNextCutoff
    ) external {
        for (uint256 id; id < 3; id++) {
            _donate(wizards, bob, id);
            _donate(boxes, carol, id);
        }
        _bid(alice, 1 ether);
        _start();
        vrf.fulfillPair(address(prison), 1, word, bonus);
        if (afterNextCutoff) vm.warp(prison.nextDrawAt());
        _donate(nft, bob, 99);
        _donate(wizards, bob, 99);
        _donate(boxes, bob, 99);
        prison.finalizeDraw();
        ForgottenPrison.Draw memory draw = prison.getDraw(1);
        assertTrue(draw.tokenId < 4);
        assertTrue(draw.collection == address(nft) || draw.collection == address(wizards));
        vm.prank(alice);
        prison.claimNFT(1, alice);
        assertEq(nft.balanceOf(alice) + wizards.balanceOf(alice), 1);
        assertEq(prison.availableTokenCount(), 8);
        assertEq(draw.bonusAwarded, bonus % 2 == 0);
        if (draw.bonusAwarded) {
            assertLt(draw.boxTokenId, 3);
            vm.prank(alice);
            prison.claimBonus(1, alice);
            assertEq(boxes.balanceOf(alice), 1);
        }
        assertEq(boxes.balanceOf(address(prison)) + boxes.balanceOf(alice), 4);
        assertEq(nft.ownerOf(99), address(prison));
        assertEq(wizards.ownerOf(99), address(prison));
        assertEq(boxes.ownerOf(99), address(prison));
        _assertAccounting();
    }

    /**
     * @notice Hold the main word fixed while flipping the bonus bit and verify that only the bonus outcome
     *   changes.
     * @param word Unrestricted main-prize randomness.
     * @param bonus Source of the bonus word's upper bits for both runs.
     */
    function testFuzz_MainPrizeSelectionDoesNotFixTheBonusOutcome(uint256 word, uint256 bonus) external {
        _donate(boxes, bob, 0);
        _bid(alice, 1 ether);
        _start();
        uint256 snapshot = vm.snapshotState();
        vrf.fulfillPair(address(prison), 1, word, bonus & ~uint256(1));
        prison.finalizeDraw();
        uint256 prize = prison.getDraw(1).tokenId;
        assertTrue(prison.getDraw(1).bonusAwarded);
        assertTrue(vm.revertToState(snapshot));
        vrf.fulfillPair(address(prison), 1, word, bonus | 1);
        prison.finalizeDraw();
        assertEq(prison.getDraw(1).tokenId, prize);
        assertFalse(prison.getDraw(1).bonusAwarded);
        assertEq(prison.availableBoxCount(), 1);
    }
}
