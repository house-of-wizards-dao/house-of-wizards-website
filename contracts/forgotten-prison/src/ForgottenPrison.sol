// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {
    IVRFCoordinatorV2Plus
} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {BidBook} from "./libraries/BidBook.sol";

/// @notice Daily highest-bidder auctions of a mystery ERC721 from an escrowed inventory.
/// @dev V2.5 requests use Chainlink's immutable V2 callback-authentication base deliberately:
///      identical callback ABI, without V2Plus's owner-controlled coordinator migration.
contract ForgottenPrison is Ownable2Step, ReentrancyGuard, IERC721Receiver, VRFConsumerBaseV2 {
    using BidBook for BidBook.Book;
    uint256 public constant DRAW_INTERVAL = 1 days;
    uint256 public constant STALL_TIMEOUT = 7 days;

    enum DrawStatus {
        None,
        Requested,
        Ready,
        Finalized,
        Aborted
    }
    enum TokenStatus {
        None,
        Available,
        Assigned,
        Claimed
    }

    struct VRFConfig {
        address coordinator;
        uint256 subscriptionId;
        bytes32 keyHash;
        uint32 callbackGasLimit;
        uint16 requestConfirmations;
        bool nativePayment;
    }

    struct Draw {
        address winner;
        uint256 price;
        uint256 requestId;
        uint256 requestedAt;
        uint256 inventorySize;
        uint256 boxInventorySize;
        uint256 randomWord;
        uint256 bonusWord;
        address collection;
        uint256 tokenId;
        uint256 boxTokenId;
        DrawStatus status;
        bool claimed;
        bool bonusAwarded;
        bool bonusClaimed;
    }

    struct Asset {
        address collection;
        uint256 tokenId;
    }

    /// @dev Eligible entries occupy a prefix. Later arrivals append outside the frozen prefix.
    struct Inventory {
        Asset[] assets;
        mapping(address => mapping(uint256 => uint256)) position;
        uint256 eligibleCount;
    }

    error InvalidConfiguration();
    error InvalidRecipient();
    error AuctionClosed();
    error CutoffReached();
    error TooEarly();
    error DrawPending();
    error NoPendingDraw();
    error NoInventory();
    error ZeroAmount();
    error NoBid();
    error InvalidToken(address collection, uint256 tokenId);
    error RandomnessNotReady();
    error NotWinner();
    error AlreadyClaimed();
    error NoBonus();
    error InsufficientProceeds();
    error TransferFailed();
    error CannotShutdown();
    error NotClosed();

    event BidPlaced(address indexed bidder, uint256 amount, uint256 sequence);
    event BidCancelled(address indexed bidder, address indexed recipient, uint256 amount);
    event InventoryDeposited(address indexed collection, uint256 indexed tokenId, bool eligible);
    event DrawStarted(
        uint256 indexed drawId,
        address indexed winner,
        uint256 price,
        uint256 requestId,
        uint256 inventorySize,
        uint256 boxInventorySize
    );
    event RandomnessReceived(uint256 indexed drawId, uint256 indexed requestId);
    event DrawFinalized(
        uint256 indexed drawId,
        address indexed winner,
        address indexed collection,
        uint256 tokenId,
        uint256 price
    );
    event NFTClaimed(
        uint256 indexed drawId, address indexed recipient, address indexed collection, uint256 tokenId
    );
    event BonusAwarded(uint256 indexed drawId, address indexed winner, uint256 indexed tokenId);
    event BonusClaimed(uint256 indexed drawId, address indexed recipient, uint256 indexed tokenId);
    event ProceedsWithdrawn(address indexed recipient, uint256 amount);
    event Shutdown(uint256 indexed abortedDrawId);
    event RefundWithdrawn(address indexed bidder, address indexed recipient, uint256 amount);
    event UnsoldNFTRecovered(address indexed collection, uint256 indexed tokenId, address indexed recipient);
    event EmptyDaySkipped(uint256 nextDrawAt);

    IERC721 public immutable warriorCollection;
    IERC721 public immutable wizardCollection;
    IERC721 public immutable impBoxCollection;
    IVRFCoordinatorV2Plus public immutable coordinator;
    uint256 public immutable subscriptionId;
    bytes32 public immutable keyHash;
    uint32 public immutable callbackGasLimit;
    uint16 public immutable requestConfirmations;
    bool public immutable nativePayment;
    uint256 public nextDrawAt;
    uint256 public drawCount;
    uint256 public pendingDrawId;
    uint256 public totalBidEscrow;
    uint256 public pendingPayments;
    uint256 public proceeds;
    uint256 public totalRefunds;
    bool public closed;
    mapping(uint256 => Draw) private _draws;
    mapping(address => mapping(uint256 => TokenStatus)) public tokenStatus;
    mapping(address => uint256) public refunds;
    Inventory private _inventory;
    Inventory private _boxes;
    BidBook.Book private _bids;
    uint256 private _sequence;

    constructor(
        address initialOwner,
        address warriors,
        address wizards,
        address impBoxes,
        VRFConfig memory config
    ) Ownable(initialOwner) VRFConsumerBaseV2(config.coordinator) {
        require(
            warriors.code.length != 0 && wizards.code.length != 0 && impBoxes.code.length != 0
                && warriors != wizards && warriors != impBoxes && wizards != impBoxes
                && config.coordinator.code.length != 0 && config.subscriptionId != 0
                && config.keyHash != bytes32(0) && config.callbackGasLimit >= 100_000
                && config.callbackGasLimit <= 2_500_000 && config.requestConfirmations >= 3
                && config.requestConfirmations <= 200,
            InvalidConfiguration()
        );
        warriorCollection = IERC721(warriors);
        wizardCollection = IERC721(wizards);
        impBoxCollection = IERC721(impBoxes);
        coordinator = IVRFCoordinatorV2Plus(config.coordinator);
        subscriptionId = config.subscriptionId;
        keyHash = config.keyHash;
        callbackGasLimit = config.callbackGasLimit;
        requestConfirmations = config.requestConfirmations;
        nativePayment = config.nativePayment;
        nextDrawAt = block.timestamp + DRAW_INTERVAL;
    }

    /// @notice Add ETH to your standing bid. A change gets a new tie-break sequence.
    function bid() external payable nonReentrant {
        require(!closed, AuctionClosed());
        require(block.timestamp < nextDrawAt, CutoffReached());
        require(_inventory.assets.length != 0, NoInventory());
        require(msg.value != 0, ZeroAmount());
        BidBook.Bid memory previous = _bids.remove(msg.sender);
        uint256 amount = previous.amount + msg.value;
        uint256 sequence = ++_sequence;
        _bids.insert(BidBook.Bid(msg.sender, amount, sequence));
        totalBidEscrow += msg.value;
        emit BidPlaced(msg.sender, amount, sequence);
    }

    /// @notice Cancel before the next cutoff, or when exhausted/closed. Locked payments are not bids.
    function cancelBid(address payable recipient) external nonReentrant {
        _checkRecipient(recipient);
        require(closed || _inventory.assets.length == 0 || block.timestamp < nextDrawAt, CutoffReached());
        BidBook.Bid memory removed = _bids.remove(msg.sender);
        require(removed.amount != 0, NoBid());
        totalBidEscrow -= removed.amount;
        emit BidCancelled(msg.sender, recipient, removed.amount);
        _sendETH(recipient, removed.amount);
    }

    /// @notice Register a plain transferFrom donation. Anyone may sync; registration time sets eligibility.
    /// @dev Also usable after terminal closure, solely to make an unsafe transfer recoverable as unsold stock.
    function syncReceivedNFT(address collection, uint256 tokenId) external nonReentrant {
        _registerReceived(collection, tokenId);
    }

    /// @notice Anyone pays transaction gas; the external subscription pays VRF fees, never bidder escrow.
    function startDailyDraw() external nonReentrant returns (uint256 drawId) {
        require(!closed, AuctionClosed());
        require(pendingDrawId == 0, DrawPending());
        require(block.timestamp >= nextDrawAt, TooEarly());
        BidBook.Bid memory winner = _bids.top();
        uint256 inventorySize = _inventory.eligibleCount;
        uint256 boxInventorySize = _boxes.eligibleCount;
        nextDrawAt = block.timestamp + DRAW_INTERVAL;
        // Queue promotion is O(1). The current draw uses the old prefix lengths below.
        _inventory.eligibleCount = _inventory.assets.length;
        _boxes.eligibleCount = _boxes.assets.length;
        if (inventorySize == 0 || winner.amount == 0) {
            emit EmptyDaySkipped(nextDrawAt);
            return 0;
        }
        winner = _bids.remove(winner.bidder);
        totalBidEscrow -= winner.amount;
        pendingPayments = winner.amount;
        drawId = ++drawCount;
        pendingDrawId = drawId;
        Draw storage draw = _draws[drawId];
        draw.winner = winner.bidder;
        draw.price = winner.amount;
        draw.requestedAt = block.timestamp;
        draw.inventorySize = inventorySize;
        draw.boxInventorySize = boxInventorySize;
        draw.status = DrawStatus.Requested;
        uint256 requestId = coordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: 2,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: nativePayment})
                )
            })
        );
        draw.requestId = requestId;
        emit DrawStarted(drawId, winner.bidder, winner.amount, requestId, inventorySize, boxInventorySize);
    }

    /// @dev No transfers or loops in the callback. Ignore stale/duplicate callbacks.
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 drawId = pendingDrawId;
        if (drawId == 0) return;
        Draw storage draw = _draws[drawId];
        if (draw.status != DrawStatus.Requested || draw.requestId != requestId || randomWords.length != 2) {
            return;
        }
        draw.randomWord = randomWords[0];
        draw.bonusWord = randomWords[1];
        draw.status = DrawStatus.Ready;
        emit RandomnessReceived(drawId, requestId);
    }

    function finalizeDraw() external nonReentrant {
        uint256 drawId = pendingDrawId;
        require(drawId != 0, NoPendingDraw());
        Draw storage draw = _draws[drawId];
        require(draw.status == DrawStatus.Ready, RandomnessNotReady());
        uint256 index = draw.randomWord % draw.inventorySize;
        Asset memory prize = _inventory.assets[index];
        _removeInventory(_inventory, prize.collection, prize.tokenId);
        tokenStatus[prize.collection][prize.tokenId] = TokenStatus.Assigned;
        draw.collection = prize.collection;
        draw.tokenId = prize.tokenId;
        if (draw.boxInventorySize != 0 && draw.bonusWord % 2 == 0) {
            // The low bit is the coin flip; the remaining bits select a box from the frozen stock.
            uint256 boxIndex = (draw.bonusWord >> 1) % draw.boxInventorySize;
            uint256 boxId = _boxes.assets[boxIndex].tokenId;
            _removeInventory(_boxes, address(impBoxCollection), boxId);
            tokenStatus[address(impBoxCollection)][boxId] = TokenStatus.Assigned;
            draw.boxTokenId = boxId;
            draw.bonusAwarded = true;
            emit BonusAwarded(drawId, draw.winner, boxId);
        }
        draw.status = DrawStatus.Finalized;
        pendingDrawId = 0;
        pendingPayments = 0;
        proceeds += draw.price;
        emit DrawFinalized(drawId, draw.winner, prize.collection, prize.tokenId, draw.price);
    }

    function claimNFT(uint256 drawId, address recipient) external nonReentrant {
        _checkRecipient(recipient);
        Draw storage draw = _draws[drawId];
        require(msg.sender == draw.winner, NotWinner());
        require(draw.status == DrawStatus.Finalized, RandomnessNotReady());
        require(!draw.claimed, AlreadyClaimed());
        draw.claimed = true;
        tokenStatus[draw.collection][draw.tokenId] = TokenStatus.Claimed;
        emit NFTClaimed(drawId, recipient, draw.collection, draw.tokenId);
        IERC721(draw.collection).safeTransferFrom(address(this), recipient, draw.tokenId);
    }

    /// @notice Claim independently, so a failed bonus transfer never blocks the main prize.
    function claimBonus(uint256 drawId, address recipient) external nonReentrant {
        _checkRecipient(recipient);
        Draw storage draw = _draws[drawId];
        require(msg.sender == draw.winner, NotWinner());
        require(draw.status == DrawStatus.Finalized, RandomnessNotReady());
        require(draw.bonusAwarded, NoBonus());
        require(!draw.bonusClaimed, AlreadyClaimed());
        draw.bonusClaimed = true;
        tokenStatus[address(impBoxCollection)][draw.boxTokenId] = TokenStatus.Claimed;
        emit BonusClaimed(drawId, recipient, draw.boxTokenId);
        impBoxCollection.safeTransferFrom(address(this), recipient, draw.boxTokenId);
    }

    function withdrawProceeds(address payable recipient, uint256 amount) external nonReentrant onlyOwner {
        _checkRecipient(recipient);
        require(amount != 0, ZeroAmount());
        require(amount <= proceeds, InsufficientProceeds());
        proceeds -= amount;
        emit ProceedsWithdrawn(recipient, amount);
        _sendETH(recipient, amount);
    }

    /// @notice Terminal escape if no caller/subscription/oracle advances the auction for seven days.
    /// @dev Never restarts/rerolls; a result already received must be finalized. Bids themselves never expire.
    function shutdownStalledAuction() external nonReentrant {
        require(!closed, AuctionClosed());
        uint256 drawId = pendingDrawId;
        if (drawId == 0) {
            require(block.timestamp >= nextDrawAt + STALL_TIMEOUT, CannotShutdown());
        } else {
            Draw storage draw = _draws[drawId];
            require(
                draw.status == DrawStatus.Requested && block.timestamp >= draw.requestedAt + STALL_TIMEOUT,
                CannotShutdown()
            );
            draw.status = DrawStatus.Aborted;
            refunds[draw.winner] += draw.price;
            totalRefunds += draw.price;
            pendingPayments = 0;
            pendingDrawId = 0;
        }
        closed = true;
        emit Shutdown(drawId);
    }

    function withdrawRefund(address payable recipient) external nonReentrant {
        _checkRecipient(recipient);
        uint256 amount = refunds[msg.sender];
        require(amount != 0, ZeroAmount());
        refunds[msg.sender] = 0;
        totalRefunds -= amount;
        emit RefundWithdrawn(msg.sender, recipient, amount);
        _sendETH(recipient, amount);
    }

    /// @notice Only terminal closure permits recovery; assigned NFTs remain reserved for winners.
    function recoverUnsoldNFT(address collection, uint256 tokenId, address recipient)
        external
        nonReentrant
        onlyOwner
    {
        _checkRecipient(recipient);
        require(closed, NotClosed());
        require(tokenStatus[collection][tokenId] == TokenStatus.Available, InvalidToken(collection, tokenId));
        _removeInventory(_pool(collection), collection, tokenId);
        tokenStatus[collection][tokenId] = TokenStatus.Claimed;
        emit UnsoldNFTRecovered(collection, tokenId, recipient);
        IERC721(collection).safeTransferFrom(address(this), recipient, tokenId);
    }

    function highestBid() external view returns (address bidder, uint256 amount) {
        BidBook.Bid memory highest = _bids.top();
        return (highest.bidder, highest.amount);
    }

    function bidOf(address bidder) external view returns (uint256) {
        return _bids.amountOf(bidder);
    }

    function availableTokenCount() external view returns (uint256) {
        return _inventory.assets.length;
    }

    function availableTokenAt(uint256 index) external view returns (Asset memory) {
        return _inventory.assets[index];
    }

    function availableBoxCount() external view returns (uint256) {
        return _boxes.assets.length;
    }

    function availableBoxAt(uint256 index) external view returns (uint256) {
        return _boxes.assets[index].tokenId;
    }

    /// @notice Prefix eligible for the next start; a pending draw has its own immutable snapshot sizes.
    function eligibleInventoryCounts() external view returns (uint256 prizes, uint256 boxes) {
        return (_inventory.eligibleCount, _boxes.eligibleCount);
    }

    function getDraw(uint256 drawId) external view returns (Draw memory) {
        return _draws[drawId];
    }

    function onERC721Received(address, address, uint256 tokenId, bytes calldata)
        external
        nonReentrant
        returns (bytes4)
    {
        require(!closed, AuctionClosed());
        _registerReceived(msg.sender, tokenId);
        return IERC721Receiver.onERC721Received.selector;
    }

    function _checkRecipient(address recipient) private view {
        require(recipient != address(0) && recipient != address(this), InvalidRecipient());
    }

    function _registerReceived(address collection, uint256 tokenId) private {
        require(
            collection == address(warriorCollection) || collection == address(wizardCollection)
                || collection == address(impBoxCollection),
            InvalidConfiguration()
        );
        TokenStatus status = tokenStatus[collection][tokenId];
        require(
            status == TokenStatus.None || status == TokenStatus.Claimed, InvalidToken(collection, tokenId)
        );
        require(IERC721(collection).ownerOf(tokenId) == address(this), InvalidToken(collection, tokenId));
        Inventory storage pool = _pool(collection);
        pool.assets.push(Asset(collection, tokenId));
        pool.position[collection][tokenId] = pool.assets.length;
        bool eligible = !closed && block.timestamp < nextDrawAt;
        if (eligible) pool.eligibleCount++;
        tokenStatus[collection][tokenId] = TokenStatus.Available;
        emit InventoryDeposited(collection, tokenId, eligible);
    }

    function _pool(address collection) private view returns (Inventory storage) {
        return collection == address(impBoxCollection) ? _boxes : _inventory;
    }

    /// @dev Preserve the eligible prefix when late arrivals exist. At most two moves, no inventory loops.
    function _removeInventory(Inventory storage pool, address collection, uint256 tokenId) private {
        uint256 index = pool.position[collection][tokenId] - 1;
        if (index < pool.eligibleCount) {
            uint256 lastEligible = --pool.eligibleCount;
            _moveAsset(pool, lastEligible, index);
            index = lastEligible;
        }
        _moveAsset(pool, pool.assets.length - 1, index);
        pool.assets.pop();
        delete pool.position[collection][tokenId];
    }

    function _moveAsset(Inventory storage pool, uint256 from, uint256 to) private {
        if (from == to) return;
        Asset memory asset = pool.assets[from];
        pool.assets[to] = asset;
        pool.position[asset.collection][asset.tokenId] = to + 1;
    }

    function _sendETH(address payable recipient, uint256 amount) private {
        (bool success,) = recipient.call{value: amount}("");
        require(success, TransferFailed());
    }
}
