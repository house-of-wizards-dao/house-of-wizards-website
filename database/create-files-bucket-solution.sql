-- ============================================================================
-- FIX: Create Missing "files" Storage Bucket and Configure Policies
-- ============================================================================
-- This script fixes the 404 error for uploaded images by creating the missing
-- "files" storage bucket and setting up proper RLS policies.
--
-- Problem: Images return 404 because the "files" bucket doesn't exist
-- Solution: Create bucket with proper public/private access configuration
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: Create the "files" Storage Bucket
-- ============================================================================
-- Note: This needs to be run in Supabase Dashboard under Storage section
-- or via Supabase Management API as it's not available through SQL directly

-- If running via Supabase Dashboard, go to Storage and create a new bucket with:
-- Name: files
-- Public: true (allows public URL access for display)
-- File size limit: 50MB
-- Allowed MIME types: image/*, video/*, application/pdf

-- For SQL approach (if your Supabase version supports it):
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'files',
    'files', 
    true,  -- Public bucket for URL access
    52428800,  -- 50MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 
          'video/mp4', 'video/webm', 'video/quicktime',
          'audio/mpeg', 'audio/wav', 'audio/webm',
          'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- STEP 2: Configure Storage Policies for "files" Bucket
-- ============================================================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Admin full access to files" ON storage.objects;

-- Policy 1: Public Read Access
-- Anyone can view files (required for public URLs to work)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'files');

-- Policy 2: Authenticated Upload to User's Folder
-- Users can only upload to their own folder: {user_id}/
CREATE POLICY "Authenticated users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Users Can Update Their Own Files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Users Can Delete Their Own Files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 5: Admin/Council Full Access (optional, for moderation)
CREATE POLICY "Admin full access to files"
ON storage.objects
TO authenticated
USING (
    bucket_id = 'files'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'council_member', 'moderator')
    )
)
WITH CHECK (
    bucket_id = 'files'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'council_member', 'moderator')
    )
);

-- ============================================================================
-- STEP 3: Ensure file_descriptions Table Has Proper Policies
-- ============================================================================

-- Enable RLS on file_descriptions if not already enabled
ALTER TABLE file_descriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own file descriptions" ON file_descriptions;
DROP POLICY IF EXISTS "Users can insert own file descriptions" ON file_descriptions;
DROP POLICY IF EXISTS "Users can update own file descriptions" ON file_descriptions;
DROP POLICY IF EXISTS "Users can delete own file descriptions" ON file_descriptions;
DROP POLICY IF EXISTS "Public can view non-deleted file descriptions" ON file_descriptions;

-- Users can view their own file descriptions
CREATE POLICY "Users can view own file descriptions"
ON file_descriptions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Public can view non-deleted file descriptions (for gallery)
CREATE POLICY "Public can view non-deleted file descriptions"
ON file_descriptions FOR SELECT
TO anon
USING (deleted_at IS NULL);

-- Users can insert their own file descriptions
CREATE POLICY "Users can insert own file descriptions"
ON file_descriptions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own file descriptions
CREATE POLICY "Users can update own file descriptions"
ON file_descriptions FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own file descriptions
CREATE POLICY "Users can delete own file descriptions"
ON file_descriptions FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ============================================================================
-- STEP 4: Verify Configuration
-- ============================================================================

-- Check if bucket exists and is public
SELECT 
    id as bucket_id,
    name as bucket_name,
    public as is_public,
    file_size_limit,
    array_length(allowed_mime_types, 1) as mime_types_count
FROM storage.buckets
WHERE id = 'files';

-- Check storage policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual IS NOT NULL as has_using_clause,
    with_check IS NOT NULL as has_check_clause
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;

-- Check file_descriptions policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'file_descriptions'
ORDER BY policyname;

-- ============================================================================
-- STEP 5: Success Message
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Storage bucket "files" has been configured successfully!';
    RAISE NOTICE '✅ Storage policies have been applied.';
    RAISE NOTICE '✅ File descriptions table policies are in place.';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Next Steps:';
    RAISE NOTICE '1. If you still see 404 errors, check that files were uploaded to the correct bucket';
    RAISE NOTICE '2. Verify your Supabase project URL matches: https://gptihsbiexsdxpkxkkwy.supabase.co';
    RAISE NOTICE '3. Test by uploading a new image and checking if it displays correctly';
END $$;

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================
-- If images still don't display after running this script:
--
-- 1. Check if files exist in storage:
--    SELECT * FROM storage.objects WHERE bucket_id = 'files' LIMIT 10;
--
-- 2. Verify user folders:
--    SELECT DISTINCT (storage.foldername(name))[1] as user_folder 
--    FROM storage.objects 
--    WHERE bucket_id = 'files';
--
-- 3. Test a specific file URL in browser:
--    https://gptihsbiexsdxpkxkkwy.supabase.co/storage/v1/object/public/files/{user_id}/{filename}
--
-- 4. Check Supabase Dashboard > Storage > files bucket exists and is PUBLIC
--
-- 5. If bucket creation fails via SQL, create it manually in Supabase Dashboard:
--    - Go to Storage section
--    - Click "New Bucket"
--    - Name: files
--    - Public: Yes
--    - Save
-- ============================================================================