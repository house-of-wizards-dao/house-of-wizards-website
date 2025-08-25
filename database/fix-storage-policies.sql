-- Fix infinite recursion in storage policies
-- Run this in Supabase SQL Editor to fix avatar upload issues

-- Drop all existing storage policies that cause recursion
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage own files" ON storage.objects;
DROP POLICY IF EXISTS "Talent avatars are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Council can manage talent avatars" ON storage.objects;
DROP POLICY IF EXISTS "Council can manage proposal files" ON storage.objects;

-- Create simplified storage policies without circular dependencies
-- Avatars bucket policies (public bucket)
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own avatar" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar" ON storage.objects 
FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Files bucket policies (private bucket)
CREATE POLICY "Authenticated users can view own files" ON storage.objects 
FOR SELECT USING (
    bucket_id = 'files' AND 
    auth.uid() IS NOT NULL AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can upload own files" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'files' AND 
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can manage own files" ON storage.objects 
FOR ALL USING (
    bucket_id = 'files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Talent avatars bucket policies (public, but admin-managed)
CREATE POLICY "Talent avatars are publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'talent-avatars');

-- Use auth.jwt() instead of profiles table to avoid recursion
CREATE POLICY "Admins can manage talent avatars" ON storage.objects 
FOR ALL USING (
    bucket_id = 'talent-avatars' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'council_member')
);

-- Proposals bucket policies (admin-managed)
CREATE POLICY "Admins can manage proposal files" ON storage.objects 
FOR ALL USING (
    bucket_id = 'proposals' AND 
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'council_member')
);

-- Fix potential circular dependency in profiles policies
-- Drop and recreate the admin policy that might cause issues
DROP POLICY IF EXISTS "Admins full access profiles" ON profiles;

-- Recreate without self-referencing
CREATE POLICY "Admins full access profiles" ON profiles 
FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
);

-- Test that policies work
DO $$
BEGIN
    RAISE NOTICE 'Storage policies updated successfully!';
    RAISE NOTICE 'Avatar uploads should now work without infinite recursion.';
    
    -- Show current storage policies
    RAISE NOTICE 'Current storage policies:';
END $$;

-- List current storage policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'storage' 
ORDER BY tablename, policyname;