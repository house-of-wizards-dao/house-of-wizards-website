-- Quick fix for auctions stuck in "upcoming" status
-- Run this in Supabase SQL Editor to immediately fix the issue

-- Update all auctions that should be active right now
UPDATE auctions 
SET status = 'active', updated_at = NOW()
WHERE status = 'upcoming' 
  AND (start_time IS NULL OR start_time <= NOW())
  AND end_time > NOW()
  AND deleted_at IS NULL;

-- Check the results
SELECT 
    title,
    status,
    start_time,
    end_time,
    created_at
FROM auctions
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Message
DO $$
DECLARE
    updated_rows INTEGER;
BEGIN
    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RAISE NOTICE 'Fixed % auction(s) that were stuck in upcoming status!', updated_rows;
END $$;