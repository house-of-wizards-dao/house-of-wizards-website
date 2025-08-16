-- Fix for auction status management
-- Run this in Supabase SQL Editor to fix auction status issues

-- Update any auctions that should be active but are showing as upcoming
UPDATE auctions 
SET status = 'active', updated_at = NOW()
WHERE status = 'upcoming' 
  AND start_time <= NOW() 
  AND end_time > NOW()
  AND deleted_at IS NULL;

-- Update any auctions that should be ended but are showing as active
UPDATE auctions 
SET status = 'ended', updated_at = NOW()
WHERE status = 'active' 
  AND end_time <= NOW()
  AND deleted_at IS NULL;

-- Create a function to automatically update auction statuses
-- This can be called periodically or triggered
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

-- Create a scheduled job to update auction statuses every minute
-- Note: This requires pg_cron extension which may need to be enabled in Supabase
-- Alternatively, you can call update_auction_statuses() from your application periodically

-- For immediate fix, run this to update all current auction statuses:
SELECT update_auction_statuses();

-- Show current auction statuses after fix
SELECT 
    title,
    status,
    start_time,
    end_time,
    CASE 
        WHEN end_time < NOW() THEN 'Should be: ended'
        WHEN start_time > NOW() THEN 'Should be: upcoming'
        ELSE 'Should be: active'
    END as expected_status
FROM auctions
WHERE deleted_at IS NULL
ORDER BY created_at DESC;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Auction statuses have been fixed! Auctions starting immediately will now show as Active.';
END $$;