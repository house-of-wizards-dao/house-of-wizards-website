-- Add on_chain_auction_id column to auctions table

-- Add the on_chain_auction_id column to link off-chain auctions to on-chain auction IDs
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS on_chain_auction_id INTEGER;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_auctions_on_chain_auction_id ON auctions(on_chain_auction_id);

-- Add comment to explain the column
COMMENT ON COLUMN auctions.on_chain_auction_id IS 'The sequential auction ID from the smart contract, used to link off-chain auction data to on-chain auction state';