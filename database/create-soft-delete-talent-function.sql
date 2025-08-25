-- ============================================================================
-- CREATE: soft_delete_talent function
-- ============================================================================
-- This function soft deletes a talent entry by setting deleted_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION soft_delete_talent(talent_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role user_role;
    current_user_id UUID;
    talent_exists BOOLEAN;
    talent_user_id UUID;
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
    
    -- Check if talent exists and get its user_id
    SELECT EXISTS(SELECT 1 FROM talents WHERE id = talent_id AND deleted_at IS NULL), user_id
    INTO talent_exists, talent_user_id
    FROM talents 
    WHERE id = talent_id AND deleted_at IS NULL;
    
    IF NOT talent_exists THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Talent not found or already deleted',
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
    
    -- Perform soft delete
    BEGIN
        UPDATE talents 
        SET deleted_at = NOW()
        WHERE id = talent_id 
        AND deleted_at IS NULL;
        
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Talent soft deleted successfully',
            'talent_id', talent_id,
            'deleted_by', current_user_id,
            'deleted_at', NOW()
        );
        
    EXCEPTION
        WHEN OTHERS THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Database error during soft delete: ' || SQLERRM,
                'sqlstate', SQLSTATE,
                'talent_id', talent_id,
                'current_user_id', current_user_id
            );
    END;
END;
$$;

-- Grant permission to authenticated users
GRANT EXECUTE ON FUNCTION soft_delete_talent TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ SOFT DELETE TALENT FUNCTION CREATED';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Users can soft delete their own talents';
    RAISE NOTICE '✅ Admins/moderators can soft delete any talent';
    RAISE NOTICE '✅ Returns detailed success/error information';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Function: soft_delete_talent(talent_id UUID)';
END $$;