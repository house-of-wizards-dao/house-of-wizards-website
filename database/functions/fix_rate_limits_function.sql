-- Emergency fix for missing rate limits function
-- This function is required by the rate limiter to work properly

CREATE OR REPLACE FUNCTION create_rate_limits_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  -- Check if rate_limits table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'rate_limits'
  ) THEN
    -- Create rate_limits table if it doesn't exist
    CREATE TABLE public.rate_limits (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) NOT NULL UNIQUE,
      count INTEGER DEFAULT 1,
      reset_time BIGINT NOT NULL,
      window_start BIGINT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    
    -- Create index for performance
    CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON public.rate_limits(key);
    CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON public.rate_limits(reset_time);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Also create a function to clean up expired rate limits
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE reset_time < EXTRACT(EPOCH FROM NOW()) * 1000;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_rate_limits_table_if_not_exists() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_rate_limits() TO authenticated;