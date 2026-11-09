import { OrderStatus, type Offer as OpenSeaOffer } from "@opensea/sdk";
import {
  estimateSellerNetWeiFromBidOrder,
  offerWithSellerNetProceeds,
  orderToOffer,
} from "@/lib/marketplace";

jest.mock("@opensea/sdk", () => ({
  OrderStatus: { ACTIVE: "ACTIVE" },
  Chain: { Mainnet: "ethereum" },
  OpenSeaSDK: jest.fn(),
}));
jest.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
jest.mock("@/lib/logger", () => ({ logger: { debug: jest.fn() } }));

const seller = "0x1111111111111111111111111111111111111111";
const bidder = "0x2222222222222222222222222222222222222222";
const weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const zeroAddress = "0x0000000000000000000000000000000000000000";
const zeroHash = `0x${"0".repeat(64)}`;

// Same amounts and quantity as the production collection offer for Wizard #4955.
const makeOrder = (quantity = "2"): OpenSeaOffer => ({
  order_hash: zeroHash,
  chain: "ethereum",
  protocol_address: zeroAddress,
  price: { value: "35600000000000000", currency: "WETH", decimals: 18 },
  status: OrderStatus.ACTIVE,
  protocol_data: {
    signature: "0x",
    parameters: {
      offerer: bidder,
      zone: zeroAddress,
      orderType: 3,
      startTime: "1794194961",
      endTime: "1794195861",
      zoneHash: zeroHash,
      salt: "0",
      conduitKey: zeroHash,
      counter: "0",
      totalOriginalConsiderationItems: 2,
      offer: [
        {
          itemType: 1,
          token: weth,
          identifierOrCriteria: "0",
          startAmount: "71200000000000000",
          endAmount: "71200000000000000",
        },
      ],
      consideration: [
        {
          itemType: 4,
          token: "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42",
          identifierOrCriteria: "0",
          startAmount: quantity,
          endAmount: quantity,
          recipient: bidder,
        },
        {
          itemType: 1,
          token: weth,
          identifierOrCriteria: "0",
          startAmount: "712000000000000",
          endAmount: "712000000000000",
          recipient: zeroAddress,
        },
      ],
    },
  },
});

it("shows per-NFT proceeds after fees for a multi-quantity collection bid", () => {
  const order = makeOrder();
  const offer = orderToOffer(order);
  expect(offer.price.amount).toBe("35600000000000000");

  const netOffer = offerWithSellerNetProceeds(offer, seller);
  expect(netOffer.price.amount).toBe("35244000000000000");
  expect(netOffer.grossBidAmount).toBe("35600000000000000");
  expect(netOffer.orderHash).toBe(order.order_hash);
  expect(netOffer.protocolData).toBe(order.protocol_data);
  expect(order.protocol_data.parameters.offer[0].startAmount).toBe(
    "71200000000000000",
  );
});

it("does not divide the proceeds of a single-NFT bid", () => {
  const order = makeOrder("1");
  order.protocol_data.parameters.consideration[0].itemType = 2;
  expect(orderToOffer(order).price.amount).toBe("71200000000000000");
  expect(
    offerWithSellerNetProceeds(orderToOffer(order), seller).price.amount,
  ).toBe("70488000000000000");
});

it("normalizes an explicit seller payment to one NFT", () => {
  const order = makeOrder();
  order.protocol_data.parameters.consideration.push({
    itemType: 1,
    token: weth,
    identifierOrCriteria: "0",
    startAmount: "70488000000000000",
    endAmount: "70488000000000000",
    recipient: seller.toUpperCase(),
  });
  expect(estimateSellerNetWeiFromBidOrder(order.protocol_data, seller)).toBe(
    35244000000000000n,
  );
});

it.each(["0", "invalid", "-1"])(
  "uses API price metadata when NFT quantity is %s",
  (quantity) => {
    const order = makeOrder(quantity);
    const offer = orderToOffer(order);
    expect(offer.price.amount).toBe(order.price.value);
    expect(
      estimateSellerNetWeiFromBidOrder(order.protocol_data, seller),
    ).toBeNull();
  },
);

it.each([undefined, null, {}, { parameters: {} }])(
  "cannot estimate proceeds from incomplete protocol data: %p",
  (data) => {
    expect(estimateSellerNetWeiFromBidOrder(data, seller)).toBeNull();
  },
);

it("does not silently omit malformed fees", () => {
  const order = makeOrder();
  order.protocol_data.parameters.consideration[1].startAmount = "invalid";
  expect(
    estimateSellerNetWeiFromBidOrder(order.protocol_data, seller),
  ).toBeNull();
});
