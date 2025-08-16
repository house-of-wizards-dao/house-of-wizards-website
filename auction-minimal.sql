-- MINIMAL AUCTION TABLES FOR QUICK SETUP
-- Run this in your Supabase SQL Editor to get auctions working quickly

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auctions table
CREATE TABLE IF NOT EXISTS auctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    artwork_url TEXT NOT NULL,
    artwork_thumbnail_url TEXT,
    starting_bid DECIMAL(18, 8) NOT NULL DEFAULT 0,
    current_bid DECIMAL(18, 8) DEFAULT 0,
    minimum_increment DECIMAL(18, 8) NOT NULL DEFAULT 0.01,
    reserve_price DECIMAL(18, 8),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    time_buffer_seconds INTEGER DEFAULT 300,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended', 'settled', 'cancelled')),
    category TEXT DEFAULT 'art',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Bids table
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    bidder_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(18, 8) NOT NULL,
    is_winning BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auction watchers table
CREATE TABLE IF NOT EXISTS auction_watchers (
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (auction_id, user_id)
);

-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_auctions_creator_id ON auctions(creator_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);

-- Enable RLS
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_watchers ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Anyone can read auctions" ON auctions FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users can create auctions" ON auctions FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Anyone can read bids" ON bids FOR SELECT USING (TRUE);
CREATE POLICY "Users can place bids" ON bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);
CREATE POLICY "Users can manage their watches" ON auction_watchers FOR ALL USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON auctions TO authenticated;
GRANT ALL ON bids TO authenticated; 
GRANT ALL ON auction_watchers TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'SUCCESS: Basic auction tables created! You can now test auction creation at /auctions/create';
END $$;