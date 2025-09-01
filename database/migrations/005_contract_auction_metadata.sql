-- Table to store metadata for smart contract auctions
-- This links smart contract auction IDs with additional metadata like images

CREATE TABLE IF NOT EXISTS contract_auction_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_auction_id INTEGER NOT NULL UNIQUE, -- Maps to smart contract auction index
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,
    thumbnail_url TEXT,
    created_by VARCHAR(42), -- Ethereum address
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contract_auction_metadata_contract_id 
ON contract_auction_metadata(contract_auction_id);

-- Create update trigger for updated_at
CREATE OR REPLACE TRIGGER update_contract_auction_metadata_updated_at
    BEFORE UPDATE ON contract_auction_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
ALTER TABLE contract_auction_metadata ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON contract_auction_metadata
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON contract_auction_metadata
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own entries
CREATE POLICY "Allow users to update own entries" ON contract_auction_metadata
    FOR UPDATE
    USING (created_by = auth.jwt() ->> 'sub');