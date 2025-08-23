-- House of Wizards DAO - Complete Supabase Schema
-- This file contains the complete database schema for importing into a new Supabase project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===========================================
-- CORE TABLES
-- ===========================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT,
    email TEXT UNIQUE,
    description TEXT,
    twitter TEXT,
    discord TEXT,
    website TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Talents table
CREATE TABLE talents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    twitter TEXT,
    discord TEXT,
    focus TEXT NOT NULL,
    skillset TEXT NOT NULL,
    site TEXT,
    image_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Artists table (referenced in project)
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    bio TEXT,
    twitter TEXT,
    discord TEXT,
    website TEXT,
    avatar_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Gallery items table (referenced in project)
CREATE TABLE gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    tags TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- File descriptions table
CREATE TABLE file_descriptions (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    description TEXT,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, file_name)
);

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

-- Rate limits table
CREATE TABLE rate_limits (
    key TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0,
    reset_time BIGINT,
    window_start BIGINT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES profiles(id),
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB
);

-- ===========================================
-- INDEXES
-- ===========================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
CREATE INDEX idx_profiles_role_created ON profiles(role, created_at);
CREATE INDEX idx_profiles_role_email ON profiles(role, email);
CREATE INDEX idx_profiles_search_name ON profiles USING GIN (to_tsvector('english', name));
CREATE INDEX idx_profiles_search_desc ON profiles USING GIN (to_tsvector('english', description));
CREATE INDEX idx_profiles_deleted_at ON profiles(deleted_at);

-- Talents indexes
CREATE INDEX idx_talents_focus ON talents(focus);
CREATE INDEX idx_talents_user_id ON talents(user_id);
CREATE INDEX idx_talents_name ON talents(name);
CREATE INDEX idx_talents_created_at ON talents(created_at);
CREATE INDEX idx_talents_skills_gin ON talents USING GIN (to_tsvector('english', skillset));
CREATE INDEX idx_talents_active ON talents(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_talents_search_name ON talents USING GIN (to_tsvector('english', name));
CREATE INDEX idx_talents_search_bio ON talents USING GIN (to_tsvector('english', skillset || ' ' || focus));
CREATE INDEX idx_talents_deleted_at ON talents(deleted_at);
CREATE INDEX idx_talents_active_created ON talents(created_at) WHERE deleted_at IS NULL;

-- Artists indexes
CREATE INDEX idx_artists_user_id ON artists(user_id);
CREATE INDEX idx_artists_featured ON artists(featured);
CREATE INDEX idx_artists_created_at ON artists(created_at);
CREATE INDEX idx_artists_deleted_at ON artists(deleted_at);
CREATE INDEX idx_artists_active ON artists(id) WHERE deleted_at IS NULL;

-- Gallery items indexes
CREATE INDEX idx_gallery_items_user_id ON gallery_items(user_id);
CREATE INDEX idx_gallery_items_featured ON gallery_items(featured);
CREATE INDEX idx_gallery_items_created_at ON gallery_items(created_at);
CREATE INDEX idx_gallery_items_deleted_at ON gallery_items(deleted_at);
CREATE INDEX idx_gallery_items_tags ON gallery_items USING GIN (tags);
CREATE INDEX idx_gallery_items_active ON gallery_items(id) WHERE deleted_at IS NULL;

-- File descriptions indexes
CREATE INDEX idx_file_descriptions_user_id ON file_descriptions(user_id);
CREATE INDEX idx_file_descriptions_file_name ON file_descriptions(file_name);
CREATE INDEX idx_file_descriptions_file_type ON file_descriptions(file_type);
CREATE INDEX idx_file_descriptions_user_file ON file_descriptions(user_id, file_name);
CREATE INDEX idx_file_descriptions_deleted_at ON file_descriptions(deleted_at);

-- Auctions indexes
CREATE INDEX idx_auctions_creator_id ON auctions(creator_id);
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auctions_start_time ON auctions(start_time);
CREATE INDEX idx_auctions_end_time ON auctions(end_time);
CREATE INDEX idx_auctions_time_range ON auctions(start_time, end_time) WHERE deleted_at IS NULL;
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

-- Rate limits indexes
CREATE INDEX idx_rate_limits_reset_time ON rate_limits(reset_time);
CREATE INDEX idx_rate_limits_window_start ON rate_limits(window_start);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_operation ON audit_logs(operation);
CREATE INDEX idx_audit_logs_user_table ON audit_logs(user_id, table_name);

-- ===========================================
-- VIEWS
-- ===========================================

-- Active profiles view (excludes soft-deleted)
CREATE VIEW active_profiles AS
SELECT * FROM profiles WHERE deleted_at IS NULL;

-- Active talents view (excludes soft-deleted)
CREATE VIEW active_talents AS
SELECT * FROM talents WHERE deleted_at IS NULL;

-- Active artists view (excludes soft-deleted)
CREATE VIEW active_artists AS
SELECT * FROM artists WHERE deleted_at IS NULL;

-- Active gallery items view (excludes soft-deleted)
CREATE VIEW active_gallery_items AS
SELECT * FROM gallery_items WHERE deleted_at IS NULL;

-- Active file descriptions view (excludes soft-deleted)
CREATE VIEW active_file_descriptions AS
SELECT * FROM file_descriptions WHERE deleted_at IS NULL;

-- Real-time auction status calculation views
-- Active auctions view (only shows auctions that are currently running)
CREATE VIEW active_auctions AS
SELECT 
    a.*,
    'active' as real_time_status,
    p.name as creator_name,
    p.avatar_url as creator_avatar,
    (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as total_bids,
    (SELECT b.bidder_id FROM bids b WHERE b.auction_id = a.id AND b.is_winning = TRUE LIMIT 1) as current_winner_id,
    (SELECT COUNT(*) FROM auction_watchers aw WHERE aw.auction_id = a.id) as watchers_count,
    (a.end_time - NOW()) as time_remaining
FROM auctions a
LEFT JOIN profiles p ON a.creator_id = p.id
WHERE a.deleted_at IS NULL
  AND a.start_time <= NOW()
  AND a.end_time > NOW()
  AND a.status != 'cancelled';

-- Upcoming auctions view (auctions that haven't started yet)
CREATE VIEW upcoming_auctions AS
SELECT 
    a.*,
    'upcoming' as real_time_status,
    p.name as creator_name,
    p.avatar_url as creator_avatar,
    (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as total_bids,
    (SELECT b.bidder_id FROM bids b WHERE b.auction_id = a.id AND b.is_winning = TRUE LIMIT 1) as current_winner_id,
    (SELECT COUNT(*) FROM auction_watchers aw WHERE aw.auction_id = a.id) as watchers_count,
    (a.start_time - NOW()) as time_until_start
FROM auctions a
LEFT JOIN profiles p ON a.creator_id = p.id
WHERE a.deleted_at IS NULL
  AND a.start_time > NOW()
  AND a.status != 'cancelled';

-- Ended auctions view (auctions that have finished)
CREATE VIEW ended_auctions AS
SELECT 
    a.*,
    'ended' as real_time_status,
    p.name as creator_name,
    p.avatar_url as creator_avatar,
    (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as total_bids,
    (SELECT b.bidder_id FROM bids b WHERE b.auction_id = a.id AND b.is_winning = TRUE LIMIT 1) as current_winner_id,
    (SELECT COUNT(*) FROM auction_watchers aw WHERE aw.auction_id = a.id) as watchers_count,
    (NOW() - a.end_time) as time_since_ended
FROM auctions a
LEFT JOIN profiles p ON a.creator_id = p.id
WHERE a.deleted_at IS NULL
  AND a.end_time <= NOW()
  AND a.status != 'cancelled';

-- All auctions view with real-time status calculation
CREATE VIEW all_auctions_with_status AS
SELECT 
    a.*,
    CASE 
        WHEN a.status = 'cancelled' THEN 'cancelled'
        WHEN a.end_time <= NOW() THEN 'ended'
        WHEN a.start_time > NOW() THEN 'upcoming'
        WHEN a.start_time <= NOW() AND a.end_time > NOW() THEN 'active'
        ELSE a.status
    END as real_time_status,
    p.name as creator_name,
    p.avatar_url as creator_avatar,
    (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as total_bids,
    (SELECT b.bidder_id FROM bids b WHERE b.auction_id = a.id AND b.is_winning = TRUE LIMIT 1) as current_winner_id,
    (SELECT COUNT(*) FROM auction_watchers aw WHERE aw.auction_id = a.id) as watchers_count,
    CASE 
        WHEN a.start_time > NOW() THEN a.start_time - NOW()
        WHEN a.end_time > NOW() THEN a.end_time - NOW()
        ELSE NULL
    END as time_remaining_or_until_start
FROM auctions a
LEFT JOIN profiles p ON a.creator_id = p.id
WHERE a.deleted_at IS NULL;

-- Auction details with bid history view (with real-time status)
CREATE VIEW auction_details AS
SELECT 
    a.*,
    CASE 
        WHEN a.status = 'cancelled' THEN 'cancelled'
        WHEN a.end_time <= NOW() THEN 'ended'
        WHEN a.start_time > NOW() THEN 'upcoming'
        WHEN a.start_time <= NOW() AND a.end_time > NOW() THEN 'active'
        ELSE a.status
    END as real_time_status,
    p.name as creator_name,
    p.avatar_url as creator_avatar,
    p.twitter as creator_twitter,
    p.website as creator_website,
    (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as total_bids,
    (SELECT COUNT(*) FROM auction_watchers aw WHERE aw.auction_id = a.id) as watchers_count,
    CASE 
        WHEN a.start_time > NOW() THEN a.start_time - NOW()
        WHEN a.end_time > NOW() THEN a.end_time - NOW()
        ELSE NULL
    END as time_remaining_or_until_start,
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
-- FUNCTIONS
-- ===========================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    audit_row audit_logs%ROWTYPE;
    include_values BOOLEAN = FALSE;
    log_diffs BOOLEAN = FALSE;
    h_old JSONB;
    h_new JSONB;
    excluded_cols TEXT[] = ARRAY['updated_at'];
BEGIN
    IF TG_WHEN <> 'AFTER' THEN
        RAISE EXCEPTION 'audit_trigger_function() may only run as an AFTER trigger';
    END IF;

    audit_row = ROW(
        uuid_generate_v4(),
        TG_TABLE_NAME::TEXT,
        NULL,
        TG_OP,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NULL
    );

    IF TG_OP = 'UPDATE' THEN
        audit_row.record_id = NEW.id;
        SELECT jsonb_object_agg(tmp_old.key, tmp_old.value) INTO h_old FROM jsonb_each(to_jsonb(OLD)) AS tmp_old WHERE tmp_old.key NOT IN (SELECT unnest(excluded_cols));
        SELECT jsonb_object_agg(tmp_new.key, tmp_new.value) INTO h_new FROM jsonb_each(to_jsonb(NEW)) AS tmp_new WHERE tmp_new.key NOT IN (SELECT unnest(excluded_cols));
        audit_row.old_values = h_old;
        audit_row.new_values = h_new;
    ELSIF TG_OP = 'DELETE' THEN
        audit_row.record_id = OLD.id;
        SELECT jsonb_object_agg(tmp_old.key, tmp_old.value) INTO h_old FROM jsonb_each(to_jsonb(OLD)) AS tmp_old WHERE tmp_old.key NOT IN (SELECT unnest(excluded_cols));
        audit_row.old_values = h_old;
    ELSIF TG_OP = 'INSERT' THEN
        audit_row.record_id = NEW.id;
        SELECT jsonb_object_agg(tmp_new.key, tmp_new.value) INTO h_new FROM jsonb_each(to_jsonb(NEW)) AS tmp_new WHERE tmp_new.key NOT IN (SELECT unnest(excluded_cols));
        audit_row.new_values = h_new;
    END IF;

    INSERT INTO audit_logs VALUES (audit_row.*);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Soft delete functions
CREATE OR REPLACE FUNCTION soft_delete_profile(profile_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE profiles SET deleted_at = NOW() WHERE id = profile_id AND deleted_at IS NULL;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION soft_delete_talent(talent_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE talents SET deleted_at = NOW() WHERE id = talent_id AND deleted_at IS NULL;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Restore functions
CREATE OR REPLACE FUNCTION restore_profile(profile_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE profiles SET deleted_at = NULL WHERE id = profile_id AND deleted_at IS NOT NULL;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION restore_talent(talent_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE talents SET deleted_at = NULL WHERE id = talent_id AND deleted_at IS NOT NULL;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Audit trail function
CREATE OR REPLACE FUNCTION get_audit_trail(table_name TEXT, record_id UUID, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
    id UUID,
    operation TEXT,
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.id,
        al.operation,
        al.old_values,
        al.new_values,
        al.user_id,
        al.created_at
    FROM audit_logs al
    WHERE al.table_name = get_audit_trail.table_name
    AND al.record_id = get_audit_trail.record_id
    ORDER BY al.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Cleanup old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Admin functions
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    total_talents BIGINT,
    active_talents BIGINT,
    total_artists BIGINT,
    active_artists BIGINT,
    total_gallery_items BIGINT,
    active_gallery_items BIGINT,
    total_content BIGINT,
    active_content BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM profiles) as total_users,
        (SELECT COUNT(*) FROM active_profiles) as active_users,
        (SELECT COUNT(*) FROM talents) as total_talents,
        (SELECT COUNT(*) FROM active_talents) as active_talents,
        (SELECT COUNT(*) FROM artists) as total_artists,
        (SELECT COUNT(*) FROM active_artists) as active_artists,
        (SELECT COUNT(*) FROM gallery_items) as total_gallery_items,
        (SELECT COUNT(*) FROM active_gallery_items) as active_gallery_items,
        (SELECT COUNT(*) FROM file_descriptions) as total_content,
        (SELECT COUNT(*) FROM active_file_descriptions) as active_content;
END;
$$ LANGUAGE plpgsql;

-- Cascading user deletion function
CREATE OR REPLACE FUNCTION delete_user_with_content(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Soft delete all user's file descriptions
    UPDATE file_descriptions SET deleted_at = NOW() 
    WHERE user_id = delete_user_with_content.user_id AND deleted_at IS NULL;
    
    -- Soft delete all user's talents
    UPDATE talents SET deleted_at = NOW() 
    WHERE user_id = delete_user_with_content.user_id AND deleted_at IS NULL;
    
    -- Soft delete all user's artists entries
    UPDATE artists SET deleted_at = NOW() 
    WHERE user_id = delete_user_with_content.user_id AND deleted_at IS NULL;
    
    -- Soft delete all user's gallery items
    UPDATE gallery_items SET deleted_at = NOW() 
    WHERE user_id = delete_user_with_content.user_id AND deleted_at IS NULL;
    
    -- Soft delete the user profile
    UPDATE profiles SET deleted_at = NOW() 
    WHERE id = delete_user_with_content.user_id AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Batch content deletion function
CREATE OR REPLACE FUNCTION delete_multiple_content(content_items JSONB)
RETURNS BOOLEAN AS $$
DECLARE
    item JSONB;
BEGIN
    -- Loop through each content item and soft delete
    FOR item IN SELECT * FROM jsonb_array_elements(content_items)
    LOOP
        UPDATE file_descriptions SET deleted_at = NOW()
        WHERE user_id = (item->>'userId')::UUID 
        AND file_name = item->>'fileName'
        AND deleted_at IS NULL;
    END LOOP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

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
    
    GET DIAGNOSTICS updated_count = updated_count + ROW_COUNT;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Updated at triggers
CREATE TRIGGER update_talents_updated_at
    BEFORE UPDATE ON talents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artists_updated_at
    BEFORE UPDATE ON artists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at
    BEFORE UPDATE ON gallery_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auction updated_at trigger
CREATE TRIGGER update_auctions_updated_at
    BEFORE UPDATE ON auctions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Audit triggers
CREATE TRIGGER audit_trigger_profiles
    AFTER INSERT OR UPDATE OR DELETE ON profiles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_trigger_talents
    AFTER INSERT OR UPDATE OR DELETE ON talents
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_trigger_artists
    AFTER INSERT OR UPDATE OR DELETE ON artists
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_trigger_gallery_items
    AFTER INSERT OR UPDATE OR DELETE ON gallery_items
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" 
ON profiles FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Talents policies
CREATE POLICY "Talents are viewable by everyone" 
ON talents FOR SELECT 
USING (deleted_at IS NULL);

CREATE POLICY "Users can insert their own talent entry" 
ON talents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own talent entry" 
ON talents FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own talent entry" 
ON talents FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all talents" 
ON talents FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Artists policies
CREATE POLICY "Artists are viewable by everyone" 
ON artists FOR SELECT 
USING (deleted_at IS NULL);

CREATE POLICY "Users can insert their own artist entry" 
ON artists FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own artist entry" 
ON artists FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all artists" 
ON artists FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Gallery items policies
CREATE POLICY "Gallery items are viewable by everyone" 
ON gallery_items FOR SELECT 
USING (deleted_at IS NULL);

CREATE POLICY "Users can insert their own gallery items" 
ON gallery_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gallery items" 
ON gallery_items FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all gallery items" 
ON gallery_items FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- File descriptions policies
CREATE POLICY "File descriptions are viewable by owner" 
ON file_descriptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own file descriptions" 
ON file_descriptions FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all file descriptions" 
ON file_descriptions FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can manage all file descriptions" 
ON file_descriptions FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

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

-- Audit logs policies (admin only)
CREATE POLICY "Only admins can view audit logs" 
ON audit_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ===========================================
-- STORAGE BUCKETS AND POLICIES
-- ===========================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('talent-avatars', 'talent-avatars', true),
('gallery', 'gallery', true),
('files', 'files', true);

-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for talent-avatars bucket
CREATE POLICY "Anyone can view talent avatars" ON storage.objects FOR SELECT USING (bucket_id = 'talent-avatars');
CREATE POLICY "Authenticated users can upload talent avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'talent-avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own talent avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'talent-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own talent avatars" ON storage.objects FOR DELETE USING (bucket_id = 'talent-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for gallery bucket
CREATE POLICY "Anyone can view gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own gallery images" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own gallery images" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for files bucket (artwork uploads)
CREATE POLICY "Anyone can view files" ON storage.objects FOR SELECT USING (bucket_id = 'files');
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own files" ON storage.objects FOR UPDATE USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ===========================================
-- INITIAL DATA
-- ===========================================

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clean up function for rate limits
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM rate_limits WHERE reset_time < EXTRACT(EPOCH FROM NOW()) * 1000;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profiles extending auth.users with additional metadata';
COMMENT ON TABLE talents IS 'Community talent registry with skills and focus areas';
COMMENT ON TABLE artists IS 'Artist profiles and portfolios';
COMMENT ON TABLE gallery_items IS 'Gallery items and artwork submissions';
COMMENT ON TABLE file_descriptions IS 'Metadata for uploaded files';
COMMENT ON TABLE rate_limits IS 'Rate limiting storage for API endpoints';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all table operations';

COMMENT ON VIEW active_profiles IS 'Profiles excluding soft-deleted records';
COMMENT ON VIEW active_talents IS 'Talents excluding soft-deleted records';
COMMENT ON VIEW active_artists IS 'Artists excluding soft-deleted records';
COMMENT ON VIEW active_gallery_items IS 'Gallery items excluding soft-deleted records';
COMMENT ON VIEW active_file_descriptions IS 'File descriptions excluding soft-deleted records';

-- Function permissions
GRANT EXECUTE ON FUNCTION delete_user_with_content(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_multiple_content(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION place_bid(UUID, UUID, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION update_auction_statuses() TO authenticated;

-- Additional comments for new functions
COMMENT ON FUNCTION delete_user_with_content(UUID) IS 'Soft deletes a user and all their associated content (cascading deletion)';
COMMENT ON FUNCTION delete_multiple_content(JSONB) IS 'Batch soft deletion of multiple content items';
COMMENT ON FUNCTION get_admin_dashboard_stats() IS 'Returns comprehensive dashboard statistics for admin panel';
COMMENT ON FUNCTION place_bid(UUID, UUID, DECIMAL) IS 'Places a bid on an auction with validation and time extension logic';
COMMENT ON FUNCTION update_auction_statuses() IS 'Updates auction statuses based on current time (should be run periodically)';

-- Auction table comments
COMMENT ON TABLE auctions IS 'Auction listings for artwork and NFTs';
COMMENT ON TABLE bids IS 'Bid history for auctions';
COMMENT ON TABLE auction_watchers IS 'Users watching specific auctions';
COMMENT ON VIEW active_auctions IS 'Currently active auctions with real-time status filtering (start_time <= NOW() AND end_time > NOW())';
COMMENT ON VIEW upcoming_auctions IS 'Upcoming auctions that have not started yet (start_time > NOW())';
COMMENT ON VIEW ended_auctions IS 'Ended auctions that have finished (end_time <= NOW())';
COMMENT ON VIEW all_auctions_with_status IS 'All auctions with real-time status calculation based on current time';
COMMENT ON VIEW auction_details IS 'Detailed auction view with complete bid history';