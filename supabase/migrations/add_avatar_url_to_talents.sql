-- Add avatar_url column to talents table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'talents' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.talents ADD COLUMN avatar_url TEXT;
    END IF;
END $$;