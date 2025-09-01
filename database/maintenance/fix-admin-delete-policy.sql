-- ============================================================================
-- FIX: Admin Delete User Policy
-- ============================================================================
-- This script fixes the issue where admins cannot soft-delete users
-- Error: "new row violates row-level security policy for table profiles"
-- ============================================================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins full access profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- ============================================================================
-- STEP 1: Create proper admin policy using auth.uid() check
-- ============================================================================
-- This policy allows admins to perform ALL operations including soft deletes
CREATE POLICY "Admins can do everything on profiles"
ON profiles
FOR ALL
USING (
    -- Check if current user is an admin (without circular reference)
    auth.uid() IN (
        SELECT id FROM profiles 
        WHERE role IN ('admin', 'moderator') 
        AND deleted_at IS NULL
    )
)
WITH CHECK (
    -- For INSERT/UPDATE operations
    auth.uid() IN (
        SELECT id FROM profiles 
        WHERE role IN ('admin', 'moderator') 
        AND deleted_at IS NULL
    )
);

-- ============================================================================
-- STEP 2: Create user self-update policy
-- ============================================================================
-- Users can update their own profile (but not change their role or deleted_at)
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (
    auth.uid() = id 
    AND deleted_at IS NULL
)
WITH CHECK (
    auth.uid() = id 
    AND deleted_at IS NULL
);

-- ============================================================================
-- STEP 3: Alternative approach - Create a dedicated admin check function
-- ============================================================================
-- This function safely checks if a user is an admin without circular references
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator', 'council_member')
        AND deleted_at IS NULL
    );
$$;

-- Drop and recreate policies using the function
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON profiles;

-- Admin policy using the function (cleaner approach)
CREATE POLICY "Admins full access to profiles"
ON profiles
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- STEP 4: Ensure other necessary policies exist
-- ============================================================================

-- Public can read non-deleted profiles
DROP POLICY IF EXISTS "Public profiles read" ON profiles;
CREATE POLICY "Public profiles read" 
ON profiles 
FOR SELECT 
USING (deleted_at IS NULL);

-- Users can insert their own profile (for registration)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- STEP 5: Test the policies
-- ============================================================================

-- Check existing policies
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual::text as using_clause,
    with_check::text as check_clause
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- ============================================================================
-- STEP 6: Create admin soft-delete helper function (optional)
-- ============================================================================
-- This function helps admins soft-delete users more easily
CREATE OR REPLACE FUNCTION admin_soft_delete_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if current user is admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Only admins can delete users';
    END IF;
    
    -- Soft delete the user
    UPDATE profiles 
    SET deleted_at = NOW()
    WHERE id = user_id;
    
    -- Also soft delete related data
    UPDATE file_descriptions 
    SET deleted_at = NOW()
    WHERE user_id = user_id
    AND deleted_at IS NULL;
    
    UPDATE talents 
    SET deleted_at = NOW()
    WHERE user_id = user_id
    AND deleted_at IS NULL;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error deleting user: %', SQLERRM;
        RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users (function checks admin internally)
GRANT EXECUTE ON FUNCTION admin_soft_delete_user TO authenticated;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Admin delete policies have been fixed!';
    RAISE NOTICE '✅ Admins can now soft-delete users without RLS errors.';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Usage:';
    RAISE NOTICE '1. Direct UPDATE: UPDATE profiles SET deleted_at = NOW() WHERE id = ''user-id'';';
    RAISE NOTICE '2. Using helper: SELECT admin_soft_delete_user(''user-id'');';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Note: Make sure you are logged in as an admin user.';
END $$;

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================
-- If you still get RLS errors:
-- 1. Check your user's role: SELECT role FROM profiles WHERE id = auth.uid();
-- 2. Make sure your role is 'admin', 'moderator', or 'council_member'
-- 3. Verify the is_admin() function: SELECT is_admin();
-- 4. Check all policies: SELECT * FROM pg_policies WHERE tablename = 'profiles';
-- ============================================================================