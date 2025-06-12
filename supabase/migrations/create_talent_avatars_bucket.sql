-- Create storage bucket for talent avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'talent-avatars', 
    'talent-avatars', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) 
DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Anyone can view talent avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Set up storage policies for talent avatars
CREATE POLICY "Anyone can view talent avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'talent-avatars');

CREATE POLICY "Authenticated users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'talent-avatars' AND 
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'talent-avatars' AND 
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'talent-avatars' AND 
        auth.uid() IS NOT NULL
    );