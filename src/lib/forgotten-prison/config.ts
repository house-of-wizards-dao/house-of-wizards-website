import { parseAbi } from "viem";

// The write transport is deliberately fixed. MAINNET_RPC_URL is only a fork source.
export const LOCAL_RPC = "http://127.0.0.1:8545";
export const DONOR = "0x6EAb2d42FEf9aad0036Bc145b5F451799e3FB3F7";
export const COLLECTIONS = {
  Warriors: "0x9690b63Eb85467BE5267A3603f770589Ab12Dc95",
  Wizards: "0x521f9C7505005CFA19A8E5786a9c3c9c9F5e6f42",
  "Imp boxes": "0x59775fD5F266C216D7566eB216153aB8863C9c84",
} as const;
export const COORDINATOR = "0xD7f86b4b8Cae7D942340FF628F82735b7a20893a";
export const KEY_HASH =
  "0x8077df514608a09f83e4e8d300645594e5d7234665448ba83f51a50f842bd3d9";
export const ERC721_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
  "function tokenOfOwnerByIndex(address,uint256) view returns (uint256)",
  "function numMinted() view returns (uint256)",
  "function safeTransferFrom(address,address,uint256)",
  "function transferFrom(address,address,uint256)",
]);
export const VRF_ABI = parseAbi([
  "function createSubscription() returns (uint256)",
  "event SubscriptionCreated(uint256 indexed subId,address owner)",
  "function fundSubscriptionWithNative(uint256 subId) payable",
  "function addConsumer(uint256 subId,address consumer)",
]);
