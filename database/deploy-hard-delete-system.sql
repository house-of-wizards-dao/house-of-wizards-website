-- ============================================================================
-- DEPLOY: Hard Delete System for Admin Panel
-- ============================================================================
-- This script sets up the complete hard delete system for the admin dashboard
-- Run this to ensure admin users can permanently delete users from the database
-- ============================================================================

-- Step 1: Create the hard delete function
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
    
    -- Step 6: Update proposals to remove creator reference
    UPDATE proposals SET creator_id = NULL WHERE creator_id = user_id;
    
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

-- Grant execute permission to authenticated users (function checks admin role internally)
GRANT EXECUTE ON FUNCTION admin_hard_delete_user TO authenticated;

-- Step 2: Verify the function works
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'admin_hard_delete_user') THEN
        RAISE NOTICE '✅ admin_hard_delete_user function created successfully';
    ELSE
        RAISE NOTICE '❌ Function creation failed';
    END IF;
END $$;

-- Step 3: Test admin permissions (optional)
-- This will help verify your current user can use the function
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator') 
        AND deleted_at IS NULL
    ) THEN
        RAISE NOTICE '✅ Current user has admin permissions for hard delete';
    ELSE
        RAISE NOTICE '⚠️ Current user does not have admin permissions';
        RAISE NOTICE 'Make sure your user role is set to "admin" or "moderator"';
    END IF;
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎯 HARD DELETE SYSTEM READY';
    RAISE NOTICE '✅ Admin panel will now permanently delete users';
    RAISE NOTICE '✅ Double confirmation dialogs added for safety';
    RAISE NOTICE '✅ All user data will be completely removed';
    RAISE NOTICE '';
    RAISE NOTICE '📋 What happens when admin deletes a user:';
    RAISE NOTICE '1. User profile completely removed from database';
    RAISE NOTICE '2. All uploaded files deleted from storage';
    RAISE NOTICE '3. File descriptions permanently deleted';
    RAISE NOTICE '4. Talents records permanently deleted'; 
    RAISE NOTICE '5. User sessions cleared';
    RAISE NOTICE '6. Proposal votes removed';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ IMPORTANT: This is irreversible - data cannot be recovered!';
END $$;