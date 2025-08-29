// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

contract AuctionSystem {
    //variables
    address owner;
    enum AuctionStatus { Open, Closed, Payed }

    struct Auction{
        string name;
        uint256 initialPrice;
        uint256 currentPrice;
        address payable bidder;
        uint256 deadline;
        uint256 bidCount;
        AuctionStatus status;
    }

    Auction[] public auctions;

    mapping(string => bool) public namesUsed;

    //modifiers
    modifier OnlyOwner (){
        require(owner == msg.sender, "Only the owner can create an auction.");
        _;
    }

    modifier auctionNameAbiable(string memory _name){
        require(!namesUsed[_name], "This auction name is alredy used");
        _;
    }

    modifier onlyAuctionExists(uint256 _id) {
        require(_id < auctions.length , "This ID does not match any created auction.");
        _;
    }

    modifier checkAuctionStatus(uint256 _auctionIndex) {
        Auction storage auction = auctions[_auctionIndex];

        if (auction.status == AuctionStatus.Open && auction.deadline <= block.timestamp) {
            _closeAuction(_auctionIndex);
        }

        require(auction.status == AuctionStatus.Open, "This auction is closed");
        _;
    }

    modifier checkNewBid(uint256 _id){
        Auction storage auction = auctions[_id];
        require(msg.value > auction.currentPrice, "Offer must be higher than current price");
        require(msg.value > auction.initialPrice, "Offer must be higher than initial price");
        _;
    }

    modifier notOwner() {
        require(msg.sender != owner, "Owner cannot bid");
        _;
    }

    //events

    event CreateAuction(string _name, uint256 _initialPrice);
    event UpdatedAuctionState(string _name, AuctionStatus _currentState, uint256 _auctionIndex);
    event UpdatedBid (uint256 _auctionIndex, uint256 _newOffer, address _bidderAddress );
    event AuctionWithdraw(uint256 _auctionIndex, uint256 _amount, address _bidderAddress);

    //functions
    constructor (){
        owner = msg.sender;
    }

    function createNewAuction(string memory _name, uint256 _initialPrice, uint256 _durationInSeconds) public OnlyOwner auctionNameAbiable(_name) {
        uint256 _deadline = block.timestamp + _durationInSeconds;
        auctions.push(Auction(_name, _initialPrice, 0, payable(address(0)), _deadline, 0, AuctionStatus.Open));
        namesUsed[_name] = true;
        emit CreateAuction(_name, _initialPrice);
    }

    function sendNewBid(uint256 _auctionIndex) public payable onlyAuctionExists(_auctionIndex) notOwner checkAuctionStatus(_auctionIndex) checkNewBid(_auctionIndex){
           Auction storage auction = auctions[_auctionIndex];
            
            address payable previousBidder = auction.bidder;
            uint256 previousBid = auction.currentPrice;

            if (previousBidder != address(0)) {
                previousBidder.transfer(previousBid);
            }

            auction.currentPrice = msg.value;
            auction.bidder = payable(msg.sender);
            auction.bidCount += 1;

            emit UpdatedBid(_auctionIndex, msg.value, msg.sender);
    }


    function withdraw(uint256 _auctionIndex) public payable OnlyOwner onlyAuctionExists(_auctionIndex) {
        Auction storage auction = auctions[_auctionIndex];

        require(auction.status != AuctionStatus.Open, "This auction is not closed yet.");
        require(auction.status != AuctionStatus.Payed, "This auction is payed, can't be drawn anymore.");

        uint256 amount  = auction.currentPrice;
        payable(owner).transfer(amount);
        auction.status = AuctionStatus.Payed;

        emit AuctionWithdraw(_auctionIndex, amount, owner);

    }

    function closeAuction(uint256 _id) public OnlyOwner {
        _closeAuction(_id);
    }

    function getAuctionDetails(uint _id) public view returns ( address currentWinner, uint256 currentPrice, uint256 secondsRemaining, AuctionStatus status) {
        Auction memory a = auctions[_id];
        uint256 timeLeft = a.deadline > block.timestamp
            ? a.deadline - block.timestamp
            : 0;

        return (a.bidder, a.currentPrice, timeLeft, a.status);
    }

    function getTotalAuctions() public view returns (uint256) {
        return auctions.length;
    }

    function getBidCount(uint256 _id) public view returns (uint256) {
        return auctions[_id].bidCount;
    }

    
    function _closeAuction(uint256 _id) internal onlyAuctionExists(_id) {
        Auction storage auction = auctions[_id];
        auction.status = AuctionStatus.Closed;
        string memory auctionName = auction.name;
        emit UpdatedAuctionState(auctionName, auctions[_id].status, _id);
    }
}