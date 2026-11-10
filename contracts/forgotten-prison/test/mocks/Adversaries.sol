/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import {ForgottenPrison} from "../../src/ForgottenPrison.sol";

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @title Rejecting ETH Recipient
 * @notice Test recipient that always rejects ETH.
 */
contract RejectingRecipient {
    /**
     * @notice Reject every ETH payment to exercise withdrawal rollback.
     */
    receive() external payable {
        revert("no ETH");
    }
}

/**
 * @title Reentrant ETH Recipient
 * @notice Test actor that attempts an auction call while receiving ETH.
 */
contract ReentrantRecipient {
    ForgottenPrison public immutable prison;
    bytes public payload;
    bool public reentrySucceeded;

    /**
     * @notice Bind this actor to the auction under test.
     * @param target Auction to call during reentry.
     */
    constructor(ForgottenPrison target) {
        prison = target;
    }

    /**
     * @notice Choose the auction call attempted by the next ETH receipt.
     * @param value ABI-encoded reentry call.
     */
    function setPayload(bytes calldata value) external {
        payload = value;
    }

    /**
     * @notice Forward msg.value into this actor's standing bid.
     */
    function placeBid() external payable {
        prison.bid{value: msg.value}();
    }

    /**
     * @notice Cancel this actor's bid back to itself to exercise its receive hook.
     */
    function cancel() external {
        prison.cancelBid(payable(address(this)));
    }

    /**
     * @notice Accept pending auction ownership as this actor for owner-withdrawal tests.
     */
    function acceptOwnership() external {
        prison.acceptOwnership();
    }

    /**
     * @notice Withdraw auction proceeds to this actor to exercise its receive hook.
     * @param amount Proceeds amount in wei.
     */
    function withdraw(uint256 amount) external {
        prison.withdrawProceeds(payable(address(this)), amount);
    }

    /**
     * @notice Attempt the configured auction call during an ETH transfer and record whether it succeeds.
     */
    receive() external payable {
        (reentrySucceeded,) = address(prison).call(payload);
    }
}

/**
 * @title Forced ETH Fixture
 * @notice Send ETH to a target without invoking its receive logic.
 */
contract ForceETH {
    /**
     * @notice Force the constructor's msg.value into the target using selfdestruct.
     * @dev Test-only use verifies forced ETH does not become owner proceeds.
     * @param target Auction receiving the forced ETH.
     */
    constructor(address payable target) payable {
        selfdestruct(target);
    }
}

/**
 * @title Reentrant NFT Recipient
 * @notice Attempt to sync a prize while its claim transfer is executing.
 */
contract SyncOnReceipt is IERC721Receiver {
    ForgottenPrison internal prison;
    bool public succeeded;
    bytes4 public failureSelector;

    /**
     * @notice Bind the receiver to the auction under test.
     * @param target Auction receiving the reentry attempt.
     */
    constructor(ForgottenPrison target) {
        prison = target;
    }

    /**
     * @notice Attempt sync during receipt and record the result and error selector.
     * @dev Accepts the NFT even when the attempted reentry fails, allowing the test to assert the guard
     *   error. Operator, sender, and data are unused.
     * @param id Claimed token ID used in the attempted sync.
     * @return ERC721 receiver acceptance selector.
     */
    function onERC721Received(address, address, uint256 id, bytes calldata) external returns (bytes4) {
        bytes memory result;
        (succeeded, result) = address(prison).call(abi.encodeCall(prison.syncReceivedNFT, (msg.sender, id)));
        if (result.length >= 4) failureSelector = bytes4(result);
        return IERC721Receiver.onERC721Received.selector;
    }
}
