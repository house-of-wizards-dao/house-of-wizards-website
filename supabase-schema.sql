-- House of Wizards DAO - Community Platform Schema
-- Minimal schema based on actual website functionality

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE file_type AS ENUM ('image', 'video', 'audio', 'document', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'deleted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE talent_focus AS ENUM ('Artist', 'Developer', 'Writer', 'Musician', 'Other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  name character varying NOT NULL CHECK (length(name::text) >= 2),
  email character varying NOT NULL UNIQUE CHECK (email::text ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
  role user_role NOT NULL DEFAULT 'user',
  bio text,
  avatar_url character varying,
  website_url character varying CHECK (website_url IS NULL OR website_url::text ~* '^https?://'),
  twitter_handle character varying CHECK (twitter_handle IS NULL OR twitter_handle::text ~* '^[A-Za-z0-9_]{1,15}$'),
  discord_handle character varying,
  wallet_address character varying CHECK (wallet_address IS NULL OR wallet_address::text ~* '^0x[a-fA-F0-9]{40}$'),
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Talents table for talent board functionality
CREATE TABLE IF NOT EXISTS public.talents (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  name character varying NOT NULL CHECK (length(name::text) >= 2),
  focus talent_focus NOT NULL,
  skillset text NOT NULL CHECK (length(TRIM(BOTH FROM skillset)) >= 3),
  bio text,
  website_url character varying CHECK (website_url IS NULL OR website_url::text ~* '^https?://'),
  twitter_handle character varying CHECK (twitter_handle IS NULL OR twitter_handle::text ~* '^[A-Za-z0-9_]{1,15}$'),
  discord_handle character varying,
  avatar_url character varying,
  is_available boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT talents_pkey PRIMARY KEY (id),
  CONSTRAINT talents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- File descriptions for user artwork and uploads
CREATE TABLE IF NOT EXISTS public.file_descriptions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  file_name character varying NOT NULL CHECK (length(file_name::text) >= 1),
  original_name character varying NOT NULL,
  description text,
  file_type file_type NOT NULL,
  mime_type character varying NOT NULL,
  file_size bigint NOT NULL CHECK (file_size > 0),
  status content_status NOT NULL DEFAULT 'draft',
  bucket_name character varying NOT NULL DEFAULT 'files',
  is_featured boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT file_descriptions_pkey PRIMARY KEY (id),
  CONSTRAINT file_descriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- User sessions for session management
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + '30 days'::interval),
  is_active boolean DEFAULT true,
  CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Admin audit log for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  admin_user_id uuid NOT NULL,
  action character varying NOT NULL,
  target_table character varying,
  target_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admin_audit_log_pkey PRIMARY KEY (id),
  CONSTRAINT admin_audit_log_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES public.profiles(id)
);

-- Rate limiting for API protection
CREATE SEQUENCE IF NOT EXISTS rate_limits_id_seq;
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id integer NOT NULL DEFAULT nextval('rate_limits_id_seq'),
  key character varying NOT NULL UNIQUE,
  count integer DEFAULT 1,
  reset_time bigint NOT NULL,
  window_start bigint NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT rate_limits_pkey PRIMARY KEY (id)
);

-- Create useful views for active content (matching existing codebase)
CREATE OR REPLACE VIEW active_profiles AS
SELECT * FROM profiles WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_talents AS
SELECT * FROM talents WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_file_descriptions AS
SELECT * FROM file_descriptions WHERE deleted_at IS NULL;

-- Create indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON public.profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at);

CREATE INDEX IF NOT EXISTS idx_talents_user_id ON public.talents(user_id);
CREATE INDEX IF NOT EXISTS idx_talents_focus ON public.talents(focus);
CREATE INDEX IF NOT EXISTS idx_talents_is_featured ON public.talents(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_talents_deleted_at ON public.talents(deleted_at);

CREATE INDEX IF NOT EXISTS idx_file_descriptions_user_id ON public.file_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_file_descriptions_status ON public.file_descriptions(status);
CREATE INDEX IF NOT EXISTS idx_file_descriptions_file_type ON public.file_descriptions(file_type);
CREATE INDEX IF NOT EXISTS idx_file_descriptions_deleted_at ON public.file_descriptions(deleted_at);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user_id ON public.admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON public.admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_table ON public.admin_audit_log(target_table);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- RLS policies for talents
CREATE POLICY "Anyone can view active talents" ON public.talents FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users can manage their own talent entries" ON public.talents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all talents" ON public.talents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- RLS policies for file descriptions
CREATE POLICY "Anyone can view published files" ON public.file_descriptions FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "Users can manage their own files" ON public.file_descriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all files" ON public.file_descriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- RLS policies for user sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own sessions" ON public.user_sessions FOR ALL USING (auth.uid() = user_id);

-- RLS policies for admin audit log
CREATE POLICY "Only admins can view audit logs" ON public.admin_audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_talents_updated_at ON public.talents;
CREATE TRIGGER update_talents_updated_at BEFORE UPDATE ON public.talents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_file_descriptions_updated_at ON public.file_descriptions;
CREATE TRIGGER update_file_descriptions_updated_at BEFORE UPDATE ON public.file_descriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Admin functions for hard deletion (matching existing codebase)
CREATE OR REPLACE FUNCTION admin_hard_delete_user_fixed(target_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Delete user data in correct order (respecting foreign keys)
  DELETE FROM public.talents WHERE user_id = target_user_id;
  DELETE FROM public.file_descriptions WHERE user_id = target_user_id;
  DELETE FROM public.user_sessions WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
  
  -- Log the action
  INSERT INTO public.admin_audit_log (admin_user_id, action, target_table, target_id)
  VALUES (auth.uid(), 'HARD_DELETE_USER', 'profiles', target_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION hard_delete_talent(talent_id uuid)
RETURNS void AS $$
BEGIN
  -- Only allow admins or the talent owner to call this function
  IF NOT EXISTS (
    SELECT 1 FROM public.talents t
    JOIN public.profiles p ON t.user_id = p.id
    WHERE t.id = talent_id 
    AND (p.id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')))
  ) THEN
    RAISE EXCEPTION 'Access denied. You can only delete your own talent entries.';
  END IF;

  DELETE FROM public.talents WHERE id = talent_id;
  
  -- Log the action
  INSERT INTO public.admin_audit_log (admin_user_id, action, target_table, target_id)
  VALUES (auth.uid(), 'HARD_DELETE_TALENT', 'talents', talent_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;