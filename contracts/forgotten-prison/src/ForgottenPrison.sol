/**
 * SPDX-License-Identifier: MIT
 */
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

/**
 * @title Forgotten Prison
 * @notice Daily auctions award a donated warrior or wizard to the highest funded ETH bidder, with a 50%
 *   chance of an additional Imp Box while eligible stock remains.
 * @dev Losing bids roll over without expiry. Anyone can supply supported NFTs and advance draws; VRF selects
 *   the prizes, winners claim them, and the owner collects completed-sale proceeds.
 */
contract ForgottenPrison is Ownable2Step, ReentrancyGuard, IERC721Receiver, VRFConsumerBaseV2 {
    using BidBook for BidBook.Book;
    /**
     * @notice Minimum time in seconds between successful daily starts, including skipped days.
     */
    uint256 public constant DRAW_INTERVAL = 1 days;
    /**
     * @notice Delay in seconds after which a stalled auction may be permanently closed.
     */
    uint256 public constant STALL_TIMEOUT = 7 days;

    /**
     * @notice Lifecycle of a draw, from an unset record through fulfillment, settlement, or terminal
     *   shutdown.
     */
    enum DrawStatus {
        None,
        Requested,
        Ready,
        Finalized,
        Aborted
    }
    /**
     * @notice Custody lifecycle for each collection/token pair. Claimed assets can reenter inventory after
     *   being returned.
     */
    enum TokenStatus {
        None,
        Available,
        Assigned,
        Claimed
    }

    /**
     * @notice Immutable Chainlink V2.5 subscription configuration supplied at deployment.
     * @dev callbackGasLimit is gas, requestConfirmations is blocks, and nativePayment selects ETH instead of
     *   LINK billing.
     */
    struct VRFConfig {
        address coordinator;
        uint256 subscriptionId;
        bytes32 keyHash;
        uint32 callbackGasLimit;
        uint16 requestConfirmations;
        bool nativePayment;
    }

    /**
     * @notice Winner, locked payment, frozen inventory sizes, randomness, and independent prize claims for
     *   one round.
     * @dev Price is wei and requestedAt is a Unix timestamp. Zero is valid randomness and a valid token ID;
     *   status and bonusAwarded indicate readiness and whether a box exists. Historical claimed flags stay
     *   consumed when an asset returns.
     */
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

    /**
     * @notice An ERC721 identity composed of its collection address and token ID.
     */
    struct Asset {
        address collection;
        uint256 tokenId;
    }

    /**
     * @dev Available assets occupy an array whose eligible prefix is frozen at cutoff. position stores index
     *   plus one, with zero meaning absent; eligibleCount excludes queued arrivals. Assigned prizes are
     *   removed from this inventory.
     */
    struct Inventory {
        Asset[] assets;
        mapping(address => mapping(uint256 => uint256)) position;
        uint256 eligibleCount;
    }

    /**
     * @notice A collection, coordinator, or VRF setting is unsupported or invalid.
     */
    error InvalidConfiguration();
    /**
     * @notice The recipient is the zero address or this auction.
     */
    error InvalidRecipient();
    /**
     * @notice The auction has been permanently shut down.
     */
    error AuctionClosed();
    /**
     * @notice The current bidding cutoff has frozen this operation.
     */
    error CutoffReached();
    /**
     * @notice The next draw deadline has not yet arrived.
     */
    error TooEarly();
    /**
     * @notice An earlier draw still awaits fulfillment or finalization.
     */
    error DrawPending();
    /**
     * @notice No draw is waiting to be finalized.
     */
    error NoPendingDraw();
    /**
     * @notice No registered main prizes remain available for bidding.
     */
    error NoInventory();
    /**
     * @notice The operation requires a positive ETH amount or refundable balance.
     */
    error ZeroAmount();
    /**
     * @notice The caller has no active standing bid to cancel.
     */
    error NoBid();
    /**
     * @notice The NFT is already registered or reserved, is not in custody, or is not available for
     *   recovery.
     * @param collection Collection whose token failed validation.
     * @param tokenId Token ID that failed validation.
     */
    error InvalidToken(address collection, uint256 tokenId);
    /**
     * @notice The draw has not reached the state required for finalization or claiming.
     */
    error RandomnessNotReady();
    /**
     * @notice The caller is not the winner recorded for this draw.
     */
    error NotWinner();
    /**
     * @notice This particular prize claim has already been consumed.
     */
    error AlreadyClaimed();
    /**
     * @notice This draw did not award an Imp Box.
     */
    error NoBonus();
    /**
     * @notice The requested withdrawal exceeds completed-sale proceeds.
     */
    error InsufficientProceeds();
    /**
     * @notice The recipient rejected an ETH transfer.
     */
    error TransferFailed();
    /**
     * @notice The terminal timeout has not elapsed, or the pending draw already has randomness.
     */
    error CannotShutdown();
    /**
     * @notice Unsold inventory cannot be recovered before terminal shutdown.
     */
    error NotClosed();

    /**
     * @notice A standing bid was created or increased.
     * @param bidder Account funding the standing bid.
     * @param amount Total standing bid after this payment, in wei.
     * @param sequence New tie priority assigned to this bid amount.
     */
    event BidPlaced(address indexed bidder, uint256 amount, uint256 sequence);
    /**
     * @notice A standing bid was removed and refunded.
     * @param bidder Account whose bid was cancelled.
     * @param recipient Address receiving the refund.
     * @param amount Refunded bid amount in wei.
     */
    event BidCancelled(address indexed bidder, address indexed recipient, uint256 amount);
    /**
     * @notice An NFT in custody was registered as available inventory.
     * @param collection Supported NFT collection.
     * @param tokenId Registered NFT ID.
     * @param eligible Whether it qualifies for the upcoming cutoff; it never joins an already pending draw.
     */
    event InventoryDeposited(address indexed collection, uint256 indexed tokenId, bool eligible);
    /**
     * @notice The top bid and eligible inventories were locked and randomness was requested.
     * @param drawId New nonzero round identifier.
     * @param winner Locked highest bidder.
     * @param price Locked payment in wei.
     * @param requestId Coordinator request identifier.
     * @param inventorySize Frozen main-prize prefix length.
     * @param boxInventorySize Frozen bonus-prize prefix length.
     */
    event DrawStarted(
        uint256 indexed drawId,
        address indexed winner,
        uint256 price,
        uint256 requestId,
        uint256 inventorySize,
        uint256 boxInventorySize
    );
    /**
     * @notice The first valid two-word response was stored for a draw.
     * @param drawId Round now ready to finalize.
     * @param requestId Matching coordinator request identifier.
     */
    event RandomnessReceived(uint256 indexed drawId, uint256 indexed requestId);
    /**
     * @notice The main prize was reserved and the price became owner proceeds.
     * @param drawId Finalized round identifier.
     * @param winner Account entitled to claim its prizes.
     * @param collection Selected warrior or wizard collection.
     * @param tokenId Selected main-prize ID.
     * @param price Recognized proceeds in wei.
     */
    event DrawFinalized(
        uint256 indexed drawId,
        address indexed winner,
        address indexed collection,
        uint256 tokenId,
        uint256 price
    );
    /**
     * @notice A winner claimed the main prize.
     * @param drawId Round whose main claim was consumed.
     * @param recipient Address receiving the NFT.
     * @param collection Awarded collection.
     * @param tokenId Awarded NFT ID.
     */
    event NFTClaimed(
        uint256 indexed drawId, address indexed recipient, address indexed collection, uint256 tokenId
    );
    /**
     * @notice An Imp Box was removed from stock and reserved for a winner.
     * @param drawId Round receiving the bonus.
     * @param winner Account entitled to claim the box.
     * @param tokenId Reserved Imp Box ID.
     */
    event BonusAwarded(uint256 indexed drawId, address indexed winner, uint256 indexed tokenId);
    /**
     * @notice A winner claimed the Imp Box bonus.
     * @param drawId Round whose bonus claim was consumed.
     * @param recipient Address receiving the box.
     * @param tokenId Awarded Imp Box ID.
     */
    event BonusClaimed(uint256 indexed drawId, address indexed recipient, uint256 indexed tokenId);
    /**
     * @notice The owner withdrew completed-sale proceeds.
     * @param recipient Address receiving the ETH.
     * @param amount Withdrawn proceeds in wei.
     */
    event ProceedsWithdrawn(address indexed recipient, uint256 amount);
    /**
     * @notice The auction permanently closed.
     * @param abortedDrawId Aborted pending round, or zero when no draw was pending.
     */
    event Shutdown(uint256 indexed abortedDrawId);
    /**
     * @notice An aborted draw winner withdrew their refund.
     * @param bidder Account entitled to the refund.
     * @param recipient Address receiving the ETH.
     * @param amount Refund amount in wei.
     */
    event RefundWithdrawn(address indexed bidder, address indexed recipient, uint256 amount);
    /**
     * @notice The owner recovered unassigned inventory after closure.
     * @param collection Recovered asset collection.
     * @param tokenId Recovered NFT ID.
     * @param recipient Address receiving the NFT.
     */
    event UnsoldNFTRecovered(address indexed collection, uint256 indexed tokenId, address indexed recipient);
    /**
     * @notice A day without an eligible main prize or funded bid advanced without a VRF request.
     * @param nextDrawAt New Unix timestamp for the next cutoff.
     */
    event EmptyDaySkipped(uint256 nextDrawAt);

    /**
     * @notice Immutable ERC721 warrior collection accepted into the main prize pool.
     */
    IERC721 public immutable warriorCollection;
    /**
     * @notice Immutable ERC721 wizard collection accepted into the main prize pool.
     */
    IERC721 public immutable wizardCollection;
    /**
     * @notice Immutable ERC721 collection accepted as optional bonus prizes.
     */
    IERC721 public immutable impBoxCollection;
    /**
     * @notice Immutable Chainlink V2.5 coordinator that accepts requests and authenticates callbacks.
     */
    IVRFCoordinatorV2Plus public immutable coordinator;
    /**
     * @notice External VRF subscription charged for randomness; bidder escrow never funds it.
     */
    uint256 public immutable subscriptionId;
    /**
     * @notice Immutable VRF gas-lane key used for every request.
     */
    bytes32 public immutable keyHash;
    /**
     * @notice Gas limit requested for the randomness callback.
     */
    uint32 public immutable callbackGasLimit;
    /**
     * @notice Minimum block confirmations requested before VRF fulfillment.
     */
    uint16 public immutable requestConfirmations;
    /**
     * @notice Whether the VRF subscription pays in native ETH rather than LINK.
     */
    bool public immutable nativePayment;
    /**
     * @notice Unix timestamp freezing current bids and inventory eligibility; starts reset it to call time
     *   plus one day.
     */
    uint256 public nextDrawAt;
    /**
     * @notice Number of nonempty draws requested, including any subsequently aborted draw.
     */
    uint256 public drawCount;
    /**
     * @notice Round awaiting fulfillment or finalization, or zero when none is pending.
     */
    uint256 public pendingDrawId;
    /**
     * @notice Total wei owed to active standing bids; excludes the locked winning payment.
     */
    uint256 public totalBidEscrow;
    /**
     * @notice Wei locked for the single pending draw, not yet owner proceeds.
     */
    uint256 public pendingPayments;
    /**
     * @notice Unwithdrawn wei earned from finalized sales, independent of NFT claims.
     */
    uint256 public proceeds;
    /**
     * @notice Total wei owed to aborted-draw winners and awaiting withdrawal.
     */
    uint256 public totalRefunds;
    /**
     * @notice Whether terminal shutdown has permanently disabled bidding and new draws.
     */
    bool public closed;
    mapping(uint256 => Draw) private _draws;
    /**
     * @notice Current inventory or custody status indexed by collection and token ID; historical claims live
     *   in each draw.
     */
    mapping(address => mapping(uint256 => TokenStatus)) public tokenStatus;
    /**
     * @notice Withdrawable aborted-draw refunds in wei, indexed by bidder.
     */
    mapping(address => uint256) public refunds;
    Inventory private _inventory;
    Inventory private _boxes;
    BidBook.Book private _bids;
    uint256 private _sequence;

    /**
     * @notice Configure the accepted collections and VRF subscription, and open the first day of bidding.
     * @dev Collection and VRF settings are immutable. Collections must be distinct contracts; the coordinator must have
     *   code. Subscription ID and key hash must be nonzero, callback gas must be 100,000-2,500,000, and
     *   confirmations must be 3-200. These checks do not validate subscription funding or consumer
     *   registration. The first cutoff is deployment time plus one day. V2.5 requests deliberately use
     *   VRFConsumerBaseV2 only for its identical callback ABI and immutable coordinator authentication,
     *   avoiding owner-controlled coordinator migration.
     * @param initialOwner Nonzero owner entitled to finalized proceeds and unsold recovery after closure.
     * @param warriors ERC721 collection for warrior prizes.
     * @param wizards ERC721 collection for wizard prizes.
     * @param impBoxes ERC721 collection for optional Imp Box prizes.
     * @param config Immutable V2.5 subscription and request settings.
     */
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

    /**
     * @notice Add msg.value to your standing ETH bid before the next cutoff.
     * @dev Requires an open auction, registered main inventory, and a positive payment. A top-up receives a
     *   new sequence, so equal bids favor the account that reached that amount earlier. Losing bids retain
     *   their full balances indefinitely without daily charges; the winner's whole bid is consumed when a
     *   draw starts. A locked winner may place a fresh bid for a later day.
     */
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

    /**
     * @notice Cancel your entire active bid and withdraw its ETH to a chosen recipient.
     * @dev Available before the next cutoff, or at any time after closure or exhaustion of registered main
     *   inventory. A winning payment already locked in a draw is no longer an active bid and cannot be
     *   cancelled. The refund uses checks-effects-interactions; a failed transfer restores the bid and
     *   escrow.
     * @param recipient Nonzero ETH recipient other than this auction.
     */
    function cancelBid(address payable recipient) external nonReentrant {
        _checkRecipient(recipient);
        require(closed || _inventory.assets.length == 0 || block.timestamp < nextDrawAt, CutoffReached());
        BidBook.Bid memory removed = _bids.remove(msg.sender);
        require(removed.amount != 0, NoBid());
        totalBidEscrow -= removed.amount;
        emit BidCancelled(msg.sender, recipient, removed.amount);
        _sendETH(recipient, removed.amount);
    }

    /**
     * @notice Register a supported NFT already sent to this contract using plain transferFrom.
     * @dev Anyone may sync regardless of the donor. Verifies actual custody and rejects available or
     *   assigned duplicates; claimed NFTs may be registered again after being returned. Registration before
     *   the next cutoff qualifies for that round; registration at or after it queues the asset for a later
     *   round. No registration changes a pending draw. Registration time, not the original transfer time,
     *   controls eligibility. Donations have no donor withdrawal right. After closure, sync only makes an
     *   asset recoverable by the owner as unsold stock; it never reopens bidding.
     * @param collection One of the three immutable supported collections.
     * @param tokenId NFT ID held by this auction; zero is valid.
     */
    function syncReceivedNFT(address collection, uint256 tokenId) external nonReentrant {
        _registerReceived(collection, tokenId);
    }

    /**
     * @notice Start the next daily draw after its cutoff, locking the highest bid and requesting randomness.
     * @dev Anyone may call while open and with no pending draw. Equal bids use FIFO priority. Captures both
     *   eligible prefix lengths before promoting queued inventory in O(1) for the following round. Each
     *   successful call sets the next cutoff to call time plus one day; there are no catch-up rounds. If no
     *   bid or eligible main prize exists, only the cutoff and queue promotion change. Otherwise the entire
     *   winning bid moves from escrow into a pending payment and two VRF words are requested. The caller
     *   pays transaction gas; the external subscription pays VRF fees. A failed request reverts the entire
     *   start.
     * @return drawId New nonzero draw ID, or zero for an empty day skipped without charging a bidder.
     */
    function startDailyDraw() external nonReentrant returns (uint256 drawId) {
        require(!closed, AuctionClosed());
        require(pendingDrawId == 0, DrawPending());
        require(block.timestamp >= nextDrawAt, TooEarly());
        BidBook.Bid memory winner = _bids.top();
        uint256 inventorySize = _inventory.eligibleCount;
        uint256 boxInventorySize = _boxes.eligibleCount;
        nextDrawAt = block.timestamp + DRAW_INTERVAL;

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

    /**
     * @dev Store the first valid two-word response for the pending request and mark it ready. The inherited
     *   external callback authenticates the immutable coordinator. Ignore wrong request IDs, stale,
     *   duplicate, and malformed responses; do not transfer assets or loop here.
     * @param requestId Coordinator request identifier being fulfilled.
     * @param randomWords Two VRF words: the main-prize selection and the independent bonus selection.
     */
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

    /**
     * @notice Reserve the pending draw's prizes and credit its winning payment to owner proceeds.
     * @dev Anyone may finalize after valid randomness arrives. The first word selects a main NFT modulo the
     *   frozen main inventory size. An even second word awards an Imp Box only when frozen bonus stock
     *   exists; its low bit is the 50% coin flip and its remaining bits select the box modulo the frozen box
     *   inventory size. Modulo selection has negligible finite-word bias for non-power-of-two pool sizes.
     *   Remove awarded assets immediately, preserving the next round's eligible prefixes, and release the
     *   pending-draw slot. No NFT transfers occur here, and subsequent deposits cannot change this draw's
     *   result.
     */
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

    /**
     * @notice Claim your finalized draw's warrior or wizard to a chosen recipient.
     * @dev Only the recorded winner can consume this main-prize claim, once. Uses safeTransferFrom and
     *   remains available after shutdown, independently of the bonus and future draws. A rejected transfer
     *   reverts the claim so the winner can retry. Returning the claimed NFT later may make it eligible
     *   again, but never reopens this historical claim.
     * @param drawId Finalized round whose main prize is being claimed.
     * @param recipient Nonzero NFT recipient other than this auction; contracts must accept safe ERC721
     *   transfers.
     */
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

    /**
     * @notice Claim the Imp Box awarded to your finalized draw.
     * @dev Only the recorded winner can consume an awarded bonus claim, once. Independent of the main-prize
     *   claim and available after shutdown. The box was already reserved at finalization; unclaimed boxes
     *   cannot be awarded again. A rejected transfer restores the claim. Returning a claimed box may make it
     *   eligible again without reopening this historical claim.
     * @param drawId Finalized round with an awarded bonus.
     * @param recipient Nonzero NFT recipient other than this auction; contracts must accept safe ERC721
     *   transfers.
     */
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

    /**
     * @notice Withdraw completed-sale ETH to a chosen recipient as the contract owner.
     * @dev Amount must be positive and no greater than proceeds. Active bids, pending payments, refunds, and
     *   forced ETH surplus are excluded. Does not wait for winners to claim their NFTs and remains available
     *   after closure. A failed transfer restores the proceeds balance.
     * @param recipient Nonzero ETH recipient other than this auction.
     * @param amount Proceeds to withdraw, in wei.
     */
    function withdrawProceeds(address payable recipient, uint256 amount) external nonReentrant onlyOwner {
        _checkRecipient(recipient);
        require(amount != 0, ZeroAmount());
        require(amount <= proceeds, InsufficientProceeds());
        proceeds -= amount;
        emit ProceedsWithdrawn(recipient, amount);
        _sendETH(recipient, amount);
    }

    /**
     * @notice Permanently close an auction that has stalled for at least seven days.
     * @dev Anyone may close seven days after an unstarted cutoff, or seven days after the pending request
     *   was made if randomness has not arrived. A ready draw must be finalized instead. An aborted winning
     *   payment becomes a refund, and standing bids become cancellable. Existing finalized proceeds and
     *   main/bonus claims remain valid. Closure enables owner recovery of unsold stock and rejects new
     *   safe-transfer donations; it never restarts or rerolls a draw. Bids themselves have no expiry.
     */
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

    /**
     * @notice Withdraw all ETH credited to you by an aborted draw.
     * @dev Only the caller's refund is debited, before transferring. Requires a positive balance; a rejected
     *   transfer restores the credit. Standing bids are withdrawn separately with cancelBid.
     * @param recipient Nonzero ETH recipient other than this auction.
     */
    function withdrawRefund(address payable recipient) external nonReentrant {
        _checkRecipient(recipient);
        uint256 amount = refunds[msg.sender];
        require(amount != 0, ZeroAmount());
        refunds[msg.sender] = 0;
        totalRefunds -= amount;
        emit RefundWithdrawn(msg.sender, recipient, amount);
        _sendETH(recipient, amount);
    }

    /**
     * @notice Recover an unassigned NFT as the owner after permanent shutdown.
     * @dev Available and queued main or bonus assets may be recovered, including third-party donations.
     *   Assigned winner prizes remain reserved. The asset must first be registered; plain transfers can
     *   still be synced after closure. Removes the entry and updates its status before safe transfer;
     *   rejection reverts the recovery.
     * @param collection Supported collection of the unsold asset.
     * @param tokenId Available NFT ID to recover.
     * @param recipient Nonzero NFT recipient other than this auction; contracts must accept safe ERC721
     *   transfers.
     */
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

    /**
     * @notice Return the current leading standing bid, excluding a winner already locked into a draw.
     * @dev The earliest bid at the highest amount wins ties. Readable after cutoff; the leader does not
     *   become the locked winner until startDailyDraw succeeds.
     * @return bidder Leading bidder, or the zero address when no standing bids exist.
     * @return amount Leading bid in wei, or zero when no standing bids exist.
     */
    function highestBid() external view returns (address bidder, uint256 amount) {
        BidBook.Bid memory highest = _bids.top();
        return (highest.bidder, highest.amount);
    }

    /**
     * @notice Return an account's active standing bid.
     * @param bidder Account whose funded bid is queried.
     * @return Active bid amount in wei, or zero if absent; excludes locked payments and refund credits.
     */
    function bidOf(address bidder) external view returns (uint256) {
        return _bids.amountOf(bidder);
    }

    /**
     * @notice Count registered, unassigned main prizes across the warrior and wizard collections.
     * @dev Includes queued arrivals ineligible for the next cutoff. Excludes assigned but unclaimed prizes
     *   and plain transfers not yet synced.
     * @return Total number of main prizes currently in the inventory array.
     */
    function availableTokenCount() external view returns (uint256) {
        return _inventory.assets.length;
    }

    /**
     * @notice Return a registered main prize by its current inventory index.
     * @dev Indices are unstable across settlement or recovery. Entries before the eligible prefix count
     *   qualify for the next start; later entries are queued. A pending draw uses its own frozen prefix
     *   length. Out-of-range indices revert.
     * @param index Zero-based main-inventory index.
     * @return Asset identifying the collection and token ID at that index.
     */
    function availableTokenAt(uint256 index) external view returns (Asset memory) {
        return _inventory.assets[index];
    }

    /**
     * @notice Count registered, unassigned Imp Boxes, including queued arrivals.
     * @dev Excludes awarded but unclaimed boxes and plain transfers not yet synced.
     * @return Total number of boxes currently in the bonus inventory array.
     */
    function availableBoxCount() external view returns (uint256) {
        return _boxes.assets.length;
    }

    /**
     * @notice Return an unassigned Imp Box ID by its current inventory index.
     * @dev Indices can change on settlement or recovery; the eligible prefix count distinguishes upcoming
     *   stock from queued arrivals. Out-of-range indices revert.
     * @param index Zero-based bonus-inventory index.
     * @return Imp Box token ID at that index; zero is a valid ID.
     */
    function availableBoxAt(uint256 index) external view returns (uint256) {
        return _boxes.assets[index].tokenId;
    }

    /**
     * @notice Return the main and bonus prefix lengths eligible for the next start.
     * @dev Excludes registrations after that round's cutoff. A successful start promotes queued arrivals for
     *   the following round, so these counts may differ from a pending draw's immutable snapshot sizes.
     *   Assets reserved by finalization are removed from the counts.
     * @return prizes Eligible main-prize prefix length.
     * @return boxes Eligible bonus-prize prefix length.
     */
    function eligibleInventoryCounts() external view returns (uint256 prizes, uint256 boxes) {
        return (_inventory.eligibleCount, _boxes.eligibleCount);
    }

    /**
     * @notice Return a round's winner, payment, frozen inventories, randomness, result, and claim flags.
     * @dev Unset IDs return a zero-initialized record with status None. Check status before interpreting
     *   randomness or the main prize, and bonusAwarded before interpreting boxTokenId; zero is valid for
     *   each random word and token ID. Returning assets never resets this record's consumed claims.
     * @param drawId Round identifier to query.
     * @return Full current draw record.
     */
    function getDraw(uint256 drawId) external view returns (Draw memory) {
        return _draws[drawId];
    }

    /**
     * @notice Automatically register a safe-transfer donation from any holder of a supported collection.
     * @dev Called by the NFT collection after custody transfers. Validates the caller against the three
     *   immutable collections and verifies ownerOf; available or assigned duplicates are rejected. Claimed
     *   assets may return. Operator, previous holder, and transfer data are intentionally unused. Applies
     *   registration-time cutoff rules without changing pending snapshots. Donations are gifts with no donor
     *   withdrawal right. Closed auctions reject safe transfers; returning the magic selector completes
     *   acceptance.
     * @param tokenId Received NFT ID; zero is valid.
     * @return IERC721Receiver.onERC721Received.selector on successful registration.
     */
    function onERC721Received(address, address, uint256 tokenId, bytes calldata)
        external
        nonReentrant
        returns (bytes4)
    {
        require(!closed, AuctionClosed());
        _registerReceived(msg.sender, tokenId);
        return IERC721Receiver.onERC721Received.selector;
    }

    /**
     * @dev Reject the zero address and this auction as outbound transfer destinations.
     * @param recipient Proposed recipient of ETH or an NFT.
     */
    function _checkRecipient(address recipient) private view {
        require(recipient != address(0) && recipient != address(this), InvalidRecipient());
    }

    /**
     * @dev Verify supported custody and append a new or returned asset to the appropriate inventory. None
     *   and Claimed are the only admissible prior statuses. Eligibility depends on registration time and
     *   closure; append-only changes preserve pending snapshots. Historical draw records are not modified.
     *   Called only through guarded receiver or sync entry points.
     * @param collection Supported collection in custody.
     * @param tokenId NFT ID to register.
     */
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

    /**
     * @dev Route Imp Boxes to the bonus pool and supported warrior/wizard assets to the main pool. Callers
     *   validate collection support or registered status first.
     * @param collection Collection used to select the inventory.
     * @return Storage reference to the selected inventory.
     */
    function _pool(address collection) private view returns (Inventory storage) {
        return collection == address(impBoxCollection) ? _boxes : _inventory;
    }

    /**
     * @dev Remove one registered asset in O(1), preserving the eligible prefix. Move the last eligible asset
     *   into a removed eligible slot, then fill the vacated boundary with the array tail. At most two moves
     *   occur; no inventory loops. Callers ensure the asset exists and removal cannot invalidate an
     *   unfinished draw.
     * @param pool Inventory containing the asset.
     * @param collection Collection key in the position mapping.
     * @param tokenId NFT ID whose position and array entry are removed.
     */
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

    /**
     * @dev Copy one array entry and repair its one-based position. A same-index move is a no-op so it cannot
     *   overwrite a position already repaired by an earlier move.
     * @param pool Inventory being compacted.
     * @param from Existing source index.
     * @param to Existing destination index.
     */
    function _moveAsset(Inventory storage pool, uint256 from, uint256 to) private {
        if (from == to) return;
        Asset memory asset = pool.assets[from];
        pool.assets[to] = asset;
        pool.position[asset.collection][asset.tokenId] = to + 1;
    }

    /**
     * @dev Send ETH and revert on failure. Guarded callers must validate the recipient and debit the
     *   appropriate liability or proceeds before calling.
     * @param recipient Destination of the ETH transfer.
     * @param amount Amount to transfer, in wei.
     */
    function _sendETH(address payable recipient, uint256 amount) private {
        (bool success,) = recipient.call{value: amount}("");
        require(success, TransferFailed());
    }
}
