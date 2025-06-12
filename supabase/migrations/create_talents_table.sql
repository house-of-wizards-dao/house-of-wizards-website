-- Create talents table
CREATE TABLE IF NOT EXISTS public.talents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    twitter TEXT,
    discord TEXT,
    focus TEXT NOT NULL,
    skillset TEXT NOT NULL,
    site TEXT,
    image_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Talents are viewable by everyone" ON public.talents;
DROP POLICY IF EXISTS "Users can insert their own talent entry" ON public.talents;
DROP POLICY IF EXISTS "Users can update their own talent entry" ON public.talents;
DROP POLICY IF EXISTS "Users can delete their own talent entry" ON public.talents;

-- Create policy to allow anyone to view talents
CREATE POLICY "Talents are viewable by everyone" ON public.talents
    FOR SELECT USING (true);

-- Create policy to allow users to insert their own talent entry
CREATE POLICY "Users can insert their own talent entry" ON public.talents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own talent entry
CREATE POLICY "Users can update their own talent entry" ON public.talents
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own talent entry
CREATE POLICY "Users can delete their own talent entry" ON public.talents
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_talents_focus ON public.talents(focus);
CREATE INDEX IF NOT EXISTS idx_talents_user_id ON public.talents(user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_talents_updated_at ON public.talents;

-- Create trigger
CREATE TRIGGER update_talents_updated_at BEFORE UPDATE ON public.talents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();