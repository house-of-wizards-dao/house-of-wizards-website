-- Migration: Fix auction views with real-time status calculation
-- This migration updates the auction views to use time-based filtering for real-time status
-- Date: 2025-01-23
-- Purpose: Fix issue where "active_auctions" view shows ended auctions as active

BEGIN;

-- Drop existing views that will be recreated
DROP VIEW IF EXISTS auction_details;
DROP VIEW IF EXISTS active_auctions;

-- Create new real-time auction status views
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

-- Recreate auction_details view with real-time status
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

-- Add comments for documentation
COMMENT ON VIEW active_auctions IS 'Currently active auctions with real-time status filtering (start_time <= NOW() AND end_time > NOW())';
COMMENT ON VIEW upcoming_auctions IS 'Upcoming auctions that have not started yet (start_time > NOW())';
COMMENT ON VIEW ended_auctions IS 'Ended auctions that have finished (end_time <= NOW())';
COMMENT ON VIEW all_auctions_with_status IS 'All auctions with real-time status calculation based on current time';
COMMENT ON VIEW auction_details IS 'Detailed auction view with complete bid history and real-time status';

-- Verify that the necessary indexes exist for optimal performance
-- These should already exist from the main schema, but we verify they are present
DO $$
BEGIN
    -- Check if auction time-based indexes exist
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_auctions_end_time') THEN
        RAISE NOTICE 'Creating missing index: idx_auctions_end_time';
        CREATE INDEX idx_auctions_end_time ON auctions(end_time);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_auctions_start_time') THEN
        RAISE NOTICE 'Creating missing index: idx_auctions_start_time';  
        CREATE INDEX idx_auctions_start_time ON auctions(start_time);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_auctions_active_status') THEN
        RAISE NOTICE 'Creating missing index: idx_auctions_active_status';
        CREATE INDEX idx_auctions_active_status ON auctions(status, end_time) WHERE deleted_at IS NULL;
    END IF;
END $$;

-- Test the new views with a sample query to ensure they work
DO $$
DECLARE
    active_count INTEGER;
    upcoming_count INTEGER;
    ended_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO active_count FROM active_auctions;
    SELECT COUNT(*) INTO upcoming_count FROM upcoming_auctions;
    SELECT COUNT(*) INTO ended_count FROM ended_auctions;
    SELECT COUNT(*) INTO total_count FROM all_auctions_with_status;
    
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Active auctions: %', active_count;
    RAISE NOTICE 'Upcoming auctions: %', upcoming_count;
    RAISE NOTICE 'Ended auctions: %', ended_count;
    RAISE NOTICE 'Total auctions: %', total_count;
    
    -- Verify that active + upcoming + ended = total (excluding cancelled)
    IF active_count + upcoming_count + ended_count != total_count THEN
        RAISE WARNING 'View counts do not match! This may indicate an issue with the real-time status logic.';
    END IF;
END $$;

COMMIT;

-- Success message
SELECT 'Auction views have been successfully updated with real-time status calculation!' as migration_result;