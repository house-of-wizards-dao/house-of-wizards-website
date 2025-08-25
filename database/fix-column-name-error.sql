-- ============================================================================
-- QUICK FIX: Column Name Error in Delete Function
-- ============================================================================
-- Fix the proposals table column reference from creator_id to created_by
-- ============================================================================

CREATE OR REPLACE FUNCTION admin_hard_delete_user_fixed(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    current_user_role user_role;
    current_user_id UUID;
    files_deleted INTEGER;
    descriptions_deleted INTEGER;
    talents_deleted INTEGER;
    sessions_deleted INTEGER;
    votes_deleted INTEGER;
    proposals_updated INTEGER;
BEGIN
    -- Get current user info
    current_user_id := auth.uid();
    
    SELECT p.role INTO current_user_role 
    FROM profiles p 
    WHERE p.id = current_user_id 
    AND p.deleted_at IS NULL;
    
    -- Check if current user exists and is admin
    IF current_user_role IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Current user not found or is deleted',
            'user_id', current_user_id
        );
    END IF;
    
    -- More permissive admin check
    IF current_user_role::text NOT IN ('admin', 'moderator', 'council_member') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Insufficient permissions to delete users',
            'current_role', current_user_role::text,
            'current_user_id', current_user_id,
            'required_roles', ARRAY['admin', 'moderator', 'council_member']
        );
    END IF;
    
    -- Check if target user exists
    IF NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = target_user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Target user not found',
            'target_user_id', target_user_id
        );
    END IF;
    
    -- Perform the deletion with correct column names
    BEGIN
        -- Delete storage files
        DELETE FROM storage.objects so
        WHERE so.bucket_id = 'files' 
        AND (storage.foldername(so.name))[1] = target_user_id::text;
        
        GET DIAGNOSTICS files_deleted = ROW_COUNT;
        
        -- Delete file descriptions
        DELETE FROM file_descriptions fd
        WHERE fd.user_id = target_user_id;
        
        GET DIAGNOSTICS descriptions_deleted = ROW_COUNT;
        
        -- Delete talents
        DELETE FROM talents t
        WHERE t.user_id = target_user_id;
        
        GET DIAGNOSTICS talents_deleted = ROW_COUNT;
        
        -- Delete user sessions
        DELETE FROM user_sessions us
        WHERE us.user_id = target_user_id;
        
        GET DIAGNOSTICS sessions_deleted = ROW_COUNT;
        
        -- Delete proposal votes
        DELETE FROM proposal_votes pv
        WHERE pv.user_id = target_user_id;
        
        GET DIAGNOSTICS votes_deleted = ROW_COUNT;
        
        -- Update proposals - FIXED: Use created_by instead of creator_id
        UPDATE proposals pr
        SET created_by = NULL 
        WHERE pr.created_by = target_user_id;
        
        GET DIAGNOSTICS proposals_updated = ROW_COUNT;
        
        -- Finally delete the user profile
        DELETE FROM profiles p
        WHERE p.id = target_user_id;
        
        RETURN jsonb_build_object(
            'success', true,
            'message', 'User deleted successfully',
            'deleted_user_id', target_user_id,
            'deleted_by', current_user_id,
            'admin_role', current_user_role::text,
            'cleanup_stats', jsonb_build_object(
                'files_deleted', files_deleted,
                'descriptions_deleted', descriptions_deleted,
                'talents_deleted', talents_deleted,
                'sessions_deleted', sessions_deleted,
                'votes_deleted', votes_deleted,
                'proposals_updated', proposals_updated
            )
        );
        
    EXCEPTION
        WHEN OTHERS THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Database error during deletion: ' || SQLERRM,
                'sqlstate', SQLSTATE,
                'target_user_id', target_user_id,
                'current_user_id', current_user_id,
                'current_role', current_user_role::text
            );
    END;
END;
$$;

-- Grant permission
GRANT EXECUTE ON FUNCTION admin_hard_delete_user_fixed TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ COLUMN NAME ERROR FIXED';
    RAISE NOTICE '✅ Changed creator_id to created_by in proposals table update';
    RAISE NOTICE '📋 Function ready for use: admin_hard_delete_user_fixed';
END $$;