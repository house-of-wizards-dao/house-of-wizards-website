-- Add buffer tracking fields to auctions table
-- Migration: Add auction buffer and blockchain time fields
-- Date: 2025-01-22

-- Add new columns to the auctions table
ALTER TABLE auctions 
ADD COLUMN IF NOT EXISTS user_expected_end_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS safety_buffer_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_with_blockchain_time BOOLEAN DEFAULT FALSE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_auctions_user_expected_end_time ON auctions(user_expected_end_time);

-- Add comments for clarity
COMMENT ON COLUMN auctions.user_expected_end_time IS 'The end time that users see (without safety buffer)';
COMMENT ON COLUMN auctions.safety_buffer_seconds IS 'Safety buffer added in seconds to prevent timing issues';
COMMENT ON COLUMN auctions.created_with_blockchain_time IS 'Whether the auction was created using accurate blockchain time';

-- Update existing auctions to backfill the new fields where possible
-- For existing auctions, assume user expected time is the same as end time (no buffer was applied)
UPDATE auctions 
SET user_expected_end_time = end_time,
    safety_buffer_seconds = 0,
    created_with_blockchain_time = false
WHERE user_expected_end_time IS NULL;

-- Create a function to help with auction timing queries
CREATE OR REPLACE FUNCTION get_auction_display_time(
    user_expected_end_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    current_time TIMESTAMPTZ DEFAULT NOW()
) RETURNS TEXT AS $$
DECLARE
    time_remaining INTERVAL;
    display_time TEXT;
BEGIN
    -- Use user expected time for display
    time_remaining := user_expected_end_time - current_time;
    
    IF time_remaining <= INTERVAL '0' THEN
        RETURN 'Auction Ended';
    END IF;
    
    -- Format the time remaining
    IF time_remaining >= INTERVAL '1 day' THEN
        display_time := EXTRACT(days FROM time_remaining) || 'd ' || 
                       EXTRACT(hours FROM time_remaining) || 'h ' ||
                       EXTRACT(minutes FROM time_remaining) || 'm';
    ELSIF time_remaining >= INTERVAL '1 hour' THEN
        display_time := EXTRACT(hours FROM time_remaining) || 'h ' ||
                       EXTRACT(minutes FROM time_remaining) || 'm ' ||
                       EXTRACT(seconds FROM time_remaining) || 's';
    ELSE
        display_time := EXTRACT(minutes FROM time_remaining) || 'm ' ||
                       EXTRACT(seconds FROM time_remaining) || 's';
    END IF;
    
    RETURN display_time;
END;
$$ LANGUAGE plpgsql IMMUTABLE;