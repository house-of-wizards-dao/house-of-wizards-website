-- House of Wizards DAO - Step 2: Performance Indexes
-- Run this AFTER step1-main-schema.sql completes successfully
-- These indexes use CONCURRENTLY to avoid locking tables during creation

-- ============================================================================
-- PERFORMANCE INDEXES - RUN EACH INDIVIDUALLY IN SUPABASE
-- ============================================================================
-- IMPORTANT: Run each CREATE INDEX command separately in Supabase SQL Editor
-- Do NOT run this entire file at once - it will fail with the same transaction error

-- Profile indexes (run one by one)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_email ON profiles(email) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_role ON profiles(role) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address) WHERE wallet_address IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_metadata_gin ON profiles USING GIN(metadata) WHERE deleted_at IS NULL;

-- Talent indexes (run one by one)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_talents_user_id ON talents(user_id) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_talents_focus ON talents(focus) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_talents_available ON talents(is_available) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_talents_featured ON talents(is_featured) WHERE is_featured = true AND deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_talents_created_at ON talents(created_at DESC) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_talents_metadata_gin ON talents USING GIN(metadata) WHERE deleted_at IS NULL;

-- File description indexes (run one by one)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_file_descriptions_user_id ON file_descriptions(user_id) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_file_descriptions_status ON file_descriptions(status) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_file_descriptions_file_type ON file_descriptions(file_type) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_file_descriptions_featured ON file_descriptions(is_featured) WHERE is_featured = true AND deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_file_descriptions_created_at ON file_descriptions(created_at DESC) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_file_descriptions_metadata_gin ON file_descriptions USING GIN(metadata) WHERE deleted_at IS NULL;

-- Tags indexes (run one by one)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tags_usage_count ON tags(usage_count DESC);

-- Proposal indexes (run one by one)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proposals_status ON proposals(status) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proposals_created_by ON proposals(created_by) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proposals_voting_period ON proposals(voting_starts_at, voting_ends_at) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proposals_active_voting ON proposals(status, voting_ends_at) WHERE status = 'active' AND deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proposals_metadata_gin ON proposals USING GIN(metadata) WHERE deleted_at IS NULL;

-- Session and security indexes (run one by one)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Audit log indexes (run one by one)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_audit_log_admin_user_id ON admin_audit_log(admin_user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);

-- Final verification query (run this last to check all indexes were created)
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;