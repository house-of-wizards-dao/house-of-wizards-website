// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import {ForgottenPrison} from "../../src/ForgottenPrison.sol";

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract RejectingRecipient {
    receive() external payable {
        revert("no ETH");
    }
}

contract ReentrantRecipient {
    ForgottenPrison public immutable prison;
    bytes public payload;
    bool public reentrySucceeded;

    constructor(ForgottenPrison target) {
        prison = target;
    }

    function setPayload(bytes calldata value) external {
        payload = value;
    }

    function placeBid() external payable {
        prison.bid{value: msg.value}();
    }

    function cancel() external {
        prison.cancelBid(payable(address(this)));
    }

    function acceptOwnership() external {
        prison.acceptOwnership();
    }

    function withdraw(uint256 amount) external {
        prison.withdrawProceeds(payable(address(this)), amount);
    }

    receive() external payable {
        (reentrySucceeded,) = address(prison).call(payload);
    }
}

contract ForceETH {
    constructor(address payable target) payable {
        selfdestruct(target);
    }
}

contract SyncOnReceipt is IERC721Receiver {
    ForgottenPrison internal prison;
    bool public succeeded;
    bytes4 public failureSelector;

    constructor(ForgottenPrison target) {
        prison = target;
    }

    function onERC721Received(address, address, uint256 id, bytes calldata) external returns (bytes4) {
        bytes memory result;
        (succeeded, result) = address(prison).call(abi.encodeCall(prison.syncReceivedNFT, (msg.sender, id)));
        if (result.length >= 4) failureSelector = bytes4(result);
        return IERC721Receiver.onERC721Received.selector;
    }
}
