-- House of Wizards DAO - Optimized Database Queries
-- Performance-optimized queries for authentication and profile management

-- ============================================================================
-- AUTHENTICATION QUERY ANALYSIS
-- ============================================================================

-- CRITICAL ISSUE #1: Field Name Mismatch - Database vs Application
-- Database schema uses: bio, twitter_handle, discord_handle, website_url
-- Application expects: description, twitter, discord, website

-- Query 1: Current BROKEN profile query from API (will fail)
/*
SELECT id, name, email, description, twitter, discord, website, avatar_url, created_at
FROM profiles 
WHERE id = $1;
*/

-- Query 1 FIXED: Correct profile query with field mapping
SELECT 
    id, 
    name, 
    email, 
    bio as description,           -- Map bio -> description
    twitter_handle as twitter,    -- Map twitter_handle -> twitter  
    discord_handle as discord,    -- Map discord_handle -> discord
    website_url as website,       -- Map website_url -> website
    avatar_url, 
    created_at,
    updated_at,
    role
FROM profiles 
WHERE id = $1 AND deleted_at IS NULL;

-- Query 2: Authentication profile lookup (currently working but missing fields)
-- Used in src/lib/auth.ts line 45-49
SELECT role 
FROM profiles 
WHERE id = $1 AND deleted_at IS NULL;

-- Query 2 ENHANCED: Complete authentication profile lookup
SELECT 
    id,
    name,
    email,
    role,
    bio as description,
    twitter_handle as twitter,
    discord_handle as discord,
    website_url as website,
    avatar_url,
    wallet_address,
    created_at,
    updated_at
FROM profiles 
WHERE id = $1 AND deleted_at IS NULL;

-- Query 3: Profile creation/upsert (currently conflicts with trigger)
-- Used in AuthForm.tsx lines 116-123 and 67-72
INSERT INTO profiles (id, name, email, role, created_at, updated_at)
VALUES ($1, $2, $3, 'user', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = NOW()
RETURNING id, name, email, role;

-- Query 4: Profile update with correct field mapping
-- Used in profile API but with wrong field names
UPDATE profiles 
SET 
    name = COALESCE($1, name),
    bio = COALESCE($2, bio),                    -- description -> bio
    twitter_handle = COALESCE($3, twitter_handle), -- twitter -> twitter_handle
    discord_handle = COALESCE($4, discord_handle), -- discord -> discord_handle  
    website_url = COALESCE($5, website_url),       -- website -> website_url
    avatar_url = COALESCE($6, avatar_url),
    updated_at = NOW()
WHERE id = $7 AND deleted_at IS NULL
RETURNING 
    id, 
    name, 
    email, 
    bio as description,
    twitter_handle as twitter,
    discord_handle as discord, 
    website_url as website,
    avatar_url, 
    created_at;

-- ============================================================================
-- PERFORMANCE OPTIMIZED QUERIES
-- ============================================================================

-- Query 5: Efficient user session validation with role check
SELECT 
    p.id,
    p.name,
    p.email, 
    p.role,
    p.avatar_url,
    us.expires_at,
    us.is_active
FROM profiles p
LEFT JOIN user_sessions us ON p.id = us.user_id 
WHERE p.id = $1 
  AND p.deleted_at IS NULL
  AND (us.expires_at > NOW() OR us.expires_at IS NULL)
  AND (us.is_active = true OR us.is_active IS NULL);

-- Query 6: Admin dashboard user stats (optimized with proper indexes)
SELECT 
    COUNT(*) FILTER (WHERE deleted_at IS NULL) as total_active_users,
    COUNT(*) FILTER (WHERE role = 'admin' AND deleted_at IS NULL) as total_admins,
    COUNT(*) FILTER (WHERE role = 'council_member' AND deleted_at IS NULL) as total_council,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days' AND deleted_at IS NULL) as recent_signups,
    COUNT(*) FILTER (WHERE updated_at > NOW() - INTERVAL '24 hours' AND deleted_at IS NULL) as active_today
FROM profiles;

-- Query 7: User lookup with talent information (JOIN optimization)
SELECT 
    p.id,
    p.name,
    p.email,
    p.bio as description,
    p.twitter_handle as twitter,
    p.discord_handle as discord,
    p.website_url as website,
    p.avatar_url,
    p.role,
    t.focus as talent_focus,
    t.skillset,
    t.is_available,
    t.is_featured
FROM profiles p
LEFT JOIN talents t ON p.id = t.user_id AND t.deleted_at IS NULL
WHERE p.id = $1 AND p.deleted_at IS NULL;

-- ============================================================================
-- DATA INTEGRITY VALIDATION QUERIES
-- ============================================================================

-- Query 8: Check for orphaned profiles (users without auth.users entry)
SELECT 
    p.id,
    p.email,
    p.name,
    p.created_at
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.id IS NULL AND p.deleted_at IS NULL;

-- Query 9: Validate profile data integrity
SELECT 
    id,
    name,
    email,
    CASE 
        WHEN LENGTH(name) < 2 THEN 'Name too short'
        WHEN email !~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$' THEN 'Invalid email format'
        WHEN twitter_handle IS NOT NULL AND twitter_handle !~ '^[A-Za-z0-9_]{1,15}$' THEN 'Invalid Twitter handle'
        WHEN website_url IS NOT NULL AND website_url !~ '^https?://' THEN 'Invalid website URL'
        WHEN wallet_address IS NOT NULL AND wallet_address !~ '^0x[a-fA-F0-9]{40}$' THEN 'Invalid wallet address'
        ELSE 'Valid'
    END as validation_status
FROM profiles
WHERE deleted_at IS NULL
  AND (
    LENGTH(name) < 2 
    OR email !~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'
    OR (twitter_handle IS NOT NULL AND twitter_handle !~ '^[A-Za-z0-9_]{1,15}$')
    OR (website_url IS NOT NULL AND website_url !~ '^https?://')
    OR (wallet_address IS NOT NULL AND wallet_address !~ '^0x[a-fA-F0-9]{40}$')
  );

-- Query 10: Check RLS policy effectiveness
-- Test if regular users can see admin data (should return no rows)
SELECT 
    id,
    role,
    email
FROM profiles 
WHERE role = 'admin'
  AND id != auth.uid()  -- Exclude current user
  AND deleted_at IS NULL;

-- ============================================================================
-- TRANSACTION SAFETY QUERIES
-- ============================================================================

-- Query 11: Safe profile creation with conflict handling
BEGIN;
-- First check if profile already exists
SELECT id FROM profiles WHERE id = $1;

-- If not exists, create with trigger interaction awareness
INSERT INTO profiles (id, name, email, role)
VALUES ($1, $2, $3, 'user')
ON CONFLICT (id) DO UPDATE SET
    name = CASE 
        WHEN profiles.name = profiles.email OR profiles.name IS NULL 
        THEN EXCLUDED.name 
        ELSE profiles.name 
    END,
    email = EXCLUDED.email,
    updated_at = NOW();

COMMIT;

-- Query 12: Atomic profile update with validation
UPDATE profiles 
SET 
    name = CASE 
        WHEN $2 IS NOT NULL AND LENGTH($2) >= 2 
        THEN $2 
        ELSE name 
    END,
    bio = CASE 
        WHEN $3 IS NOT NULL 
        THEN $3 
        ELSE bio 
    END,
    twitter_handle = CASE 
        WHEN $4 IS NOT NULL AND ($4 = '' OR $4 ~ '^[A-Za-z0-9_]{1,15}$')
        THEN NULLIF($4, '')
        ELSE twitter_handle 
    END,
    discord_handle = CASE 
        WHEN $5 IS NOT NULL AND ($5 = '' OR LENGTH($5) <= 50)
        THEN NULLIF($5, '')
        ELSE discord_handle 
    END,
    website_url = CASE 
        WHEN $6 IS NOT NULL AND ($6 = '' OR $6 ~ '^https?://')
        THEN NULLIF($6, '')
        ELSE website_url 
    END,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING 
    id, 
    name, 
    email, 
    bio as description,
    twitter_handle as twitter,
    discord_handle as discord,
    website_url as website,
    avatar_url,
    updated_at;

-- ============================================================================
-- INDEX ANALYSIS QUERIES  
-- ============================================================================

-- Query 13: Check index usage for auth queries
EXPLAIN (ANALYZE, BUFFERS) 
SELECT role FROM profiles WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Query 14: Monitor query performance
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
WHERE query ILIKE '%profiles%'
ORDER BY total_time DESC
LIMIT 10;

-- ============================================================================
-- ERROR DETECTION QUERIES
-- ============================================================================

-- Query 15: Find potential authentication failures
SELECT 
    p.id,
    p.email,
    p.name,
    p.created_at,
    au.email_confirmed_at,
    au.created_at as auth_created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.deleted_at IS NULL
  AND (
    au.email_confirmed_at IS NULL 
    OR p.created_at > au.created_at + INTERVAL '1 hour'  -- Profile created too long after auth
    OR p.email != au.email  -- Email mismatch
  );

-- Query 16: Identify data transformation needed for existing profiles
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN bio IS NOT NULL THEN 1 END) as has_bio,
    COUNT(CASE WHEN twitter_handle IS NOT NULL THEN 1 END) as has_twitter,
    COUNT(CASE WHEN discord_handle IS NOT NULL THEN 1 END) as has_discord,
    COUNT(CASE WHEN website_url IS NOT NULL THEN 1 END) as has_website
FROM profiles
WHERE deleted_at IS NULL;

-- ============================================================================
-- TESTING QUERIES FOR VALIDATION
-- ============================================================================

-- Test 1: Verify RLS policies allow user access to own profile
-- Run as authenticated user
SELECT id, name, email FROM profiles WHERE id = auth.uid();

-- Test 2: Verify RLS policies block access to other user profiles for updates
-- Should fail with insufficient permissions
UPDATE profiles SET name = 'hacker' WHERE id != auth.uid();

-- Test 3: Test profile creation flow
-- Simulate the full signup process
INSERT INTO profiles (id, name, email) 
VALUES ('test-user-id', 'Test User', 'test@example.com')
ON CONFLICT (id) DO NOTHING;

-- Test 4: Verify field mapping works correctly  
SELECT 
    'Database Field' as source,
    bio as description_value,
    twitter_handle as twitter_value,
    discord_handle as discord_value,
    website_url as website_value
FROM profiles 
WHERE id = 'test-user-id'
UNION ALL
SELECT 
    'Expected Field' as source,
    'Should map to description' as description_value,
    'Should map to twitter' as twitter_value,
    'Should map to discord' as discord_value,
    'Should map to website' as website_value;

-- ============================================================================
-- PERFORMANCE MONITORING SETUP
-- ============================================================================

-- Enable query performance tracking
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Create monitoring view for auth-related queries
CREATE OR REPLACE VIEW auth_query_performance AS
SELECT 
    substring(query from 1 for 100) as query_sample,
    calls,
    total_time / 1000 as total_time_seconds,
    (total_time / calls / 1000)::numeric(10,3) as avg_time_seconds,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) as hit_percent
FROM pg_stat_statements 
WHERE query ILIKE '%profiles%' 
   OR query ILIKE '%auth.users%'
   OR query ILIKE '%user_sessions%'
ORDER BY total_time DESC;

-- ============================================================================
-- MAINTENANCE QUERIES
-- ============================================================================

-- Clean up expired sessions
DELETE FROM user_sessions 
WHERE expires_at < NOW() - INTERVAL '1 day';

-- Update statistics for auth-related tables
ANALYZE profiles, user_sessions, talents;

-- Check for fragmentation in auth tables
SELECT 
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename IN ('profiles', 'user_sessions', 'talents')
  AND attname IN ('id', 'email', 'role', 'created_at');