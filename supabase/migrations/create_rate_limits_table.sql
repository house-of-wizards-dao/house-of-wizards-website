-- Create rate_limits table for rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  reset_time BIGINT NOT NULL,
  window_start BIGINT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient cleanup of expired entries
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON rate_limits(reset_time);

-- Create function to handle table creation from application
CREATE OR REPLACE FUNCTION create_rate_limits_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- This function is called from the application to ensure table exists
  -- The table creation is already handled above
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;