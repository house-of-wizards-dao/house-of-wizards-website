-- ============================================================================
-- DEBUG: Admin Delete Issues
-- ============================================================================
-- This script helps debug why the admin delete function might be failing
-- ============================================================================

-- Step 1: Check if the function exists
SELECT 
    proname as function_name,
    proowner,
    prosecdef as is_security_definer,
    proacl as permissions
FROM pg_proc 
WHERE proname = 'admin_hard_delete_user';

-- Step 2: Check your current user's admin status
SELECT 
    id,
    email,
    role,
    deleted_at,
    'Current user info' as note
FROM profiles 
WHERE id = auth.uid();

-- Step 3: Test admin check logic
SELECT 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator') 
        AND deleted_at IS NULL
    ) as is_admin;

-- Step 4: List all users that can be deleted
SELECT 
    id,
    name,
    email,
    role,
    deleted_at,
    'Available for deletion' as note
FROM profiles 
WHERE deleted_at IS NULL
AND id != auth.uid()  -- Don't delete yourself
ORDER BY created_at DESC;

-- Step 5: Create a simple test function to verify permissions
CREATE OR REPLACE FUNCTION test_admin_delete_permissions()
RETURNS TEXT
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
        RETURN 'ERROR: User is not admin or moderator';
    END IF;
    
    RETURN 'SUCCESS: User has admin permissions';
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'ERROR: ' || SQLERRM;
END;
$$;

-- Grant permission to test function
GRANT EXECUTE ON FUNCTION test_admin_delete_permissions TO authenticated;

-- Step 6: Test the permission function
SELECT test_admin_delete_permissions() as permission_test;

-- Step 7: Create a safer version of the delete function with better error handling
CREATE OR REPLACE FUNCTION admin_hard_delete_user_v2(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    current_user_role TEXT;
BEGIN
    -- Get current user's role for debugging
    SELECT role INTO current_user_role 
    FROM profiles 
    WHERE id = auth.uid() 
    AND deleted_at IS NULL;
    
    -- Check if current user exists and is admin
    IF current_user_role IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Current user not found or is deleted',
            'user_id', auth.uid()
        );
    END IF;
    
    IF current_user_role NOT IN ('admin', 'moderator') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Only admins and moderators can delete users',
            'current_role', current_user_role,
            'required_roles', ARRAY['admin', 'moderator']
        );
    END IF;
    
    -- Check if target user exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Target user not found',
            'target_user_id', user_id
        );
    END IF;
    
    -- Perform the deletion
    BEGIN
        -- Delete storage files
        DELETE FROM storage.objects 
        WHERE bucket_id = 'files' 
        AND (storage.foldername(name))[1] = user_id::text;
        
        -- Delete file descriptions
        DELETE FROM file_descriptions WHERE user_id = user_id;
        
        -- Delete talents
        DELETE FROM talents WHERE user_id = user_id;
        
        -- Delete user sessions
        DELETE FROM user_sessions WHERE user_id = user_id;
        
        -- Delete proposal votes
        DELETE FROM proposal_votes WHERE user_id = user_id;
        
        -- Update proposals
        UPDATE proposals SET creator_id = NULL WHERE creator_id = user_id;
        
        -- Finally delete the user profile
        DELETE FROM profiles WHERE id = user_id;
        
        RETURN jsonb_build_object(
            'success', true,
            'message', 'User deleted successfully',
            'deleted_user_id', user_id,
            'deleted_by', auth.uid()
        );
        
    EXCEPTION
        WHEN OTHERS THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Database error during deletion: ' || SQLERRM,
                'sqlstate', SQLSTATE
            );
    END;
END;
$$;

-- Grant permission to the new function
GRANT EXECUTE ON FUNCTION admin_hard_delete_user_v2 TO authenticated;

-- Final message
DO $$
BEGIN
    RAISE NOTICE '🔍 DEBUG FUNCTIONS CREATED';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Run these tests:';
    RAISE NOTICE '1. SELECT test_admin_delete_permissions();';
    RAISE NOTICE '2. SELECT admin_hard_delete_user_v2(''user-uuid-here'');';
    RAISE NOTICE '';
    RAISE NOTICE '💡 The v2 function returns detailed JSON with error info';
END $$;