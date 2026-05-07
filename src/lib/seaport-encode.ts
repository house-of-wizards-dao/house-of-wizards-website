import { encodeFunctionData } from "viem";

/**
 * Seaport 1.6 protocol address on Ethereum mainnet.
 *
 * https://docs.opensea.io/reference/seaport-overview
 */
export const SEAPORT_ADDRESS = "0x0000000000000068F116a894984e2DB1123eB395";

/**
 * Minimal Seaport ABI for the fulfill functions OpenSea's
 * `generateFulfillmentData` may pick. We don't need the full Seaport ABI;
 * just enough to encode the calldata for the function name OpenSea returns.
 */
export const SEAPORT_ABI = [
  {
    name: "fulfillBasicOrder_efficient_6GL6yc",
    type: "function",
    inputs: [
      {
        name: "parameters",
        type: "tuple",
        components: [
          { name: "considerationToken", type: "address" },
          { name: "considerationIdentifier", type: "uint256" },
          { name: "considerationAmount", type: "uint256" },
          { name: "offerer", type: "address" },
          { name: "zone", type: "address" },
          { name: "offerToken", type: "address" },
          { name: "offerIdentifier", type: "uint256" },
          { name: "offerAmount", type: "uint256" },
          { name: "basicOrderType", type: "uint8" },
          { name: "startTime", type: "uint256" },
          { name: "endTime", type: "uint256" },
          { name: "zoneHash", type: "bytes32" },
          { name: "salt", type: "uint256" },
          { name: "offererConduitKey", type: "bytes32" },
          { name: "fulfillerConduitKey", type: "bytes32" },
          { name: "totalOriginalAdditionalRecipients", type: "uint256" },
          {
            name: "additionalRecipients",
            type: "tuple[]",
            components: [
              { name: "amount", type: "uint256" },
              { name: "recipient", type: "address" },
            ],
          },
          { name: "signature", type: "bytes" },
        ],
      },
    ],
  },
  {
    name: "fulfillBasicOrder",
    type: "function",
    inputs: [
      {
        name: "parameters",
        type: "tuple",
        components: [
          { name: "considerationToken", type: "address" },
          { name: "considerationIdentifier", type: "uint256" },
          { name: "considerationAmount", type: "uint256" },
          { name: "offerer", type: "address" },
          { name: "zone", type: "address" },
          { name: "offerToken", type: "address" },
          { name: "offerIdentifier", type: "uint256" },
          { name: "offerAmount", type: "uint256" },
          { name: "basicOrderType", type: "uint8" },
          { name: "startTime", type: "uint256" },
          { name: "endTime", type: "uint256" },
          { name: "zoneHash", type: "bytes32" },
          { name: "salt", type: "uint256" },
          { name: "offererConduitKey", type: "bytes32" },
          { name: "fulfillerConduitKey", type: "bytes32" },
          { name: "totalOriginalAdditionalRecipients", type: "uint256" },
          {
            name: "additionalRecipients",
            type: "tuple[]",
            components: [
              { name: "amount", type: "uint256" },
              { name: "recipient", type: "address" },
            ],
          },
          { name: "signature", type: "bytes" },
        ],
      },
    ],
  },
  {
    name: "fulfillOrder",
    type: "function",
    inputs: [
      {
        name: "order",
        type: "tuple",
        components: [
          {
            name: "parameters",
            type: "tuple",
            components: [
              { name: "offerer", type: "address" },
              { name: "zone", type: "address" },
              {
                name: "offer",
                type: "tuple[]",
                components: [
                  { name: "itemType", type: "uint8" },
                  { name: "token", type: "address" },
                  { name: "identifierOrCriteria", type: "uint256" },
                  { name: "startAmount", type: "uint256" },
                  { name: "endAmount", type: "uint256" },
                ],
              },
              {
                name: "consideration",
                type: "tuple[]",
                components: [
                  { name: "itemType", type: "uint8" },
                  { name: "token", type: "address" },
                  { name: "identifierOrCriteria", type: "uint256" },
                  { name: "startAmount", type: "uint256" },
                  { name: "endAmount", type: "uint256" },
                  { name: "recipient", type: "address" },
                ],
              },
              { name: "orderType", type: "uint8" },
              { name: "startTime", type: "uint256" },
              { name: "endTime", type: "uint256" },
              { name: "zoneHash", type: "bytes32" },
              { name: "salt", type: "uint256" },
              { name: "conduitKey", type: "bytes32" },
              { name: "totalOriginalConsiderationItems", type: "uint256" },
            ],
          },
          { name: "signature", type: "bytes" },
        ],
      },
      { name: "fulfillerConduitKey", type: "bytes32" },
    ],
  },
  {
    name: "fulfillAdvancedOrder",
    type: "function",
    inputs: [
      {
        name: "advancedOrder",
        type: "tuple",
        components: [
          {
            name: "parameters",
            type: "tuple",
            components: [
              { name: "offerer", type: "address" },
              { name: "zone", type: "address" },
              {
                name: "offer",
                type: "tuple[]",
                components: [
                  { name: "itemType", type: "uint8" },
                  { name: "token", type: "address" },
                  { name: "identifierOrCriteria", type: "uint256" },
                  { name: "startAmount", type: "uint256" },
                  { name: "endAmount", type: "uint256" },
                ],
              },
              {
                name: "consideration",
                type: "tuple[]",
                components: [
                  { name: "itemType", type: "uint8" },
                  { name: "token", type: "address" },
                  { name: "identifierOrCriteria", type: "uint256" },
                  { name: "startAmount", type: "uint256" },
                  { name: "endAmount", type: "uint256" },
                  { name: "recipient", type: "address" },
                ],
              },
              { name: "orderType", type: "uint8" },
              { name: "startTime", type: "uint256" },
              { name: "endTime", type: "uint256" },
              { name: "zoneHash", type: "bytes32" },
              { name: "salt", type: "uint256" },
              { name: "conduitKey", type: "bytes32" },
              { name: "totalOriginalConsiderationItems", type: "uint256" },
            ],
          },
          { name: "numerator", type: "uint120" },
          { name: "denominator", type: "uint120" },
          { name: "signature", type: "bytes" },
          { name: "extraData", type: "bytes" },
        ],
      },
      {
        name: "criteriaResolvers",
        type: "tuple[]",
        components: [
          { name: "orderIndex", type: "uint256" },
          { name: "side", type: "uint8" },
          { name: "index", type: "uint256" },
          { name: "identifier", type: "uint256" },
          { name: "criteriaProof", type: "bytes32[]" },
        ],
      },
      { name: "fulfillerConduitKey", type: "bytes32" },
      { name: "recipient", type: "address" },
    ],
  },
] as const;

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Encode Seaport fulfill calldata from the OpenSea-prepared input data.
 * `functionName` is whatever OpenSea's `generateFulfillmentData` returns
 * (e.g. "fulfillAdvancedOrder", "fulfillBasicOrder_efficient_6GL6yc(...)");
 * we normalize and encode against {@link SEAPORT_ABI}.
 */
export const encodeSeaportCall = (
  functionName: string,
  inputData: Record<string, unknown>,
): `0x${string}` => {
  const baseFunctionName = functionName.split("(")[0];

  let normalizedFn: string;
  if (baseFunctionName.includes("efficient")) {
    normalizedFn = "fulfillBasicOrder_efficient_6GL6yc";
  } else if (baseFunctionName === "fulfillAdvancedOrder") {
    normalizedFn = "fulfillAdvancedOrder";
  } else if (baseFunctionName === "fulfillBasicOrder") {
    normalizedFn = "fulfillBasicOrder";
  } else if (baseFunctionName === "fulfillOrder") {
    normalizedFn = "fulfillOrder";
  } else {
    normalizedFn = baseFunctionName;
  }

  const abiEntry = SEAPORT_ABI.find((entry) => entry.name === normalizedFn);
  if (!abiEntry) {
    throw new Error(`Unknown Seaport function: ${functionName}`);
  }

  let args: unknown[];
  if (
    normalizedFn === "fulfillBasicOrder_efficient_6GL6yc" ||
    normalizedFn === "fulfillBasicOrder"
  ) {
    const params = inputData.basicOrderParameters || inputData.parameters;
    args = [params];
  } else if (normalizedFn === "fulfillAdvancedOrder") {
    args = [
      inputData.advancedOrder,
      inputData.criteriaResolvers || [],
      inputData.fulfillerConduitKey || ZERO_BYTES32,
      inputData.recipient,
    ];
  } else if (normalizedFn === "fulfillOrder") {
    args = [inputData.order, inputData.fulfillerConduitKey || ZERO_BYTES32];
  } else {
    throw new Error(`Unhandled Seaport function: ${normalizedFn}`);
  }

  return encodeFunctionData({
    abi: SEAPORT_ABI,
    functionName: normalizedFn,
    args: args as never,
  });
};
