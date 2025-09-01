-- ============================================================================
-- FIX: Create talent-avatars storage bucket and configure policies
-- ============================================================================
-- This ensures the talent-avatars bucket exists and has proper permissions
-- ============================================================================

-- Step 1: Create the talent-avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'talent-avatars',
    'talent-avatars', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[];

-- Step 2: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Talent avatars are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own talent avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own talent avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own talent avatars" ON storage.objects;

-- Step 3: Create comprehensive RLS policies for talent-avatars bucket
CREATE POLICY "Talent avatars are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'talent-avatars');

CREATE POLICY "Users can upload their own talent avatars" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'talent-avatars' AND 
    (name LIKE auth.uid()::text || '-%' OR auth.jwt() ->> 'role' IN ('admin', 'council_member'))
);

CREATE POLICY "Users can update their own talent avatars" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'talent-avatars' AND 
    (name LIKE auth.uid()::text || '-%' OR auth.jwt() ->> 'role' IN ('admin', 'council_member'))
);

CREATE POLICY "Users can delete their own talent avatars" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'talent-avatars' AND 
    (name LIKE auth.uid()::text || '-%' OR auth.jwt() ->> 'role' IN ('admin', 'council_member'))
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ TALENT AVATARS BUCKET CONFIGURED';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Bucket created with 5MB file size limit';
    RAISE NOTICE '✅ Public read access enabled';
    RAISE NOTICE '✅ User upload/update/delete policies configured';
    RAISE NOTICE '✅ Supports: JPEG, PNG, WebP, GIF formats';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Talent avatar uploads should now work correctly';
END $$;