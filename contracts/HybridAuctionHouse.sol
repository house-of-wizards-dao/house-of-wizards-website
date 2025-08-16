// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SecureHybridAuctionHouse
 * @notice Secure hybrid auction contract that works with off-chain database
 * @dev Handles ETH payments and settlement while metadata stays off-chain
 */
contract SecureHybridAuctionHouse is ReentrancyGuard, Ownable, Pausable {
    struct Auction {
        address payable seller;
        address payable highestBidder;
        uint256 highestBid;
        uint256 minIncrement;
        uint256 endTime;
        uint256 createdAt;
        bool settled;
        uint8 timeExtensions; // Track number of extensions
        string offchainId; // Links to Supabase auction ID
    }

    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) public pendingWithdrawals;
    
    uint256 public auctionCounter;
    
    // Constants with reasonable limits
    uint256 public constant TIME_BUFFER = 5 minutes;
    uint256 public constant MIN_BID_INCREMENT_PERCENTAGE = 5; // 5%
    uint256 public constant MAX_AUCTION_DURATION = 30 days;
    uint256 public constant MIN_AUCTION_DURATION = 1 hours;
    uint256 public constant MAX_TIME_EXTENSIONS = 10; // Prevent infinite extensions
    uint256 public constant MAX_OFFCHAIN_ID_LENGTH = 100; // Prevent gas griefing
    uint256 public constant MAX_BID_AMOUNT = 1000 ether; // Prevent overflow issues
    uint256 public constant SETTLEMENT_GRACE_PERIOD = 1 hours; // Anyone can settle after this
    
    uint256 public protocolFeePercentage = 250; // 2.5%
    uint256 public constant MAX_PROTOCOL_FEE = 1000; // 10% maximum

    event AuctionCreated(uint256 indexed auctionId, string offchainId, address seller, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address bidder, uint256 amount, uint256 newEndTime);
    event AuctionSettled(uint256 indexed auctionId, address winner, uint256 amount);
    event AuctionCancelled(uint256 indexed auctionId);
    event Withdrawal(address indexed user, uint256 amount);
    event TimeExtension(uint256 indexed auctionId, uint256 newEndTime, uint8 extensionCount);

    modifier validAuction(uint256 auctionId) {
        require(auctionId < auctionCounter, "Invalid auction ID");
        _;
    }

    modifier onlySellerOrOwner(uint256 auctionId) {
        require(
            msg.sender == auctions[auctionId].seller || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    constructor() Ownable(msg.sender) {
        // msg.sender becomes the initial owner
    }

    /**
     * @notice Create a new auction with enhanced validation
     * @param _offchainId The Supabase auction ID for linking
     * @param _minBid Starting bid in wei
     * @param _duration Auction duration in seconds
     */
    function createAuction(
        string memory _offchainId,
        uint256 _minBid,
        uint256 _duration
    ) external whenNotPaused returns (uint256) {
        // Input validation
        require(bytes(_offchainId).length > 0 && bytes(_offchainId).length <= MAX_OFFCHAIN_ID_LENGTH, "Invalid offchain ID");
        require(_duration >= MIN_AUCTION_DURATION && _duration <= MAX_AUCTION_DURATION, "Invalid duration");
        require(_minBid > 0 && _minBid <= MAX_BID_AMOUNT, "Invalid min bid");
        
        uint256 auctionId = auctionCounter++;
        uint256 endTime = block.timestamp + _duration;
        
        auctions[auctionId] = Auction({
            seller: payable(msg.sender),
            highestBidder: payable(address(0)),
            highestBid: 0,
            minIncrement: _minBid,
            endTime: endTime,
            createdAt: block.timestamp,
            settled: false,
            timeExtensions: 0,
            offchainId: _offchainId
        });

        emit AuctionCreated(auctionId, _offchainId, msg.sender, endTime);
        return auctionId;
    }

    /**
     * @notice Place a bid on an auction with overflow protection
     * @param auctionId The auction to bid on
     */
    function placeBid(uint256 auctionId) external payable whenNotPaused validAuction(auctionId) nonReentrant {
        Auction storage auction = auctions[auctionId];
        
        require(block.timestamp < auction.endTime, "Auction ended");
        require(!auction.settled, "Auction settled");
        require(msg.value <= MAX_BID_AMOUNT, "Bid amount too high");
        
        // Calculate minimum bid with overflow protection
        uint256 minBid;
        if (auction.highestBid == 0) {
            minBid = auction.minIncrement;
        } else {
            // Check for potential overflow before calculation
            uint256 increment = auction.highestBid / 100 * MIN_BID_INCREMENT_PERCENTAGE;
            require(auction.highestBid + increment >= auction.highestBid, "Bid calculation overflow");
            minBid = auction.highestBid + increment;
        }
        
        require(msg.value >= minBid, "Bid too low");

        // Refund previous bidder
        if (auction.highestBidder != address(0)) {
            pendingWithdrawals[auction.highestBidder] += auction.highestBid;
        }

        // Update auction
        auction.highestBidder = payable(msg.sender);
        auction.highestBid = msg.value;

        // Extend auction if bid placed near end (with limits)
        uint256 newEndTime = auction.endTime;
        if (auction.endTime - block.timestamp < TIME_BUFFER && 
            auction.timeExtensions < MAX_TIME_EXTENSIONS) {
            newEndTime = block.timestamp + TIME_BUFFER;
            auction.endTime = newEndTime;
            auction.timeExtensions++;
            
            emit TimeExtension(auctionId, newEndTime, auction.timeExtensions);
        }

        emit BidPlaced(auctionId, msg.sender, msg.value, newEndTime);
    }

    /**
     * @notice Settle an auction with reentrancy protection
     * @param auctionId The auction to settle
     */
    function settleAuction(uint256 auctionId) external whenNotPaused validAuction(auctionId) nonReentrant {
        Auction storage auction = auctions[auctionId];
        
        require(block.timestamp >= auction.endTime, "Auction not ended");
        require(!auction.settled, "Already settled");
        
        // Only seller, owner, or anyone after grace period can settle
        if (block.timestamp < auction.endTime + SETTLEMENT_GRACE_PERIOD) {
            require(
                msg.sender == auction.seller || msg.sender == owner(),
                "Settlement not yet public"
            );
        }
        
        auction.settled = true;

        if (auction.highestBidder != address(0)) {
            // Calculate fees with overflow protection
            uint256 feeCalculation = auction.highestBid * protocolFeePercentage;
            require(feeCalculation / auction.highestBid == protocolFeePercentage, "Fee calculation overflow");
            
            uint256 protocolFee = feeCalculation / 10000;
            uint256 sellerProceeds = auction.highestBid - protocolFee;

            // Add to pending withdrawals instead of direct transfer to prevent reentrancy
            pendingWithdrawals[auction.seller] += sellerProceeds;
            pendingWithdrawals[owner()] += protocolFee;

            emit AuctionSettled(auctionId, auction.highestBidder, auction.highestBid);
        } else {
            emit AuctionSettled(auctionId, address(0), 0);
        }
    }

    /**
     * @notice Withdraw pending refunds with reentrancy protection
     */
    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        
        pendingWithdrawals[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(msg.sender, amount);
    }

    /**
     * @notice Cancel an auction (enhanced access control)
     * @param auctionId The auction to cancel
     */
    function cancelAuction(uint256 auctionId) external validAuction(auctionId) onlySellerOrOwner(auctionId) {
        Auction storage auction = auctions[auctionId];
        
        require(auction.highestBidder == address(0), "Has bids");
        require(!auction.settled, "Already settled");
        
        auction.settled = true;
        auction.endTime = block.timestamp;
        
        emit AuctionCancelled(auctionId);
    }

    /**
     * @notice Emergency cancel with bid refunds (owner only)
     * @param auctionId The auction to emergency cancel
     */
    function emergencyCancel(uint256 auctionId) external onlyOwner validAuction(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(!auction.settled, "Already settled");
        
        // Refund highest bidder if exists
        if (auction.highestBidder != address(0)) {
            pendingWithdrawals[auction.highestBidder] += auction.highestBid;
        }
        
        auction.settled = true;
        auction.endTime = block.timestamp;
        
        emit AuctionCancelled(auctionId);
    }

    /**
     * @notice Update protocol fee with bounds checking
     * @param _feePercentage New fee in basis points (250 = 2.5%)
     */
    function setProtocolFee(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= MAX_PROTOCOL_FEE, "Fee too high");
        protocolFeePercentage = _feePercentage;
    }

    /**
     * @notice Pause contract in emergency
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Get auction details with additional security info
     */
    function getAuction(uint256 auctionId) external view validAuction(auctionId) returns (
        address seller,
        address highestBidder,
        uint256 highestBid,
        uint256 endTime,
        uint256 createdAt,
        bool settled,
        uint8 timeExtensions,
        string memory offchainId
    ) {
        Auction memory auction = auctions[auctionId];
        return (
            auction.seller,
            auction.highestBidder,
            auction.highestBid,
            auction.endTime,
            auction.createdAt,
            auction.settled,
            auction.timeExtensions,
            auction.offchainId
        );
    }

    /**
     * @notice Check if auction can be settled publicly
     */
    function canSettlePublicly(uint256 auctionId) external view validAuction(auctionId) returns (bool) {
        Auction memory auction = auctions[auctionId];
        return block.timestamp >= auction.endTime + SETTLEMENT_GRACE_PERIOD;
    }

    /**
     * @notice Get minimum next bid for an auction
     */
    function getMinimumBid(uint256 auctionId) external view validAuction(auctionId) returns (uint256) {
        Auction memory auction = auctions[auctionId];
        
        if (auction.highestBid == 0) {
            return auction.minIncrement;
        } else {
            return auction.highestBid + (auction.highestBid * MIN_BID_INCREMENT_PERCENTAGE / 100);
        }
    }

    /**
     * @notice Check if auction time can be extended
     */
    function canExtendTime(uint256 auctionId) external view validAuction(auctionId) returns (bool) {
        Auction memory auction = auctions[auctionId];
        return auction.timeExtensions < MAX_TIME_EXTENSIONS;
    }

    /**
     * @notice Get total value locked in contract
     */
    function getTotalValueLocked() external view returns (uint256) {
        return address(this).balance;
    }
}