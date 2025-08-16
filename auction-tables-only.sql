-- ===========================================
-- AUCTION HOUSE TABLES ONLY
-- Run this SQL in your Supabase SQL Editor if you only need to add auction functionality
-- ===========================================

-- Enable extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===========================================
-- AUCTION TABLES
-- ===========================================

-- Auctions table
CREATE TABLE IF NOT EXISTS auctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    artwork_url TEXT NOT NULL,
    artwork_thumbnail_url TEXT,
    
    -- Auction mechanics
    starting_bid DECIMAL(18, 8) NOT NULL DEFAULT 0,
    current_bid DECIMAL(18, 8) DEFAULT 0,
    minimum_increment DECIMAL(18, 8) NOT NULL DEFAULT 0.01,
    reserve_price DECIMAL(18, 8),
    
    -- Timing
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    time_buffer_seconds INTEGER DEFAULT 300, -- 5 minutes
    
    -- Status
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended', 'settled', 'cancelled')),
    
    -- Blockchain integration (for future Web3 integration)
    contract_address TEXT,
    token_id TEXT,
    chain_id INTEGER,
    transaction_hash TEXT,
    
    -- Metadata
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
    
    -- Bid details
    amount DECIMAL(18, 8) NOT NULL,
    is_winning BOOLEAN DEFAULT FALSE,
    
    -- Blockchain integration
    transaction_hash TEXT,
    block_number BIGINT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auction watchers (users following auctions)
CREATE TABLE IF NOT EXISTS auction_watchers (
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (auction_id, user_id)
);

-- ===========================================
-- INDEXES
-- ===========================================

-- Auctions indexes
CREATE INDEX IF NOT EXISTS idx_auctions_creator_id ON auctions(creator_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_auctions_category ON auctions(category);
CREATE INDEX IF NOT EXISTS idx_auctions_active ON auctions(id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_auctions_active_status ON auctions(status, end_time) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_auctions_tags ON auctions USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_auctions_search_title ON auctions USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_auctions_search_desc ON auctions USING GIN (to_tsvector('english', description));

-- Bids indexes
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bids_amount ON bids(amount);
CREATE INDEX IF NOT EXISTS idx_bids_auction_amount ON bids(auction_id, amount DESC);
CREATE INDEX IF NOT EXISTS idx_bids_winning ON bids(auction_id, is_winning) WHERE is_winning = TRUE;
CREATE INDEX IF NOT EXISTS idx_bids_created_at ON bids(created_at);

-- Auction watchers indexes
CREATE INDEX IF NOT EXISTS idx_auction_watchers_user_id ON auction_watchers(user_id);
CREATE INDEX IF NOT EXISTS idx_auction_watchers_auction_id ON auction_watchers(auction_id);

-- ===========================================
-- VIEWS
-- ===========================================

-- Active auctions view
CREATE OR REPLACE VIEW active_auctions AS
SELECT 
    a.*,
    p.name as creator_name,
    p.avatar_url as creator_avatar,
    (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as total_bids,
    (SELECT COUNT(*) FROM auction_watchers aw WHERE aw.auction_id = a.id) as watcher_count
FROM auctions a
LEFT JOIN profiles p ON a.creator_id = p.id
WHERE a.deleted_at IS NULL;

-- Auction details with bid history view
CREATE OR REPLACE VIEW auction_details AS
SELECT 
    a.*,
    p.name as creator_name,
    p.avatar_url as creator_avatar,
    p.twitter as creator_twitter,
    p.discord as creator_discord,
    p.website as creator_website,
    (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as total_bids,
    (SELECT COUNT(*) FROM auction_watchers aw WHERE aw.auction_id = a.id) as watcher_count,
    (SELECT array_agg(
        json_build_object(
            'id', b.id,
            'amount', b.amount,
            'bidder_id', b.bidder_id,
            'bidder_name', bp.name,
            'bidder_avatar', bp.avatar_url,
            'created_at', b.created_at,
            'is_winning', b.is_winning
        ) ORDER BY b.created_at DESC
    ) FROM bids b 
    LEFT JOIN profiles bp ON b.bidder_id = bp.id 
    WHERE b.auction_id = a.id) as bid_history
FROM auctions a
LEFT JOIN profiles p ON a.creator_id = p.id
WHERE a.deleted_at IS NULL;

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to update auction status
CREATE OR REPLACE FUNCTION update_auction_statuses()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER := 0;
    additional_count INTEGER := 0;
BEGIN
    -- Update upcoming auctions to active
    UPDATE auctions 
    SET status = 'active', updated_at = NOW()
    WHERE status = 'upcoming' 
    AND start_time <= NOW() 
    AND end_time > NOW()
    AND deleted_at IS NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    -- Update active auctions to ended
    UPDATE auctions 
    SET status = 'ended', updated_at = NOW()
    WHERE status = 'active' 
    AND end_time <= NOW()
    AND deleted_at IS NULL;
    
    GET DIAGNOSTICS additional_count = ROW_COUNT;
    
    RETURN updated_count + additional_count;
END;
$$ LANGUAGE plpgsql;

-- Function to place a bid
CREATE OR REPLACE FUNCTION place_bid(
    p_auction_id UUID,
    p_bidder_id UUID,
    p_amount DECIMAL(18, 8)
)
RETURNS JSON AS $$
DECLARE
    v_auction auctions%ROWTYPE;
    v_current_time TIMESTAMP WITH TIME ZONE := NOW();
    v_new_end_time TIMESTAMP WITH TIME ZONE;
    v_bid_id UUID;
    v_result JSON;
BEGIN
    -- Get auction details
    SELECT * INTO v_auction FROM auctions WHERE id = p_auction_id AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Auction not found');
    END IF;
    
    -- Check auction status
    IF v_auction.status != 'active' THEN
        RETURN json_build_object('success', false, 'error', 'Auction is not active');
    END IF;
    
    -- Check if auction has ended
    IF v_auction.end_time <= v_current_time THEN
        RETURN json_build_object('success', false, 'error', 'Auction has ended');
    END IF;
    
    -- Check minimum bid amount
    IF p_amount < (COALESCE(v_auction.current_bid, v_auction.starting_bid) + v_auction.minimum_increment) THEN
        RETURN json_build_object('success', false, 'error', 'Bid amount too low');
    END IF;
    
    -- Check reserve price if set
    IF v_auction.reserve_price IS NOT NULL AND p_amount < v_auction.reserve_price THEN
        RETURN json_build_object('success', false, 'error', 'Bid does not meet reserve price');
    END IF;
    
    -- Calculate new end time (extend if bid placed in last buffer period)
    v_new_end_time := v_auction.end_time;
    IF v_auction.end_time - v_current_time < INTERVAL '1 second' * v_auction.time_buffer_seconds THEN
        v_new_end_time := v_current_time + INTERVAL '1 second' * v_auction.time_buffer_seconds;
    END IF;
    
    -- Mark previous winning bids as not winning
    UPDATE bids SET is_winning = FALSE WHERE auction_id = p_auction_id AND is_winning = TRUE;
    
    -- Insert new bid
    INSERT INTO bids (auction_id, bidder_id, amount, is_winning, created_at)
    VALUES (p_auction_id, p_bidder_id, p_amount, TRUE, v_current_time)
    RETURNING id INTO v_bid_id;
    
    -- Update auction with new current bid and possibly extended end time
    UPDATE auctions 
    SET 
        current_bid = p_amount,
        end_time = v_new_end_time,
        updated_at = v_current_time
    WHERE id = p_auction_id;
    
    -- Return success response
    v_result := json_build_object(
        'success', true,
        'bid_id', v_bid_id,
        'new_end_time', v_new_end_time,
        'time_extended', v_new_end_time > v_auction.end_time
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auction updated_at trigger
DROP TRIGGER IF EXISTS update_auctions_updated_at ON auctions;
CREATE TRIGGER update_auctions_updated_at
    BEFORE UPDATE ON auctions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===========================================

-- Enable RLS on auction tables
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_watchers ENABLE ROW LEVEL SECURITY;

-- Auction policies
CREATE POLICY "Anyone can read active auctions" 
ON auctions FOR SELECT 
USING (deleted_at IS NULL);

CREATE POLICY "Users can create auctions" 
ON auctions FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own auctions" 
ON auctions FOR UPDATE 
USING (auth.uid() = creator_id AND status IN ('upcoming', 'active'));

CREATE POLICY "Admins can manage all auctions" 
ON auctions FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Bid policies
CREATE POLICY "Anyone can read bids" 
ON bids FOR SELECT 
USING (TRUE);

CREATE POLICY "Authenticated users can place bids" 
ON bids FOR INSERT 
WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Admins can manage all bids" 
ON bids FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Auction watcher policies
CREATE POLICY "Users can read their own watches" 
ON auction_watchers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own watches" 
ON auction_watchers FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all watches" 
ON auction_watchers FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ===========================================
-- GRANT PERMISSIONS
-- ===========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON active_auctions TO anon, authenticated;
GRANT SELECT ON auction_details TO anon, authenticated;
GRANT ALL ON auctions TO authenticated;
GRANT ALL ON bids TO authenticated;
GRANT ALL ON auction_watchers TO authenticated;

-- Grant function execution permissions
GRANT EXECUTE ON FUNCTION place_bid(UUID, UUID, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION update_auction_statuses() TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Auction house tables, functions, and policies created successfully!';
    RAISE NOTICE 'You can now create auctions at /auctions/create';
END $$;