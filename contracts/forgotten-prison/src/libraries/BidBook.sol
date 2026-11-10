// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {RedBlackTreeLib} from "solady/utils/RedBlackTreeLib.sol";

/// @notice Solady orders distinct bid amounts; a FIFO queue at each amount resolves ties.
/// @dev No price/sequence packing or stale entries. Insert/remove are O(log distinct prices) worst case.
library BidBook {
    using RedBlackTreeLib for RedBlackTreeLib.Tree;

    error InvalidBid();
    error BidAlreadyExists();

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 sequence;
    }

    struct Entry {
        uint256 amount;
        uint256 sequence;
        address previous;
        address next;
    }

    struct Level {
        address head;
        address tail;
    }

    struct Book {
        RedBlackTreeLib.Tree prices;
        mapping(uint256 => Level) levels;
        mapping(address => Entry) entries;
    }

    function top(Book storage self) internal view returns (Bid memory) {
        // Solady's last()/value() return zero for an empty tree. Zero is never an active price.
        bytes32 highest = self.prices.last();
        uint256 amount = RedBlackTreeLib.value(highest);
        address bidder = self.levels[amount].head;
        return Bid(bidder, amount, self.entries[bidder].sequence);
    }

    function amountOf(Book storage self, address bidder) internal view returns (uint256) {
        return self.entries[bidder].amount;
    }

    function isEmpty(Book storage self) internal view returns (bool) {
        return self.prices.size() == 0;
    }

    /// @dev Caller supplies bids in sequence order; top-ups remove the old entry before appending.
    function insert(Book storage self, Bid memory bid) internal {
        require(bid.bidder != address(0) && bid.amount != 0, InvalidBid());
        require(self.entries[bid.bidder].amount == 0, BidAlreadyExists());
        Level storage level = self.levels[bid.amount];
        if (level.head == address(0)) self.prices.insert(bid.amount);
        self.entries[bid.bidder] = Entry(bid.amount, bid.sequence, level.tail, address(0));
        if (level.tail == address(0)) level.head = bid.bidder;
        else self.entries[level.tail].next = bid.bidder;
        level.tail = bid.bidder;
    }

    function remove(Book storage self, address bidder) internal returns (Bid memory removed) {
        Entry memory entry = self.entries[bidder];
        if (entry.amount == 0) return Bid(address(0), 0, 0);
        removed = Bid(bidder, entry.amount, entry.sequence);
        Level storage level = self.levels[entry.amount];
        if (entry.previous == address(0)) level.head = entry.next;
        else self.entries[entry.previous].next = entry.next;
        if (entry.next == address(0)) level.tail = entry.previous;
        else self.entries[entry.next].previous = entry.previous;
        delete self.entries[bidder];
        if (level.head == address(0)) {
            self.prices.remove(entry.amount);
            delete self.levels[entry.amount];
        }
    }
}
