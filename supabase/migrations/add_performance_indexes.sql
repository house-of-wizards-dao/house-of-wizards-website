-- Performance optimization indexes for House of Wizards DAO platform
-- These indexes improve query performance for common operations

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role_created ON profiles(role, created_at DESC);

-- Gallery items table indexes (assuming this table exists)
CREATE INDEX IF NOT EXISTS idx_gallery_items_user_id ON gallery_items(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_created_at ON gallery_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_file_type ON gallery_items(file_type);
CREATE INDEX IF NOT EXISTS idx_gallery_items_user_created ON gallery_items(user_id, created_at DESC);

-- Artists table indexes (assuming this table exists)
CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);
CREATE INDEX IF NOT EXISTS idx_artists_created_at ON artists(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_artists_active ON artists(active) WHERE active = true;

-- Talents table indexes
CREATE INDEX IF NOT EXISTS idx_talents_name ON talents(name);
CREATE INDEX IF NOT EXISTS idx_talents_created_at ON talents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_talents_skills_gin ON talents USING gin(skills) WHERE skills IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_talents_active ON talents(active) WHERE active = true;

-- File descriptions table indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_file_descriptions_user_id ON file_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_file_descriptions_file_name ON file_descriptions(file_name);
CREATE INDEX IF NOT EXISTS idx_file_descriptions_file_type ON file_descriptions(file_type);
CREATE INDEX IF NOT EXISTS idx_file_descriptions_user_file ON file_descriptions(user_id, file_name);

-- Rate limits table indexes (already created in rate limiter migration)
-- Included here for completeness
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON rate_limits(reset_time);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);

-- Audit log table indexes (for future audit trail implementation)
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_operation ON audit_logs(operation);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_table ON audit_logs(user_id, table_name, created_at DESC);

-- Search optimization indexes
-- Full text search on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_search_name ON profiles USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_profiles_search_desc ON profiles USING gin(to_tsvector('english', description)) WHERE description IS NOT NULL;

-- Full text search on talents
CREATE INDEX IF NOT EXISTS idx_talents_search_name ON talents USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_talents_search_bio ON talents USING gin(to_tsvector('english', bio)) WHERE bio IS NOT NULL;

-- Full text search on artists
CREATE INDEX IF NOT EXISTS idx_artists_search_name ON artists USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_artists_search_bio ON artists USING gin(to_tsvector('english', bio)) WHERE bio IS NOT NULL;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_profiles_role_email ON profiles(role, email);
CREATE INDEX IF NOT EXISTS idx_talents_active_created ON talents(active, created_at DESC) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_artists_active_created ON artists(active, created_at DESC) WHERE active = true;

-- Unique constraints for data integrity
ALTER TABLE profiles ADD CONSTRAINT unique_profiles_email UNIQUE (email);

-- Comments for documentation
COMMENT ON INDEX idx_profiles_email IS 'Fast lookups for user authentication and profile retrieval';
COMMENT ON INDEX idx_profiles_role IS 'Quick filtering by user role for admin operations';
COMMENT ON INDEX idx_profiles_created_at IS 'Efficient ordering for user lists by registration date';
COMMENT ON INDEX idx_profiles_search_name IS 'Full-text search optimization for user names';
COMMENT ON INDEX idx_talents_skills_gin IS 'GIN index for efficient JSON array searches on skills';
COMMENT ON INDEX idx_rate_limits_reset_time IS 'Cleanup optimization for expired rate limit entries';