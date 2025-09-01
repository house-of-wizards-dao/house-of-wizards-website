-- Enhanced Audit System for HOW DAO
-- Tracks all changes to critical tables with full context

-- Create audit log table for detailed tracking
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SOFT_DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    api_endpoint TEXT,
    session_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for efficient audit queries
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    audit_user_id UUID;
    changed_fields TEXT[] := ARRAY[]::TEXT[];
    old_json JSONB;
    new_json JSONB;
BEGIN
    -- Get current user ID from session
    audit_user_id := auth.uid();
    
    -- Determine action and prepare data
    IF TG_OP = 'DELETE' THEN
        old_json := to_jsonb(OLD);
        new_json := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        old_json := to_jsonb(OLD);
        new_json := to_jsonb(NEW);
        
        -- Find changed fields
        SELECT array_agg(key) INTO changed_fields
        FROM jsonb_each(old_json) old_data
        WHERE old_data.value IS DISTINCT FROM (new_json -> old_data.key);
        
    ELSIF TG_OP = 'INSERT' THEN
        old_json := NULL;
        new_json := to_jsonb(NEW);
    END IF;
    
    -- Insert audit record
    INSERT INTO audit_log (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        changed_fields,
        user_id,
        created_at
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        old_json,
        new_json,
        changed_fields,
        audit_user_id,
        NOW()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to critical tables
CREATE TRIGGER profiles_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON profiles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER talents_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON talents
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER file_descriptions_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON file_descriptions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Function to get user audit history
CREATE OR REPLACE FUNCTION get_user_audit_history(target_user_id UUID, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
    timestamp TIMESTAMPTZ,
    table_name VARCHAR(100),
    action VARCHAR(20),
    changed_fields TEXT[],
    old_values JSONB,
    new_values JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.created_at,
        al.table_name,
        al.action,
        al.changed_fields,
        al.old_values,
        al.new_values
    FROM audit_log al
    WHERE al.record_id = target_user_id
       OR al.user_id = target_user_id
    ORDER BY al.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies for audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs" ON audit_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin' AND p.deleted_at IS NULL)
);

CREATE POLICY "Users can view own audit logs" ON audit_log FOR SELECT USING (
    user_id = auth.uid() OR record_id = auth.uid()
);

-- Cleanup function for old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_log 
    WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;