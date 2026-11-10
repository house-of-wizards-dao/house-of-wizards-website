/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;

import {RedBlackTreeLib} from "solady/utils/RedBlackTreeLib.sol";

/**
 * @title Standing Bid Book
 * @notice Orders funded bids by amount and preserves FIFO priority for equal amounts.
 * @dev Uses pinned Solady RedBlackTreeLib for distinct prices and indexed queues for ties. Queue position
 *   records tie priority without a redundant per-bid sequence slot; bid amounts retain all 256 bits.
 */
library BidBook {
    using RedBlackTreeLib for RedBlackTreeLib.Tree;

    /**
     * @notice A bid has a zero bidder address or zero amount.
     */
    error InvalidBid();
    /**
     * @notice The bidder already has an active entry that must be removed before insertion.
     */
    error BidAlreadyExists();

    /**
     * @notice Bidder identity and funded amount in wei; FIFO position determines tie priority.
     */
    struct Bid {
        address bidder;
        uint256 amount;
    }

    /**
     * @dev Bid value and doubly linked neighbors within one FIFO price level; zero addresses mark queue
     *   boundaries.
     */
    struct Entry {
        uint256 amount;
        address previous;
        address next;
    }

    /**
     * @dev Head and tail bidders at one distinct amount; the head has earliest priority.
     */
    struct Level {
        address head;
        address tail;
    }

    /**
     * @dev Ordered nonzero prices, FIFO levels, and direct bidder lookup for arbitrary removal.
     */
    struct Book {
        RedBlackTreeLib.Tree prices;
        mapping(uint256 => Level) levels;
        mapping(address => Entry) entries;
    }

    /**
     * @notice Read the earliest bid at the highest funded amount.
     * @dev Solady last/value return zero for an empty tree; zero is never an active price. Lookup is O(log
     *   distinct prices).
     * @param self Bid book to inspect.
     * @return Leading bid, or an all-zero bid when empty.
     */
    function top(Book storage self) internal view returns (Bid memory) {
        bytes32 highest = self.prices.last();
        uint256 amount = RedBlackTreeLib.value(highest);
        address bidder = self.levels[amount].head;
        return Bid(bidder, amount);
    }

    /**
     * @notice Read a bidder's active amount.
     * @param self Bid book to inspect.
     * @param bidder Account to look up.
     * @return Active amount in wei, or zero when absent.
     */
    function amountOf(Book storage self, address bidder) internal view returns (uint256) {
        return self.entries[bidder].amount;
    }

    /**
     * @notice Determine whether the book has no active price levels.
     * @param self Bid book to inspect.
     * @return True when no bids remain.
     */
    function isEmpty(Book storage self) internal view returns (bool) {
        return self.prices.size() == 0;
    }

    /**
     * @notice Append a new bid to its amount's FIFO queue.
     * @dev Reject zero bidders, zero amounts, and existing entries. The caller removes a previous entry
     *   before any top-up; appending to the tail assigns the newest priority at that amount. Creating a
     *   price level costs O(log distinct prices); queue insertion is O(1).
     * @param self Bid book to mutate.
     * @param bid Funded bid to append.
     */
    function insert(Book storage self, Bid memory bid) internal {
        require(bid.bidder != address(0) && bid.amount != 0, InvalidBid());
        require(self.entries[bid.bidder].amount == 0, BidAlreadyExists());
        Level storage level = self.levels[bid.amount];
        if (level.head == address(0)) self.prices.insert(bid.amount);
        self.entries[bid.bidder] = Entry(bid.amount, level.tail, address(0));
        if (level.tail == address(0)) level.head = bid.bidder;
        else self.entries[level.tail].next = bid.bidder;
        level.tail = bid.bidder;
    }

    /**
     * @notice Remove a bidder from any position in its FIFO queue.
     * @dev Repairs both neighbors and removes the price from Solady when its last bidder leaves. Queue
     *   removal is O(1); deleting a price level costs O(log distinct prices).
     * @param self Bid book to mutate.
     * @param bidder Account to remove.
     * @return removed Former bid, or an all-zero bid when the account had no entry.
     */
    function remove(Book storage self, address bidder) internal returns (Bid memory removed) {
        Entry memory entry = self.entries[bidder];
        if (entry.amount == 0) return Bid(address(0), 0);
        removed = Bid(bidder, entry.amount);
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
