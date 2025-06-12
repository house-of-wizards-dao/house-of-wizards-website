-- Database functions to support optimized admin operations
-- These functions prevent N+1 queries and provide efficient batch operations

-- Function to delete user with all related content atomically
CREATE OR REPLACE FUNCTION delete_user_with_content(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Delete file descriptions first (foreign key constraint)
  DELETE FROM file_descriptions WHERE user_id = delete_user_with_content.user_id;
  
  -- Delete from storage (this would need to be handled in application code)
  -- For now, we'll just log the storage cleanup requirement
  
  -- Delete the user profile
  DELETE FROM profiles WHERE id = delete_user_with_content.user_id;
  
  -- Log the deletion for audit purposes
  INSERT INTO audit_logs (table_name, operation, record_id, user_id, details, created_at)
  VALUES ('profiles', 'DELETE', delete_user_with_content.user_id, delete_user_with_content.user_id, 
          jsonb_build_object('reason', 'admin_deletion'), NOW());
          
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise
    INSERT INTO audit_logs (table_name, operation, record_id, user_id, details, created_at)
    VALUES ('profiles', 'DELETE_ERROR', delete_user_with_content.user_id, delete_user_with_content.user_id, 
            jsonb_build_object('error', SQLERRM), NOW());
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete multiple content items in a batch
CREATE OR REPLACE FUNCTION delete_multiple_content(content_items JSONB)
RETURNS void AS $$
DECLARE
  item JSONB;
BEGIN
  -- Loop through each content item and delete
  FOR item IN SELECT * FROM jsonb_array_elements(content_items)
  LOOP
    DELETE FROM file_descriptions 
    WHERE user_id = (item->>'userId')::UUID 
    AND file_name = (item->>'fileName');
    
    -- Log each deletion
    INSERT INTO audit_logs (table_name, operation, record_id, user_id, details, created_at)
    VALUES ('file_descriptions', 'DELETE', NULL, (item->>'userId')::UUID, 
            jsonb_build_object('file_name', item->>'fileName'), NOW());
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin dashboard statistics efficiently
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE(
  total_users INTEGER,
  total_content INTEGER,
  active_users INTEGER,
  recent_users INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM profiles) as total_users,
    (SELECT COUNT(*)::INTEGER FROM file_descriptions) as total_content,
    (SELECT COUNT(DISTINCT user_id)::INTEGER FROM file_descriptions) as active_users,
    (SELECT COUNT(*)::INTEGER FROM profiles WHERE created_at > NOW() - INTERVAL '30 days') as recent_users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user content summary efficiently
CREATE OR REPLACE FUNCTION get_users_with_content_summary()
RETURNS TABLE(
  user_id UUID,
  user_name TEXT,
  email TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  content_count BIGINT,
  latest_content_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.name as user_name,
    p.email,
    p.role,
    p.created_at,
    p.avatar_url,
    COALESCE(fd.content_count, 0) as content_count,
    fd.latest_content_date
  FROM profiles p
  LEFT JOIN (
    SELECT 
      user_id,
      COUNT(*) as content_count,
      MAX(created_at) as latest_content_date
    FROM file_descriptions 
    GROUP BY user_id
  ) fd ON p.id = fd.user_id
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search across users and content efficiently
CREATE OR REPLACE FUNCTION search_admin_content(search_query TEXT, result_limit INTEGER DEFAULT 50)
RETURNS TABLE(
  result_type TEXT,
  id UUID,
  title TEXT,
  description TEXT,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  -- Search in users
  SELECT 
    'user'::TEXT as result_type,
    p.id,
    p.name as title,
    p.email as description,
    p.name as user_name,
    p.created_at
  FROM profiles p
  WHERE p.name ILIKE '%' || search_query || '%' 
     OR p.email ILIKE '%' || search_query || '%'
  
  UNION ALL
  
  -- Search in content
  SELECT 
    'content'::TEXT as result_type,
    NULL::UUID as id,
    fd.file_name as title,
    fd.description,
    p.name as user_name,
    fd.created_at
  FROM file_descriptions fd
  JOIN profiles p ON fd.user_id = p.id
  WHERE fd.file_name ILIKE '%' || search_query || '%' 
     OR fd.description ILIKE '%' || search_query || '%'
  
  ORDER BY created_at DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to efficiently update user roles in batch
CREATE OR REPLACE FUNCTION update_user_roles(user_role_updates JSONB)
RETURNS void AS $$
DECLARE
  update_item JSONB;
BEGIN
  FOR update_item IN SELECT * FROM jsonb_array_elements(user_role_updates)
  LOOP
    UPDATE profiles 
    SET role = (update_item->>'role')
    WHERE id = (update_item->>'userId')::UUID;
    
    -- Log the role change
    INSERT INTO audit_logs (table_name, operation, record_id, user_id, details, created_at)
    VALUES ('profiles', 'UPDATE', (update_item->>'userId')::UUID, (update_item->>'adminUserId')::UUID, 
            jsonb_build_object('field', 'role', 'old_value', update_item->>'oldRole', 'new_value', update_item->>'role'), NOW());
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION delete_user_with_content TO authenticated;
GRANT EXECUTE ON FUNCTION delete_multiple_content TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_users_with_content_summary TO authenticated;
GRANT EXECUTE ON FUNCTION search_admin_content TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_roles TO authenticated;