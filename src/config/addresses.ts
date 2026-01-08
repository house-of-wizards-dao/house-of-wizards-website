export const frwcAddresses = {
  wizards: "0x521f9C7505005CFA19A8E5786a9c3c9c9F5e6f42",
  warriors: "0x9690b63eb85467be5267a3603f770589ab12dc95",
  souls: "0x251b5f14a825c537ff788604ea1b58e49b70726f",
  ponies: "0xf55b615B479482440135Ebf1b907fD4c37eD9420",
} as const;

export const addresses = {
  ...frwcAddresses,
  pfpMint: "0xe0a76c1fb3DC9EaE2ceCB7c4c3993610e08c8a56",
} as const;

export type CollectionName = "wizards" | "souls" | "warriors" | "ponies";

export type Collection = {
  name: CollectionName;
  address: string;
};

export const frwcCollections: Collection[] = [
  {
    name: "wizards",
    address: frwcAddresses.wizards.toLowerCase(),
  },
  {
    name: "souls",
    address: frwcAddresses.souls.toLowerCase(),
  },
  {
    name: "warriors",
    address: frwcAddresses.warriors.toLowerCase(),
  },
  {
    name: "ponies",
    address: frwcAddresses.ponies.toLowerCase(),
  },
];
