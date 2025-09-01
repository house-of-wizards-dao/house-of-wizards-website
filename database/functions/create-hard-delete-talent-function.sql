-- ============================================================================
-- CREATE: hard_delete_talent function
-- ============================================================================
-- This function permanently deletes a talent entry from the database
-- ============================================================================

CREATE OR REPLACE FUNCTION hard_delete_talent(talent_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role user_role;
    current_user_id UUID;
    talent_exists BOOLEAN;
    talent_user_id UUID;
    talent_name VARCHAR(100);
    avatar_filename VARCHAR(512);
BEGIN
    -- Get current user info
    current_user_id := auth.uid();
    
    SELECT p.role INTO current_user_role 
    FROM profiles p 
    WHERE p.id = current_user_id 
    AND p.deleted_at IS NULL;
    
    -- Check if current user exists
    IF current_user_role IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Current user not found or is deleted',
            'user_id', current_user_id
        );
    END IF;
    
    -- Check if talent exists and get its details
    SELECT 
        EXISTS(SELECT 1 FROM talents WHERE id = talent_id), 
        t.user_id, 
        t.name,
        t.avatar_url
    INTO talent_exists, talent_user_id, talent_name, avatar_filename
    FROM talents t
    WHERE t.id = talent_id;
    
    IF NOT talent_exists THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Talent not found',
            'talent_id', talent_id
        );
    END IF;
    
    -- Check permissions: user can delete their own talent OR admin/moderator can delete any
    IF current_user_id != talent_user_id 
       AND current_user_role::text NOT IN ('admin', 'moderator', 'council_member') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Insufficient permissions to delete this talent',
            'current_role', current_user_role::text,
            'current_user_id', current_user_id,
            'talent_user_id', talent_user_id
        );
    END IF;
    
    -- Perform hard delete
    BEGIN
        -- Delete avatar file from storage if it exists
        IF avatar_filename IS NOT NULL AND avatar_filename != '' THEN
            DELETE FROM storage.objects 
            WHERE bucket_id = 'talent-avatars' 
            AND name = avatar_filename;
        END IF;
        
        -- Delete the talent record
        DELETE FROM talents 
        WHERE id = talent_id;
        
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Talent permanently deleted successfully',
            'talent_id', talent_id,
            'talent_name', talent_name,
            'deleted_by', current_user_id,
            'avatar_deleted', (avatar_filename IS NOT NULL AND avatar_filename != '')
        );
        
    EXCEPTION
        WHEN OTHERS THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Database error during deletion: ' || SQLERRM,
                'sqlstate', SQLSTATE,
                'talent_id', talent_id,
                'current_user_id', current_user_id
            );
    END;
END;
$$;

-- Grant permission to authenticated users
GRANT EXECUTE ON FUNCTION hard_delete_talent TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ HARD DELETE TALENT FUNCTION CREATED';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Permanently deletes talent records from database';
    RAISE NOTICE '✅ Deletes associated avatar files from storage';
    RAISE NOTICE '✅ Users can delete their own talents';
    RAISE NOTICE '✅ Admins/moderators can delete any talent';
    RAISE NOTICE '✅ Returns detailed success/error information';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Function: hard_delete_talent(talent_id UUID)';
END $$;