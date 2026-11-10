/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import "../Base.t.sol";

/**
 * @title Deployment and Ownership Behavior Tests
 * @notice Bulloak scenarios for deployment and ownership behavior.
 */
contract ConstructorTest is PrisonTestBase {
    /**
     * @notice Verify: revert.
     * @dev Scenario: when the collection or coordinator has no code.
     */
    function test_RevertWhen_TheCollectionOrCoordinatorHasNoCode() external {
        ForgottenPrison.VRFConfig memory config = _config();
        vm.expectRevert(ForgottenPrison.InvalidConfiguration.selector);
        new ForgottenPrison(address(this), alice, address(wizards), address(boxes), config);
        config.coordinator = alice;
        vm.expectRevert(ForgottenPrison.InvalidConfiguration.selector);
        new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), config);
    }

    /**
     * @notice Verify: revert.
     * @dev Scenario: when a VRF setting is outside its supported range.
     */
    function test_RevertWhen_AVRFSettingIsOutsideItsSupportedRange() external {
        for (uint256 i; i < 7; i++) {
            ForgottenPrison.VRFConfig memory config = _config();
            if (i == 0) config.subscriptionId = 0;
            if (i == 1) config.keyHash = 0;
            if (i == 2) config.callbackGasLimit = 99_999;
            if (i == 3) config.callbackGasLimit = 2_500_001;
            if (i == 4) config.requestConfirmations = 2;
            if (i == 5) config.requestConfirmations = 201;
            if (i == 6) config.coordinator = address(0);
            vm.expectRevert(ForgottenPrison.InvalidConfiguration.selector);
            new ForgottenPrison(address(this), address(nft), address(wizards), address(boxes), config);
        }
    }

    /**
     * @notice Verify: require acceptance before proceeds control changes.
     * @dev Scenario: when ownership changes.
     */
    function test_WhenOwnershipChanges() external {
        _bid(alice, 1 ether);
        _settle(0);
        prison.transferOwnership(bob);
        vm.expectRevert();
        vm.prank(bob);
        prison.withdrawProceeds(payable(bob), 1 ether);
        vm.prank(bob);
        prison.acceptOwnership();
        vm.prank(bob);
        prison.withdrawProceeds(payable(bob), 1 ether);
        assertEq(bob.balance, 101 ether);
        _assertAccounting();
    }

    /**
     * @notice Verify: revert.
     * @dev Scenario: when collections overlap or lack code.
     */
    function test_RevertWhen_CollectionsOverlapOrLackCode() external {
        for (uint256 i; i < 5; i++) {
            address warriorsAddress = address(nft);
            address wizardsAddress = address(wizards);
            address boxesAddress = address(boxes);
            if (i == 0) wizardsAddress = alice;
            if (i == 1) boxesAddress = alice;
            if (i == 2) wizardsAddress = warriorsAddress;
            if (i == 3) boxesAddress = warriorsAddress;
            if (i == 4) boxesAddress = wizardsAddress;
            vm.expectRevert(ForgottenPrison.InvalidConfiguration.selector);
            new ForgottenPrison(address(this), warriorsAddress, wizardsAddress, boxesAddress, _config());
        }
    }
}
