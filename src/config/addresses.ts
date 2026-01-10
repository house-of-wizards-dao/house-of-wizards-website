export const frwcAddresses = {
  beasts: "0x8634C23D5794Ed177E9Ffd55b22fdB80A505ab7B",
  wizards: "0x521f9C7505005CFA19A8E5786a9c3c9c9F5e6f42",
  souls: "0x251b5f14a825c537ff788604ea1b58e49b70726f",
  warriors: "0x9690b63eb85467be5267a3603f770589ab12dc95",
  ponies: "0xf55b615B479482440135Ebf1b907fD4c37eD9420",
  spawn: "0x7de11a2d9E9727fa5eAd3094E40211C5e9cf5857",
  veil: "0x31158181b4b91A423bfDC758fC3bf8735711f9C5",
  locks: "0xDa5cF3a42ebaCd2d8fcb53830b1025E01D37832D",
  athenaeum: "0x7C104b4db94494688027CcED1E2EBFb89642C80F",
  impBox: "0x59775fD5F266C216D7566eB216153aB8863C9c84",
} as const;

export const addresses = {
  ...frwcAddresses,
  pfpMint: "0xe0a76c1fb3DC9EaE2ceCB7c4c3993610e08c8a56",
} as const;

/**
 * Collection name lookup: maps contract address (lowercase) to friendly collection name
 */
export const collectionNames: Record<string, string> = {
  [frwcAddresses.beasts.toLowerCase()]: "Beasts",
  [frwcAddresses.wizards.toLowerCase()]: "Wizards",
  [frwcAddresses.warriors.toLowerCase()]: "Warriors",
  [frwcAddresses.souls.toLowerCase()]: "Souls",
  [frwcAddresses.ponies.toLowerCase()]: "Ponies",
  [frwcAddresses.spawn.toLowerCase()]: "Spawn",
  [frwcAddresses.veil.toLowerCase()]: "Infinity Veil",
  [frwcAddresses.locks.toLowerCase()]: "Locks",
  [frwcAddresses.athenaeum.toLowerCase()]: "Athenaeum",
  [frwcAddresses.impBox.toLowerCase()]: "Imp's Treat Boxes",
};

/**
 * Get friendly collection name from contract address
 */
export function getCollectionName(contractAddress: string): string {
  return collectionNames[contractAddress.toLowerCase()] || contractAddress;
}
