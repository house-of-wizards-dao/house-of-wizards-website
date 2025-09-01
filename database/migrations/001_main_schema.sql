-- House of Wizards DAO - Step 1: Main Schema (without CONCURRENTLY indexes)
-- Run this first in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'council_member', 'admin', 'moderator');
CREATE TYPE talent_focus AS ENUM ('Artist', 'Developer', 'Writer', 'Project Manager', 'Filmmaker', 'Biz Dev', 'Musician + Dev');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'flagged');
CREATE TYPE proposal_status AS ENUM ('draft', 'active', 'passed', 'rejected', 'expired');
CREATE TYPE file_type AS ENUM ('image', 'video', 'audio', 'document', 'other');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(512),
    website_url VARCHAR(512),
    twitter_handle VARCHAR(50),
    discord_handle VARCHAR(50),
    wallet_address VARCHAR(42), -- Ethereum address format
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    -- Constraints
    CONSTRAINT profiles_name_length CHECK (LENGTH(name) >= 2),
    CONSTRAINT profiles_email_format CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
    CONSTRAINT profiles_website_url_format CHECK (website_url IS NULL OR website_url ~* '^https?://'),
    CONSTRAINT profiles_twitter_format CHECK (twitter_handle IS NULL OR twitter_handle ~* '^[A-Za-z0-9_]{1,15}$'),
    CONSTRAINT profiles_wallet_format CHECK (wallet_address IS NULL OR wallet_address ~* '^0x[a-fA-F0-9]{40}$')
);

-- Talents table for DAO talent directory
CREATE TABLE IF NOT EXISTS talents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    focus talent_focus NOT NULL,
    skillset TEXT NOT NULL,
    bio TEXT,
    website_url VARCHAR(512),
    twitter_handle VARCHAR(50),
    discord_handle VARCHAR(50),
    avatar_url VARCHAR(512),
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    -- Constraints
    CONSTRAINT talents_name_length CHECK (LENGTH(name) >= 2),
    CONSTRAINT talents_skillset_length CHECK (LENGTH(skillset) >= 10),
    CONSTRAINT talents_website_url_format CHECK (website_url IS NULL OR website_url ~* '^https?://'),
    CONSTRAINT talents_twitter_format CHECK (twitter_handle IS NULL OR twitter_handle ~* '^[A-Za-z0-9_]{1,15}$')
);

-- File descriptions for content management
CREATE TABLE IF NOT EXISTS file_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    description TEXT,
    file_type file_type NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    status content_status DEFAULT 'draft' NOT NULL,
    bucket_name VARCHAR(100) DEFAULT 'files' NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    -- Constraints
    CONSTRAINT file_descriptions_file_size_positive CHECK (file_size > 0),
    CONSTRAINT file_descriptions_file_name_length CHECK (LENGTH(file_name) >= 1)
);

-- Tags for content organization
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1', -- Hex color
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    -- Constraints
    CONSTRAINT tags_name_length CHECK (LENGTH(name) >= 2),
    CONSTRAINT tags_color_format CHECK (color ~* '^#[0-9a-f]{6}$')
);

-- Content tags junction table
CREATE TABLE IF NOT EXISTS content_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_description_id UUID REFERENCES file_descriptions(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(file_description_id, tag_id)
);

-- Proposals for DAO governance
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status proposal_status DEFAULT 'draft' NOT NULL,
    voting_starts_at TIMESTAMPTZ,
    voting_ends_at TIMESTAMPTZ,
    required_quorum INTEGER DEFAULT 10,
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    -- Constraints
    CONSTRAINT proposals_title_length CHECK (LENGTH(title) >= 10),
    CONSTRAINT proposals_description_length CHECK (LENGTH(description) >= 50),
    CONSTRAINT proposals_voting_period CHECK (voting_ends_at IS NULL OR voting_ends_at > voting_starts_at),
    CONSTRAINT proposals_quorum_positive CHECK (required_quorum > 0)
);

-- Proposal votes
CREATE TABLE IF NOT EXISTS proposal_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    vote BOOLEAN NOT NULL, -- true = for, false = against
    voting_power INTEGER DEFAULT 1,
    reasoning TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(proposal_id, user_id),
    -- Constraints
    CONSTRAINT proposal_votes_voting_power_positive CHECK (voting_power > 0)
);

-- User sessions for tracking and security
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days') NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    count INTEGER DEFAULT 1,
    reset_time BIGINT NOT NULL,
    window_start BIGINT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Admin audit log
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    target_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- BASIC INDEXES (NON-CONCURRENT)
-- ============================================================================

-- Essential indexes that can be created in transaction
CREATE INDEX IF NOT EXISTS idx_content_tags_file_description_id ON content_tags(file_description_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_tag_id ON content_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_composite ON content_tags(file_description_id, tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_proposal_votes_proposal_id ON proposal_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_votes_user_id ON proposal_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits(key);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON rate_limits(reset_time);

-- ============================================================================
-- ACTIVE VIEWS (SOFT DELETE PATTERN)
-- ============================================================================

-- Active profiles view
CREATE VIEW active_profiles AS
SELECT * FROM profiles WHERE deleted_at IS NULL;

-- Active talents view
CREATE VIEW active_talents AS
SELECT * FROM talents WHERE deleted_at IS NULL;

-- Active file descriptions view
CREATE VIEW active_file_descriptions AS
SELECT * FROM file_descriptions WHERE deleted_at IS NULL;

-- Active proposals view
CREATE VIEW active_proposals AS
SELECT * FROM proposals WHERE deleted_at IS NULL;

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_talents_updated_at BEFORE UPDATE ON talents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_file_descriptions_updated_at BEFORE UPDATE ON file_descriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Automatic profile creation on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', new.email),
        new.email,
        'user'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Vote counting function with trigger
CREATE OR REPLACE FUNCTION update_proposal_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE proposals SET
            votes_for = (
                SELECT COALESCE(SUM(voting_power), 0)
                FROM proposal_votes 
                WHERE proposal_id = NEW.proposal_id AND vote = true
            ),
            votes_against = (
                SELECT COALESCE(SUM(voting_power), 0)
                FROM proposal_votes 
                WHERE proposal_id = NEW.proposal_id AND vote = false
            ),
            total_votes = (
                SELECT COALESCE(SUM(voting_power), 0)
                FROM proposal_votes 
                WHERE proposal_id = NEW.proposal_id
            ),
            updated_at = NOW()
        WHERE id = NEW.proposal_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE proposals SET
            votes_for = (
                SELECT COALESCE(SUM(voting_power), 0)
                FROM proposal_votes 
                WHERE proposal_id = OLD.proposal_id AND vote = true
            ),
            votes_against = (
                SELECT COALESCE(SUM(voting_power), 0)
                FROM proposal_votes 
                WHERE proposal_id = OLD.proposal_id AND vote = false
            ),
            total_votes = (
                SELECT COALESCE(SUM(voting_power), 0)
                FROM proposal_votes 
                WHERE proposal_id = OLD.proposal_id
            ),
            updated_at = NOW()
        WHERE id = OLD.proposal_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for vote counting
CREATE TRIGGER update_proposal_vote_counts_trigger
    AFTER INSERT OR UPDATE OR DELETE ON proposal_votes
    FOR EACH ROW EXECUTE FUNCTION update_proposal_vote_counts();

-- Update tag usage counts
CREATE OR REPLACE FUNCTION update_tag_usage_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = GREATEST(0, usage_count - 1) WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for tag usage counts
CREATE TRIGGER update_tag_usage_counts_trigger
    AFTER INSERT OR DELETE ON content_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_counts();

-- Admin dashboard statistics function
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
BEGIN
    RETURN json_build_object(
        'total_users', (SELECT COUNT(*) FROM active_profiles),
        'total_talents', (SELECT COUNT(*) FROM active_talents),
        'total_content', (SELECT COUNT(*) FROM active_file_descriptions),
        'active_proposals', (SELECT COUNT(*) FROM active_proposals WHERE status = 'active'),
        'recent_signups', (SELECT COUNT(*) FROM active_profiles WHERE created_at > NOW() - INTERVAL '7 days'),
        'featured_content', (SELECT COUNT(*) FROM active_file_descriptions WHERE is_featured = true)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rate limit cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS VOID AS $$
BEGIN
    DELETE FROM rate_limits WHERE reset_time < EXTRACT(EPOCH FROM NOW()) * 1000;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins full access profiles" ON profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin' AND p.deleted_at IS NULL)
);

-- Talents policies
CREATE POLICY "Public talents read" ON talents FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users can manage own talents" ON talents FOR ALL USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'council_member') AND p.deleted_at IS NULL)
);
CREATE POLICY "Council can create talents" ON talents FOR INSERT WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'council_member') AND p.deleted_at IS NULL)
);

-- File descriptions policies
CREATE POLICY "Public file descriptions read" ON file_descriptions FOR SELECT USING (
    status = 'published' AND deleted_at IS NULL
);
CREATE POLICY "Users can manage own files" ON file_descriptions FOR ALL USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator') AND p.deleted_at IS NULL)
);
CREATE POLICY "Authenticated users can upload" ON file_descriptions FOR INSERT WITH CHECK (
    auth.uid() = user_id AND auth.uid() IS NOT NULL
);

-- Tags policies
CREATE POLICY "Public tags read" ON tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tags" ON tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage tags" ON tags FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator') AND p.deleted_at IS NULL)
);

-- Content tags policies
CREATE POLICY "Public content tags read" ON content_tags FOR SELECT USING (
    EXISTS (SELECT 1 FROM file_descriptions fd WHERE fd.id = file_description_id AND fd.status = 'published' AND fd.deleted_at IS NULL)
);
CREATE POLICY "File owners can manage content tags" ON content_tags FOR ALL USING (
    EXISTS (
        SELECT 1 FROM file_descriptions fd 
        WHERE fd.id = file_description_id 
        AND (fd.user_id = auth.uid() OR 
             EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator') AND p.deleted_at IS NULL))
    )
);

-- Proposals policies
CREATE POLICY "Public proposals read" ON proposals FOR SELECT USING (
    status IN ('active', 'passed', 'rejected') AND deleted_at IS NULL
);
CREATE POLICY "Council can manage proposals" ON proposals FOR ALL USING (
    created_by = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'council_member') AND p.deleted_at IS NULL)
);
CREATE POLICY "Council can create proposals" ON proposals FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'council_member') AND p.deleted_at IS NULL)
);

-- Proposal votes policies
CREATE POLICY "Public proposal votes read" ON proposal_votes FOR SELECT USING (
    EXISTS (SELECT 1 FROM proposals p WHERE p.id = proposal_id AND p.status = 'active' AND p.deleted_at IS NULL)
);
CREATE POLICY "Users can vote on active proposals" ON proposal_votes FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
        SELECT 1 FROM proposals p 
        WHERE p.id = proposal_id 
        AND p.status = 'active' 
        AND p.voting_starts_at <= NOW() 
        AND p.voting_ends_at > NOW()
        AND p.deleted_at IS NULL
    )
);
CREATE POLICY "Users can update own votes" ON proposal_votes FOR UPDATE USING (
    user_id = auth.uid() AND 
    EXISTS (
        SELECT 1 FROM proposals p 
        WHERE p.id = proposal_id 
        AND p.status = 'active' 
        AND p.voting_ends_at > NOW()
        AND p.deleted_at IS NULL
    )
);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own sessions" ON user_sessions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all sessions" ON user_sessions FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin' AND p.deleted_at IS NULL)
);

-- Admin audit log policies (admin only)
CREATE POLICY "Admins can view audit log" ON admin_audit_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin' AND p.deleted_at IS NULL)
);

-- Service role can access rate limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role rate limits access" ON rate_limits FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- STORAGE BUCKET POLICIES
-- ============================================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
    ('files', 'files', false, 10485760, ARRAY['image/*', 'video/*', 'audio/*', 'application/pdf']::text[]),
    ('talent-avatars', 'talent-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
    ('proposals', 'proposals', false, 20971520, ARRAY['image/*', 'application/pdf', 'text/*']::text[])
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1] AND
    auth.uid() IS NOT NULL
);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Files bucket policies
CREATE POLICY "Authenticated users can view files" ON storage.objects FOR SELECT USING (
    bucket_id = 'files' AND auth.uid() IS NOT NULL
);
CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'files' AND 
    auth.uid()::text = (storage.foldername(name))[1] AND
    auth.uid() IS NOT NULL
);
CREATE POLICY "Users can manage own files" ON storage.objects FOR ALL USING (
    bucket_id = 'files' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR 
     EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator') AND p.deleted_at IS NULL))
);

-- Talent avatars bucket policies
CREATE POLICY "Talent avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'talent-avatars');
CREATE POLICY "Council can manage talent avatars" ON storage.objects FOR ALL USING (
    bucket_id = 'talent-avatars' AND 
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'council_member') AND p.deleted_at IS NULL)
);

-- Proposals bucket policies
CREATE POLICY "Council can manage proposal files" ON storage.objects FOR ALL USING (
    bucket_id = 'proposals' AND 
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'council_member') AND p.deleted_at IS NULL)
);

-- ============================================================================
-- INITIAL DATA SETUP
-- ============================================================================

-- Insert default tags
INSERT INTO tags (name, description, color, usage_count) VALUES
    ('art', 'Visual artwork and digital art', '#e11d48', 0),
    ('development', 'Software development and coding', '#3b82f6', 0),
    ('writing', 'Written content and literature', '#8b5cf6', 0),
    ('music', 'Musical compositions and audio', '#f59e0b', 0),
    ('featured', 'Featured community content', '#10b981', 0),
    ('dao-governance', 'DAO governance related content', '#6366f1', 0)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- MAINTENANCE AND MONITORING
-- ============================================================================

-- Create a maintenance function to be run periodically
CREATE OR REPLACE FUNCTION run_maintenance()
RETURNS VOID AS $$
BEGIN
    -- Clean up expired rate limits
    PERFORM cleanup_expired_rate_limits();
    
    -- Clean up expired user sessions
    DELETE FROM user_sessions WHERE expires_at < NOW();
    
    -- Update statistics
    ANALYZE profiles, talents, file_descriptions, proposals;
    
    -- Log maintenance run
    INSERT INTO admin_audit_log (admin_user_id, action, created_at)
    VALUES (
        '00000000-0000-0000-0000-000000000000'::uuid, 
        'system_maintenance', 
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SCHEMA VALIDATION AND COMMENTS
-- ============================================================================

-- Add helpful comments to tables
COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users with DAO-specific fields';
COMMENT ON TABLE talents IS 'DAO talent directory showcasing community members skills and availability';
COMMENT ON TABLE file_descriptions IS 'Metadata for user-uploaded content with moderation support';
COMMENT ON TABLE proposals IS 'DAO governance proposals with voting mechanics';
COMMENT ON TABLE proposal_votes IS 'Individual votes on DAO proposals with reasoning and voting power';
COMMENT ON TABLE tags IS 'Content categorization tags with usage tracking';
COMMENT ON TABLE content_tags IS 'Many-to-many relationship between content and tags';
COMMENT ON TABLE user_sessions IS 'User session tracking for security and analytics';
COMMENT ON TABLE admin_audit_log IS 'Complete audit trail of administrative actions';
COMMENT ON TABLE rate_limits IS 'API rate limiting to prevent abuse';

-- Schema version tracking
CREATE TABLE IF NOT EXISTS schema_version (
    version VARCHAR(20) PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT
);

INSERT INTO schema_version (version, description) VALUES 
    ('1.0.0', 'Initial clean schema for House of Wizards DAO production deployment')
ON CONFLICT (version) DO NOTHING;

-- Step 1 completion message
DO $$
BEGIN
    RAISE NOTICE 'Step 1: Main schema deployment complete!';
    RAISE NOTICE 'Next: Run step2-performance-indexes.sql for optimal performance';
END $$;