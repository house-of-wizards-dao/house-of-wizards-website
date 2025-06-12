-- Add soft delete support and audit trail system
-- This migration adds audit tracking and soft delete capabilities

-- First, create the audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')),
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB
);

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_operation ON audit_logs(operation);

-- Add soft delete columns to main tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE talents ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE file_descriptions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Add indexes for soft delete queries
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_talents_deleted_at ON talents(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_file_descriptions_deleted_at ON file_descriptions(deleted_at) WHERE deleted_at IS NOT NULL;

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  operation_type TEXT;
BEGIN
  -- Determine operation type
  IF TG_OP = 'DELETE' THEN
    operation_type = 'DELETE';
    old_data = to_jsonb(OLD);
    new_data = NULL;
  ELSIF TG_OP = 'INSERT' THEN
    operation_type = 'INSERT';
    old_data = NULL;
    new_data = to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    operation_type = 'UPDATE';
    old_data = to_jsonb(OLD);
    new_data = to_jsonb(NEW);
  END IF;

  -- Insert audit record
  INSERT INTO audit_logs (
    table_name,
    record_id,
    operation,
    old_values,
    new_values,
    user_id,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(
      (new_data->>'id')::UUID,
      (old_data->>'id')::UUID
    ),
    operation_type,
    old_data,
    new_data,
    COALESCE(
      (new_data->>'user_id')::UUID,
      (old_data->>'user_id')::UUID
    ),
    NOW()
  );

  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for main tables
CREATE TRIGGER profiles_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER talents_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON talents
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER file_descriptions_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON file_descriptions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Soft delete functions
CREATE OR REPLACE FUNCTION soft_delete_profile(profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET deleted_at = NOW() 
  WHERE id = profile_id AND deleted_at IS NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found or already deleted';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION soft_delete_talent(talent_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE talents 
  SET deleted_at = NOW() 
  WHERE id = talent_id AND deleted_at IS NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Talent not found or already deleted';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION restore_profile(profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET deleted_at = NULL 
  WHERE id = profile_id AND deleted_at IS NOT NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found or not deleted';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION restore_talent(talent_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE talents 
  SET deleted_at = NULL 
  WHERE id = talent_id AND deleted_at IS NOT NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Talent not found or not deleted';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get audit trail for a record
CREATE OR REPLACE FUNCTION get_audit_trail(
  table_name_param TEXT,
  record_id_param UUID,
  limit_param INTEGER DEFAULT 50
)
RETURNS TABLE(
  id UUID,
  operation TEXT,
  old_values JSONB,
  new_values JSONB,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  details JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.operation,
    a.old_values,
    a.new_values,
    a.user_id,
    a.created_at,
    a.details
  FROM audit_logs a
  WHERE a.table_name = table_name_param 
    AND a.record_id = record_id_param
  ORDER BY a.created_at DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old audit logs (older than 1 year)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing delete functions to use soft deletes
CREATE OR REPLACE FUNCTION delete_user_with_content(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Soft delete file descriptions first
  UPDATE file_descriptions 
  SET deleted_at = NOW() 
  WHERE user_id = delete_user_with_content.user_id AND deleted_at IS NULL;
  
  -- Soft delete talents
  UPDATE talents 
  SET deleted_at = NOW() 
  WHERE user_id = delete_user_with_content.user_id AND deleted_at IS NULL;
  
  -- Soft delete the user profile
  UPDATE profiles 
  SET deleted_at = NOW() 
  WHERE id = delete_user_with_content.user_id AND deleted_at IS NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found or already deleted';
  END IF;
          
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Views for active (non-deleted) records
CREATE OR REPLACE VIEW active_profiles AS
SELECT * FROM profiles WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_talents AS
SELECT * FROM talents WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_file_descriptions AS
SELECT * FROM file_descriptions WHERE deleted_at IS NULL;

-- Grant necessary permissions
GRANT SELECT ON audit_logs TO authenticated;
GRANT SELECT ON active_profiles TO anon, authenticated;
GRANT SELECT ON active_talents TO anon, authenticated;
GRANT SELECT ON active_file_descriptions TO anon, authenticated;

GRANT EXECUTE ON FUNCTION soft_delete_profile TO authenticated;
GRANT EXECUTE ON FUNCTION soft_delete_talent TO authenticated;
GRANT EXECUTE ON FUNCTION restore_profile TO authenticated;
GRANT EXECUTE ON FUNCTION restore_talent TO authenticated;
GRANT EXECUTE ON FUNCTION get_audit_trail TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_audit_logs TO authenticated;