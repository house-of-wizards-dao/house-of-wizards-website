// Generated from ForgottenPrison.sol by scripts/generate-prison-abi.mjs.
export const prisonAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "initialOwner",
        type: "address",
        internalType: "address",
      },
      {
        name: "warriors",
        type: "address",
        internalType: "address",
      },
      {
        name: "wizards",
        type: "address",
        internalType: "address",
      },
      {
        name: "impBoxes",
        type: "address",
        internalType: "address",
      },
      {
        name: "config",
        type: "tuple",
        internalType: "struct ForgottenPrison.VRFConfig",
        components: [
          {
            name: "coordinator",
            type: "address",
            internalType: "address",
          },
          {
            name: "subscriptionId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "keyHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "callbackGasLimit",
            type: "uint32",
            internalType: "uint32",
          },
          {
            name: "requestConfirmations",
            type: "uint16",
            internalType: "uint16",
          },
          {
            name: "nativePayment",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "DRAW_INTERVAL",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "STALL_TIMEOUT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "acceptOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "availableBoxAt",
    inputs: [
      {
        name: "index",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "availableBoxCount",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "availableTokenAt",
    inputs: [
      {
        name: "index",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ForgottenPrison.Asset",
        components: [
          {
            name: "collection",
            type: "address",
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "availableTokenCount",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "bid",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "bidOf",
    inputs: [
      {
        name: "bidder",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "callbackGasLimit",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "cancelBid",
    inputs: [
      {
        name: "recipient",
        type: "address",
        internalType: "address payable",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimBonus",
    inputs: [
      {
        name: "drawId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimNFT",
    inputs: [
      {
        name: "drawId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "closed",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "coordinator",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IVRFCoordinatorV2Plus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "drawCount",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "eligibleInventoryCounts",
    inputs: [],
    outputs: [
      {
        name: "prizes",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "boxes",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "finalizeDraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getDraw",
    inputs: [
      {
        name: "drawId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ForgottenPrison.Draw",
        components: [
          {
            name: "winner",
            type: "address",
            internalType: "address",
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "requestId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "requestedAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "inventorySize",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "boxInventorySize",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "randomWord",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "bonusWord",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "collection",
            type: "address",
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "boxTokenId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "status",
            type: "uint8",
            internalType: "enum ForgottenPrison.DrawStatus",
          },
          {
            name: "claimed",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "bonusAwarded",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "bonusClaimed",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "highestBid",
    inputs: [],
    outputs: [
      {
        name: "bidder",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "impBoxCollection",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC721",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "keyHash",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nativePayment",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextDrawAt",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "onERC721Received",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingDrawId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingOwner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingPayments",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proceeds",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "rawFulfillRandomWords",
    inputs: [
      {
        name: "requestId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "randomWords",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "recoverUnsoldNFT",
    inputs: [
      {
        name: "collection",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "refunds",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "requestConfirmations",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "shutdownStalledAuction",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startDailyDraw",
    inputs: [],
    outputs: [
      {
        name: "drawId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "subscriptionId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "syncReceivedNFT",
    inputs: [
      {
        name: "collection",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "tokenStatus",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum ForgottenPrison.TokenStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalBidEscrow",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalRefunds",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "warriorCollection",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC721",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdrawProceeds",
    inputs: [
      {
        name: "recipient",
        type: "address",
        internalType: "address payable",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawRefund",
    inputs: [
      {
        name: "recipient",
        type: "address",
        internalType: "address payable",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "wizardCollection",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC721",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "BidCancelled",
    inputs: [
      {
        name: "bidder",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BidPlaced",
    inputs: [
      {
        name: "bidder",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "sequence",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BonusAwarded",
    inputs: [
      {
        name: "drawId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "winner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BonusClaimed",
    inputs: [
      {
        name: "drawId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DrawFinalized",
    inputs: [
      {
        name: "drawId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "winner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "collection",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "price",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DrawStarted",
    inputs: [
      {
        name: "drawId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "winner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "price",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "requestId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "inventorySize",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "boxInventorySize",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EmptyDaySkipped",
    inputs: [
      {
        name: "nextDrawAt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "InventoryDeposited",
    inputs: [
      {
        name: "collection",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "eligible",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "NFTClaimed",
    inputs: [
      {
        name: "drawId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "collection",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferStarted",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProceedsWithdrawn",
    inputs: [
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RandomnessReceived",
    inputs: [
      {
        name: "drawId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "requestId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RefundWithdrawn",
    inputs: [
      {
        name: "bidder",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Shutdown",
    inputs: [
      {
        name: "abortedDrawId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UnsoldNFTRecovered",
    inputs: [
      {
        name: "collection",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AlreadyClaimed",
    inputs: [],
  },
  {
    type: "error",
    name: "AuctionClosed",
    inputs: [],
  },
  {
    type: "error",
    name: "BidAlreadyExists",
    inputs: [],
  },
  {
    type: "error",
    name: "CannotShutdown",
    inputs: [],
  },
  {
    type: "error",
    name: "CutoffReached",
    inputs: [],
  },
  {
    type: "error",
    name: "DrawPending",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientProceeds",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidBid",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidConfiguration",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidRecipient",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidToken",
    inputs: [
      {
        name: "collection",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "NoBid",
    inputs: [],
  },
  {
    type: "error",
    name: "NoBonus",
    inputs: [],
  },
  {
    type: "error",
    name: "NoInventory",
    inputs: [],
  },
  {
    type: "error",
    name: "NoPendingDraw",
    inputs: [],
  },
  {
    type: "error",
    name: "NotClosed",
    inputs: [],
  },
  {
    type: "error",
    name: "NotWinner",
    inputs: [],
  },
  {
    type: "error",
    name: "OnlyCoordinatorCanFulfill",
    inputs: [
      {
        name: "have",
        type: "address",
        internalType: "address",
      },
      {
        name: "want",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "RandomnessNotReady",
    inputs: [],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
  {
    type: "error",
    name: "TooEarly",
    inputs: [],
  },
  {
    type: "error",
    name: "TransferFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "ZeroAmount",
    inputs: [],
  },
] as const;
