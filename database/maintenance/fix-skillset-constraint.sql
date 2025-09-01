-- ============================================================================
-- FIX: Remove restrictive skillset length constraint
-- ============================================================================
-- The current constraint requires skillset to be at least 10 characters,
-- which is too restrictive for users with short skill descriptions.
-- ============================================================================

-- Step 1: Drop the existing restrictive constraint
ALTER TABLE talents DROP CONSTRAINT IF EXISTS talents_skillset_length;

-- Step 2: Add a more reasonable constraint (at least 3 characters)
ALTER TABLE talents ADD CONSTRAINT talents_skillset_length 
    CHECK (LENGTH(TRIM(skillset)) >= 3);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ SKILLSET CONSTRAINT FIXED';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Removed restrictive 10-character minimum';
    RAISE NOTICE '✅ Added reasonable 3-character minimum (trimmed)';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Users can now add talents with shorter skill descriptions';
END $$;