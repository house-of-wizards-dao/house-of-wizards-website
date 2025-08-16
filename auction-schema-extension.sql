-- Auction House Database Schema Extension
-- Add to existing supabase-schema.sql

-- ===========================================
-- AUCTION HOUSE TABLES
-- ===========================================

-- Auctions table
CREATE TABLE auctions (
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
CREATE TABLE bids (
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
CREATE TABLE auction_watchers (
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (auction_id, user_id)
);

-- ===========================================
-- AUCTION INDEXES
-- ===========================================

-- Auctions indexes
CREATE INDEX idx_auctions_creator_id ON auctions(creator_id);
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auctions_end_time ON auctions(end_time);
CREATE INDEX idx_auctions_category ON auctions(category);
CREATE INDEX idx_auctions_active ON auctions(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_auctions_active_status ON auctions(status, end_time) WHERE deleted_at IS NULL;
CREATE INDEX idx_auctions_tags ON auctions USING GIN (tags);
CREATE INDEX idx_auctions_search_title ON auctions USING GIN (to_tsvector('english', title));
CREATE INDEX idx_auctions_search_desc ON auctions USING GIN (to_tsvector('english', description));

-- Bids indexes
CREATE INDEX idx_bids_auction_id ON bids(auction_id);
CREATE INDEX idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX idx_bids_amount ON bids(amount);
CREATE INDEX idx_bids_auction_amount ON bids(auction_id, amount DESC);
CREATE INDEX idx_bids_winning ON bids(auction_id, is_winning) WHERE is_winning = TRUE;
CREATE INDEX idx_bids_created_at ON bids(created_at);

-- Auction watchers indexes
CREATE INDEX idx_auction_watchers_user_id ON auction_watchers(user_id);
CREATE INDEX idx_auction_watchers_auction_id ON auction_watchers(auction_id);

-- ===========================================
-- AUCTION VIEWS
-- ===========================================

-- Active auctions view
CREATE VIEW active_auctions AS
SELECT 
    a.*,
    p.name as creator_name,
    p.avatar_url as creator_avatar,
    (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as total_bids,
    (SELECT b.bidder_id FROM bids b WHERE b.auction_id = a.id AND b.is_winning = TRUE LIMIT 1) as current_winner_id,
    (SELECT COUNT(*) FROM auction_watchers aw WHERE aw.auction_id = a.id) as watchers_count
FROM auctions a
LEFT JOIN profiles p ON a.creator_id = p.id
WHERE a.deleted_at IS NULL;

-- Auction details with bid history view
CREATE VIEW auction_details AS
SELECT 
    a.*,
    p.name as creator_name,
    p.avatar_url as creator_avatar,
    p.twitter as creator_twitter,
    p.website as creator_website,
    (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as total_bids,
    (SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
            'id', b.id,
            'amount', b.amount,
            'bidder_name', bp.name,
            'bidder_avatar', bp.avatar_url,
            'created_at', b.created_at,
            'is_winning', b.is_winning
        ) ORDER BY b.created_at DESC
    )) as bid_history
FROM auctions a
LEFT JOIN profiles p ON a.creator_id = p.id
LEFT JOIN bids b ON a.id = b.auction_id
LEFT JOIN profiles bp ON b.bidder_id = bp.id
WHERE a.deleted_at IS NULL
GROUP BY a.id, p.name, p.avatar_url, p.twitter, p.website;

-- ===========================================
-- AUCTION FUNCTIONS
-- ===========================================

-- Function to place a bid
CREATE OR REPLACE FUNCTION place_bid(
    p_auction_id UUID,
    p_bidder_id UUID,
    p_amount DECIMAL(18, 8)
)
RETURNS JSONB AS $$
DECLARE
    auction_record RECORD;
    current_highest_bid DECIMAL(18, 8);
    time_remaining INTERVAL;
    result JSONB;
BEGIN
    -- Get auction details
    SELECT * INTO auction_record FROM auctions WHERE id = p_auction_id AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Auction not found');
    END IF;
    
    -- Check auction status
    IF auction_record.status != 'active' THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Auction is not active');
    END IF;
    
    -- Check if auction has ended
    IF auction_record.end_time <= NOW() THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Auction has ended');
    END IF;
    
    -- Get current highest bid
    SELECT COALESCE(MAX(amount), auction_record.starting_bid) INTO current_highest_bid
    FROM bids WHERE auction_id = p_auction_id;
    
    -- Check minimum bid requirement
    IF p_amount <= current_highest_bid + auction_record.minimum_increment THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Bid must be higher than current bid plus minimum increment');
    END IF;
    
    -- Mark previous winning bid as not winning
    UPDATE bids SET is_winning = FALSE WHERE auction_id = p_auction_id AND is_winning = TRUE;
    
    -- Insert new bid
    INSERT INTO bids (auction_id, bidder_id, amount, is_winning)
    VALUES (p_auction_id, p_bidder_id, p_amount, TRUE);
    
    -- Update auction current bid
    UPDATE auctions SET current_bid = p_amount WHERE id = p_auction_id;
    
    -- Check if bid was placed within time buffer and extend auction if needed
    time_remaining := auction_record.end_time - NOW();
    IF time_remaining < INTERVAL '1 second' * auction_record.time_buffer_seconds THEN
        UPDATE auctions 
        SET end_time = NOW() + INTERVAL '1 second' * auction_record.time_buffer_seconds
        WHERE id = p_auction_id;
    END IF;
    
    RETURN JSON_BUILD_OBJECT('success', true, 'new_bid_amount', p_amount);
END;
$$ LANGUAGE plpgsql;

-- Function to update auction status
CREATE OR REPLACE FUNCTION update_auction_statuses()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER := 0;
    additional_count INTEGER := 0;
BEGIN
    -- Update upcoming auctions to active
    UPDATE auctions 
    SET status = 'active' 
    WHERE status = 'upcoming' 
    AND start_time <= NOW() 
    AND deleted_at IS NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    -- Update active auctions to ended
    UPDATE auctions 
    SET status = 'ended' 
    WHERE status = 'active' 
    AND end_time <= NOW() 
    AND deleted_at IS NULL;
    
    GET DIAGNOSTICS additional_count = ROW_COUNT;
    updated_count := updated_count + additional_count;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- AUCTION TRIGGERS
-- ===========================================

-- Update updated_at trigger for auctions
CREATE TRIGGER update_auctions_updated_at
    BEFORE UPDATE ON auctions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- AUCTION RLS POLICIES
-- ===========================================

-- Enable RLS
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_watchers ENABLE ROW LEVEL SECURITY;

-- Auction policies
CREATE POLICY "Auctions are viewable by everyone" 
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
CREATE POLICY "Bids are viewable by everyone" 
ON bids FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can place bids" 
ON bids FOR INSERT 
WITH CHECK (auth.uid() = bidder_id);

-- Auction watchers policies
CREATE POLICY "Users can manage their own watchlist" 
ON auction_watchers FOR ALL 
USING (auth.uid() = user_id);

-- ===========================================
-- FUNCTION PERMISSIONS
-- ===========================================

GRANT EXECUTE ON FUNCTION place_bid(UUID, UUID, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION update_auction_statuses() TO authenticated;

-- ===========================================
-- COMMENTS
-- ===========================================

COMMENT ON TABLE auctions IS 'Auction listings for artwork and NFTs';
COMMENT ON TABLE bids IS 'Bid history for auctions';
COMMENT ON TABLE auction_watchers IS 'Users watching specific auctions';
COMMENT ON VIEW active_auctions IS 'Active auctions with creator and bid summary';
COMMENT ON VIEW auction_details IS 'Detailed auction view with complete bid history';
COMMENT ON FUNCTION place_bid(UUID, UUID, DECIMAL) IS 'Places a bid on an auction with validation and time extension logic';
COMMENT ON FUNCTION update_auction_statuses() IS 'Updates auction statuses based on current time (should be run periodically)';