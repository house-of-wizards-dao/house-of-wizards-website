-- ============================================================================
-- ADMIN HARD DELETE USER FUNCTION
-- ============================================================================
-- WARNING: This permanently deletes user data. Use with extreme caution!
-- This is different from soft delete - data will be completely removed.
-- ============================================================================

-- Create function for permanent user deletion
CREATE OR REPLACE FUNCTION admin_hard_delete_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if current user is admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator') 
        AND deleted_at IS NULL
    ) THEN
        RAISE EXCEPTION 'Only admins can permanently delete users';
    END IF;
    
    -- Step 1: Delete related storage files first
    DELETE FROM storage.objects 
    WHERE bucket_id = 'files' 
    AND (storage.foldername(name))[1] = user_id::text;
    
    -- Step 2: Delete file descriptions
    DELETE FROM file_descriptions WHERE user_id = user_id;
    
    -- Step 3: Delete talents
    DELETE FROM talents WHERE user_id = user_id;
    
    -- Step 4: Delete user sessions
    DELETE FROM user_sessions WHERE user_id = user_id;
    
    -- Step 5: Delete proposal votes
    DELETE FROM proposal_votes WHERE user_id = user_id;
    
    -- Step 6: Update proposals to remove creator reference (or delete if you prefer)
    UPDATE proposals SET creator_id = NULL WHERE creator_id = user_id;
    -- Alternative: DELETE FROM proposals WHERE creator_id = user_id;
    
    -- Step 7: Finally delete the user profile
    DELETE FROM profiles WHERE id = user_id;
    
    RAISE NOTICE 'User % has been permanently deleted along with all related data', user_id;
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error permanently deleting user: %', SQLERRM;
        RETURN FALSE;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION admin_hard_delete_user TO authenticated;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

-- To permanently delete a user:
-- SELECT admin_hard_delete_user('user-uuid-here');

-- To list users that can be deleted:
-- SELECT id, name, email, deleted_at 
-- FROM profiles 
-- WHERE deleted_at IS NOT NULL;

-- ============================================================================
-- COMPARISON: Soft Delete vs Hard Delete
-- ============================================================================

-- Soft Delete (current system):
-- UPDATE profiles SET deleted_at = NOW() WHERE id = 'user-id';
-- Result: User hidden but data preserved

-- Hard Delete (this function):
-- SELECT admin_hard_delete_user('user-id');
-- Result: User and ALL related data permanently removed

DO $$
BEGIN
    RAISE NOTICE '⚠️  HARD DELETE FUNCTION CREATED';
    RAISE NOTICE '⚠️  This will PERMANENTLY remove all user data';
    RAISE NOTICE '⚠️  Use: SELECT admin_hard_delete_user(''user-uuid'');';
    RAISE NOTICE '💡 For safety, consider soft delete instead';
END $$;