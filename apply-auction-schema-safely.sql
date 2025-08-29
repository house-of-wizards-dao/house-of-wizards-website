-- Safe Application of Auction System Schema
-- This script applies the auction system schema while preserving existing data
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- ==========================================
-- STEP 1: Create missing custom types
-- ==========================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auction_status') THEN
        CREATE TYPE auction_status AS ENUM ('draft', 'active', 'ended', 'cancelled');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bid_status') THEN
        CREATE TYPE bid_status AS ENUM ('active', 'outbid', 'winning', 'won', 'lost');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'artwork_status') THEN
        CREATE TYPE artwork_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END
$$;

-- ==========================================
-- STEP 2: Fix Rate Limiting Function (Critical)
-- ==========================================

CREATE OR REPLACE FUNCTION create_rate_limits_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  -- Ensure rate_limits table exists with correct structure
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'rate_limits'
  ) THEN
    -- Create rate_limits table
    CREATE TABLE public.rate_limits (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) NOT NULL UNIQUE,
      count INTEGER DEFAULT 1,
      reset_time BIGINT NOT NULL,
      window_start BIGINT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  END IF;
  
  -- Ensure indexes exist
  CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON public.rate_limits(key);
  CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON public.rate_limits(reset_time);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- STEP 3: Create Auction System Tables
-- ==========================================

-- Artworks table
CREATE TABLE IF NOT EXISTS artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    artist_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    thumbnail_url TEXT NOT NULL,
    medium VARCHAR(100),
    dimensions VARCHAR(100),
    year_created INTEGER CHECK (year_created >= 1000 AND year_created <= EXTRACT(YEAR FROM NOW())),
    edition_size INTEGER CHECK (edition_size > 0),
    edition_number INTEGER CHECK (edition_number > 0),
    provenance TEXT,
    certificate_authenticity BOOLEAN DEFAULT FALSE,
    estimated_value_min DECIMAL(12, 2) CHECK (estimated_value_min >= 0),
    estimated_value_max DECIMAL(12, 2) CHECK (estimated_value_max >= 0),
    reserve_price DECIMAL(12, 2) CHECK (reserve_price >= 0),
    status artwork_status NOT NULL DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT artworks_estimated_value_check CHECK (estimated_value_min <= estimated_value_max),
    CONSTRAINT artworks_edition_check CHECK (edition_number <= edition_size OR edition_number IS NULL OR edition_size IS NULL),
    CONSTRAINT artworks_image_urls_not_empty CHECK (array_length(image_urls, 1) > 0)
);

-- Auctions table
CREATE TABLE IF NOT EXISTS auctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    starting_bid DECIMAL(12, 2) NOT NULL CHECK (starting_bid > 0),
    reserve_price DECIMAL(12, 2) CHECK (reserve_price >= 0),
    current_bid DECIMAL(12, 2) CHECK (current_bid >= 0),
    bid_increment DECIMAL(12, 2) NOT NULL CHECK (bid_increment > 0),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status auction_status NOT NULL DEFAULT 'draft',
    total_bids INTEGER NOT NULL DEFAULT 0,
    winner_id UUID REFERENCES profiles(id),
    created_by UUID NOT NULL REFERENCES profiles(id),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    contract_auction_id INTEGER, -- Maps to smart contract auction index
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add constraints separately to handle IF NOT EXISTS properly
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auctions_time_check') THEN
        ALTER TABLE auctions ADD CONSTRAINT auctions_time_check CHECK (end_time > start_time);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auctions_reserve_check') THEN
        ALTER TABLE auctions ADD CONSTRAINT auctions_reserve_check CHECK (reserve_price >= starting_bid OR reserve_price IS NULL);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auctions_current_bid_check') THEN
        ALTER TABLE auctions ADD CONSTRAINT auctions_current_bid_check CHECK (current_bid >= starting_bid OR current_bid IS NULL);
    END IF;
END $$;

-- Bids table
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    bidder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    max_bid DECIMAL(12, 2) CHECK (max_bid >= amount),
    status bid_status NOT NULL DEFAULT 'active',
    is_auto_bid BOOLEAN NOT NULL DEFAULT FALSE,
    placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Bid history table (for audit trail)
CREATE TABLE IF NOT EXISTS bid_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    bidder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    placed_at TIMESTAMPTZ NOT NULL,
    was_winning BOOLEAN NOT NULL DEFAULT FALSE
);

-- Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate entries
    UNIQUE(user_id, auction_id)
);

-- Auction views table (for analytics)
CREATE TABLE IF NOT EXISTS auction_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity logs table (if not exists from current schema)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- STEP 4: Create Performance Indexes
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_artworks_status ON artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON artworks(created_at);

CREATE INDEX IF NOT EXISTS idx_auctions_artwork_id ON auctions(artwork_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_start_time ON auctions(start_time);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_auctions_created_by ON auctions(created_by);
CREATE INDEX IF NOT EXISTS idx_auctions_featured ON auctions(featured);
CREATE INDEX IF NOT EXISTS idx_auctions_current_bid ON auctions(current_bid);
CREATE INDEX IF NOT EXISTS idx_auctions_contract_id ON auctions(contract_auction_id);

CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bids_placed_at ON bids(placed_at);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_bids_amount ON bids(amount);

CREATE INDEX IF NOT EXISTS idx_bid_history_auction_id ON bid_history(auction_id);
CREATE INDEX IF NOT EXISTS idx_bid_history_bidder_id ON bid_history(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bid_history_placed_at ON bid_history(placed_at);

CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_auction_id ON watchlist(auction_id);

CREATE INDEX IF NOT EXISTS idx_auction_views_auction_id ON auction_views(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_views_user_id ON auction_views(user_id);
CREATE INDEX IF NOT EXISTS idx_auction_views_viewed_at ON auction_views(viewed_at);

CREATE INDEX IF NOT EXISTS idx_activity_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- ==========================================
-- STEP 5: Create Essential Functions
-- ==========================================

-- Function for updating timestamps (shared with existing schema)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_artworks_updated_at ON artworks;
CREATE TRIGGER update_artworks_updated_at 
    BEFORE UPDATE ON artworks 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_auctions_updated_at ON auctions;
CREATE TRIGGER update_auctions_updated_at 
    BEFORE UPDATE ON auctions 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to update auction bid statistics
CREATE OR REPLACE FUNCTION update_auction_bid_stats(auction_id UUID)
RETURNS VOID AS $$
DECLARE
    latest_bid RECORD;
    bid_count INTEGER;
BEGIN
    -- Get the highest active bid
    SELECT amount, bidder_id INTO latest_bid
    FROM bids
    WHERE auction_id = update_auction_bid_stats.auction_id 
    AND status = 'active'
    ORDER BY amount DESC, placed_at ASC
    LIMIT 1;
    
    -- Count total bids for this auction
    SELECT COUNT(*) INTO bid_count
    FROM bids
    WHERE auction_id = update_auction_bid_stats.auction_id;
    
    -- Update auction with current bid info
    UPDATE auctions
    SET 
        current_bid = latest_bid.amount,
        total_bids = bid_count,
        winner_id = latest_bid.bidder_id,
        updated_at = NOW()
    WHERE id = update_auction_bid_stats.auction_id;
    
    -- Update bid statuses
    UPDATE bids
    SET status = CASE
        WHEN id = (
            SELECT id FROM bids
            WHERE auction_id = update_auction_bid_stats.auction_id
            AND status = 'active'
            ORDER BY amount DESC, placed_at ASC
            LIMIT 1
        ) THEN 'winning'
        ELSE 'outbid'
    END
    WHERE auction_id = update_auction_bid_stats.auction_id
    AND status IN ('active', 'winning', 'outbid');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically end auctions
CREATE OR REPLACE FUNCTION auto_end_auctions()
RETURNS VOID AS $$
BEGIN
    -- End auctions that have passed their end time
    UPDATE auctions
    SET 
        status = 'ended',
        updated_at = NOW()
    WHERE status = 'active' 
    AND end_time <= NOW();
    
    -- Update final bid statuses for ended auctions
    UPDATE bids
    SET status = CASE
        WHEN status = 'winning' THEN 'won'
        WHEN status = 'outbid' THEN 'lost'
        ELSE status
    END
    WHERE auction_id IN (
        SELECT id FROM auctions 
        WHERE status = 'ended' 
        AND updated_at >= NOW() - INTERVAL '1 minute'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to prevent users from bidding on their own auctions
CREATE OR REPLACE FUNCTION prevent_self_bidding()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.bidder_id = (SELECT created_by FROM auctions WHERE id = NEW.auction_id) THEN
        RAISE EXCEPTION 'Users cannot bid on their own auctions';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to enforce the no-self-bidding rule
DROP TRIGGER IF EXISTS trigger_prevent_self_bidding ON bids;
CREATE TRIGGER trigger_prevent_self_bidding
    BEFORE INSERT ON bids
    FOR EACH ROW EXECUTE FUNCTION prevent_self_bidding();

-- ==========================================
-- STEP 6: Configure Row Level Security
-- ==========================================

ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Artwork policies
DROP POLICY IF EXISTS "Public can view approved artworks" ON artworks;
CREATE POLICY "Public can view approved artworks" ON artworks
    FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Artists can view their own artworks" ON artworks;
CREATE POLICY "Artists can view their own artworks" ON artworks
    FOR SELECT USING (auth.uid() = artist_id);

DROP POLICY IF EXISTS "Artists can create artworks" ON artworks;
CREATE POLICY "Artists can create artworks" ON artworks
    FOR INSERT WITH CHECK (auth.uid() = artist_id);

DROP POLICY IF EXISTS "Artists can update their own artworks" ON artworks;
CREATE POLICY "Artists can update their own artworks" ON artworks
    FOR UPDATE USING (auth.uid() = artist_id);

DROP POLICY IF EXISTS "Admins can manage all artworks" ON artworks;
CREATE POLICY "Admins can manage all artworks" ON artworks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- Auction policies
DROP POLICY IF EXISTS "Public can view active auctions" ON auctions;
CREATE POLICY "Public can view active auctions" ON auctions
    FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Users can view their own auctions" ON auctions;
CREATE POLICY "Users can view their own auctions" ON auctions
    FOR SELECT USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Authenticated users can create auctions" ON auctions;
CREATE POLICY "Authenticated users can create auctions" ON auctions
    FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update their own auctions" ON auctions;
CREATE POLICY "Users can update their own auctions" ON auctions
    FOR UPDATE USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Admins can manage all auctions" ON auctions;
CREATE POLICY "Admins can manage all auctions" ON auctions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- Bid policies
DROP POLICY IF EXISTS "Users can view bids on auctions they're involved in" ON bids;
CREATE POLICY "Users can view bids on auctions they're involved in" ON bids
    FOR SELECT USING (
        auth.uid() = bidder_id 
        OR auth.uid() = (SELECT created_by FROM auctions WHERE id = auction_id)
        OR EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

DROP POLICY IF EXISTS "Authenticated users can place bids" ON bids;
CREATE POLICY "Authenticated users can place bids" ON bids
    FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Watchlist policies
DROP POLICY IF EXISTS "Users can manage their own watchlist" ON watchlist;
CREATE POLICY "Users can manage their own watchlist" ON watchlist
    FOR ALL USING (auth.uid() = user_id);

-- Bid history policies
DROP POLICY IF EXISTS "Users can view bid history for their involvement" ON bid_history;
CREATE POLICY "Users can view bid history for their involvement" ON bid_history
    FOR SELECT USING (
        auth.uid() = bidder_id 
        OR auth.uid() = (SELECT created_by FROM auctions WHERE id = auction_id)
        OR EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- Auction views policies
DROP POLICY IF EXISTS "Users can insert their own views" ON auction_views;
CREATE POLICY "Users can insert their own views" ON auction_views
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Admins can view all analytics" ON auction_views;
CREATE POLICY "Admins can view all analytics" ON auction_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- Activity logs policies
DROP POLICY IF EXISTS "Admins can view all activity logs" ON activity_logs;
CREATE POLICY "Admins can view all activity logs" ON activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- ==========================================
-- STEP 7: Grant Function Permissions
-- ==========================================

GRANT EXECUTE ON FUNCTION create_rate_limits_table_if_not_exists() TO authenticated;
GRANT EXECUTE ON FUNCTION update_auction_bid_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION auto_end_auctions() TO authenticated;

-- ==========================================
-- STEP 8: Summary Report
-- ==========================================

SELECT 'Auction system schema applied successfully!' as status,
       'Rate limiting function is now available' as rate_limit_fix,
       'All auction tables created with proper indexes' as tables_status,
       'Row Level Security policies configured' as security_status;