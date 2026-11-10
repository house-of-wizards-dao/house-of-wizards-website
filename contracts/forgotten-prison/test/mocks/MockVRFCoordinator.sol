// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

interface IVRFReceiver {
    function rawFulfillRandomWords(uint256 requestId, uint256[] memory words) external;
}

contract MockVRFCoordinator {
    bool public failRequests;
    uint256 public requestCount;
    address public lastConsumer;
    VRFV2PlusClient.RandomWordsRequest private _lastRequest;

    function setFailRequests(bool value) external {
        failRequests = value;
    }

    function requestRandomWords(VRFV2PlusClient.RandomWordsRequest calldata request)
        external
        returns (uint256)
    {
        require(!failRequests, "subscription unavailable");
        _lastRequest = request;
        lastConsumer = msg.sender;
        return ++requestCount;
    }

    function lastRequest() external view returns (VRFV2PlusClient.RandomWordsRequest memory) {
        return _lastRequest;
    }

    function fulfill(address consumer, uint256 requestId, uint256 word) external {
        uint256[] memory words = new uint256[](2);
        words[0] = word;
        words[1] = 1;
        IVRFReceiver(consumer).rawFulfillRandomWords(requestId, words);
    }

    function fulfillPair(address consumer, uint256 requestId, uint256 word, uint256 bonusWord) external {
        uint256[] memory words = new uint256[](2);
        words[0] = word;
        words[1] = bonusWord;
        IVRFReceiver(consumer).rawFulfillRandomWords(requestId, words);
    }
}
