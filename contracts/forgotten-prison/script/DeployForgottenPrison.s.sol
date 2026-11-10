// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import {Script} from "forge-std/Script.sol";
import {ForgottenPrison} from "../src/ForgottenPrison.sol";

/// @notice No hardcoded signer, collection, owner or subscription. Dry-run by default in the README.
contract DeployForgottenPrison is Script {
    function run() external returns (ForgottenPrison prison) {
        require(block.chainid == 1, "Ethereum mainnet only; use unit tests for local deployment");
        address initialOwner = vm.envAddress("PRISON_OWNER");
        address warriors = vm.envAddress("WARRIOR_COLLECTION");
        address wizards = vm.envAddress("WIZARD_COLLECTION");
        address boxes = vm.envAddress("IMP_BOX_COLLECTION");
        address coordinator = vm.envAddress("VRF_COORDINATOR");
        // Re-check the deployment against Chainlink's official list before signing any transaction.
        require(coordinator == 0xD7f86b4b8Cae7D942340FF628F82735b7a20893a, "Unexpected mainnet coordinator");
        bytes32 keyHash = vm.envBytes32("VRF_KEY_HASH");
        (bool ok, bytes memory data) =
            coordinator.staticcall(abi.encodeWithSignature("s_provingKeys(bytes32)", keyHash));
        require(ok && data.length == 64, "Cannot verify VRF key");
        (bool exists,) = abi.decode(data, (bool, uint64));
        require(exists, "VRF key is not registered");
        ForgottenPrison.VRFConfig memory config = ForgottenPrison.VRFConfig({
            coordinator: coordinator,
            subscriptionId: vm.envUint("VRF_SUBSCRIPTION_ID"),
            keyHash: keyHash,
            callbackGasLimit: 150_000,
            requestConfirmations: 10,
            nativePayment: true
        });
        vm.startBroadcast();
        prison = new ForgottenPrison(initialOwner, warriors, wizards, boxes, config);
        vm.stopBroadcast();
    }
}
