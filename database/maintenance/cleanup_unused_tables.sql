-- House of Wizards DAO - Database Cleanup Script
-- Remove unused tables that are not part of the community platform

-- WARNING: This will permanently delete data. Run with caution!
-- Make sure to backup your database before running this script.

-- Drop unused tables in correct order (respecting foreign key constraints)

-- Drop auction-related tables
DROP TABLE IF EXISTS public.auction_activity_log CASCADE;
DROP TABLE IF EXISTS public.auction_bids CASCADE;
DROP TABLE IF EXISTS public.auction_price_alerts CASCADE;
DROP TABLE IF EXISTS public.auction_watchlist CASCADE;
DROP TABLE IF EXISTS public.auctions CASCADE;
DROP TABLE IF EXISTS public.bid_increment_rules CASCADE;

-- Drop proposal/governance tables
DROP TABLE IF EXISTS public.proposal_votes CASCADE;
DROP TABLE IF EXISTS public.proposals CASCADE;

-- Drop notification system tables
DROP TABLE IF EXISTS public.notification_queue CASCADE;
DROP TABLE IF EXISTS public.notification_preferences CASCADE;
DROP TABLE IF EXISTS public.notification_templates CASCADE;

-- Drop content tagging system
DROP TABLE IF EXISTS public.content_tags CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;

-- Drop any other unused tables (uncomment if they exist and are unused)
-- DROP TABLE IF EXISTS public.collections CASCADE;
-- DROP TABLE IF EXISTS public.analytics_events CASCADE;
-- DROP TABLE IF EXISTS public.performance_metrics CASCADE;

-- Drop unused custom types
DROP TYPE IF EXISTS auction_status CASCADE;
DROP TYPE IF EXISTS auction_category CASCADE;
DROP TYPE IF EXISTS bid_status CASCADE;
DROP TYPE IF EXISTS proposal_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS notification_channel CASCADE;

-- Drop unused views (if they exist)
DROP VIEW IF EXISTS active_proposals CASCADE;
DROP VIEW IF EXISTS active_auctions CASCADE;

-- Drop unused functions (if they exist)
DROP FUNCTION IF EXISTS update_auction_bid_count() CASCADE;
DROP FUNCTION IF EXISTS check_auction_end() CASCADE;
DROP FUNCTION IF EXISTS send_notification() CASCADE;

-- Clean up any orphaned sequences
DROP SEQUENCE IF EXISTS auctions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS proposals_id_seq CASCADE;

-- Summary: The following core tables are KEPT:
-- ✅ profiles (user data)
-- ✅ talents (talent board)
-- ✅ file_descriptions (gallery uploads)
-- ✅ user_sessions (session management)
-- ✅ admin_audit_log (admin actions)
-- ✅ rate_limits (security)
-- ✅ schema_version (versioning)

-- The following views are KEPT:
-- ✅ active_profiles
-- ✅ active_talents  
-- ✅ active_file_descriptions

SELECT 'Database cleanup completed. Unused tables have been removed.' as status;