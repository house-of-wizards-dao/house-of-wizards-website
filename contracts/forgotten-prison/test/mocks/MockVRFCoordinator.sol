/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

/**
 * @title Test VRF Receiver Interface
 * @notice Callback ABI used by the mock coordinator.
 */
interface IVRFReceiver {
    /**
     * @notice Deliver random words using the consumer callback ABI.
     * @param requestId Request being fulfilled.
     * @param words Random values supplied by the test coordinator.
     */
    function rawFulfillRandomWords(uint256 requestId, uint256[] memory words) external;
}

/**
 * @title Test VRF Coordinator
 * @notice Record subscription requests and deliver caller-chosen randomness for local tests.
 * @dev Does not verify cryptographic proofs or charge fees and must never be used as a production oracle.
 */
contract MockVRFCoordinator {
    bool public failRequests;
    uint256 public requestCount;
    address public lastConsumer;
    VRFV2PlusClient.RandomWordsRequest private _lastRequest;

    /**
     * @notice Toggle simulated subscription request failure.
     * @param value True to reject subsequent requests.
     */
    function setFailRequests(bool value) external {
        failRequests = value;
    }

    /**
     * @notice Record a mock VRF request and assign a sequential request ID.
     * @dev Reverts while failRequests is enabled; performs no cryptographic work or billing.
     * @param request Subscription request parameters submitted by the consumer.
     * @return New nonzero request ID.
     */
    function requestRandomWords(VRFV2PlusClient.RandomWordsRequest calldata request)
        external
        returns (uint256)
    {
        require(!failRequests, "subscription unavailable");
        _lastRequest = request;
        lastConsumer = msg.sender;
        return ++requestCount;
    }

    /**
     * @notice Inspect the most recently recorded subscription request.
     * @return Stored request parameters.
     */
    function lastRequest() external view returns (VRFV2PlusClient.RandomWordsRequest memory) {
        return _lastRequest;
    }

    /**
     * @notice Deliver a main-prize word with a fixed losing bonus roll.
     * @param consumer Address receiving the callback.
     * @param requestId Request identifier passed through to the consumer.
     * @param word Main-prize randomness; the bonus word is one.
     */
    function fulfill(address consumer, uint256 requestId, uint256 word) external {
        uint256[] memory words = new uint256[](2);
        words[0] = word;
        words[1] = 1;
        IVRFReceiver(consumer).rawFulfillRandomWords(requestId, words);
    }

    /**
     * @notice Deliver two explicit random words, including stale or duplicate responses for negative tests.
     * @param consumer Address receiving the callback.
     * @param requestId Request identifier passed through to the consumer.
     * @param word Main-prize randomness.
     * @param bonusWord Bonus coin-flip and box-selection randomness.
     */
    function fulfillPair(address consumer, uint256 requestId, uint256 word, uint256 bonusWord) external {
        uint256[] memory words = new uint256[](2);
        words[0] = word;
        words[1] = bonusWord;
        IVRFReceiver(consumer).rawFulfillRandomWords(requestId, words);
    }
}
