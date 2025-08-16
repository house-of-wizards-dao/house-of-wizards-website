import { getServiceSupabase } from "./supabase";
import { logger } from "./logger";

export interface ContentItem {
  name: string;
  userId: string;
  userName: string;
  description?: string;
  fileType?: string;
  size?: number;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  avatar_url?: string;
  content_count?: number;
}

export class AdminService {
  private supabase = getServiceSupabase();

  /**
   * Fetches all users with their content counts in a single optimized query
   * Replaces multiple individual queries with a single JOIN operation
   */
  async fetchUsersWithContentCounts(): Promise<UserProfile[]> {
    const startTime = Date.now();

    try {
      // Single query with LEFT JOIN to get content counts - using active profiles
      const { data, error } = await this.supabase
        .from("active_profiles")
        .select(
          `
          id,
          name,
          email,
          role,
          created_at,
          avatar_url,
          file_descriptions!inner(count)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to include content counts
      const users =
        data?.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          avatar_url: user.avatar_url,
          content_count: user.file_descriptions?.length || 0,
        })) || [];

      logger.logDatabaseOperation(
        "SELECT",
        "profiles with content counts",
        Date.now() - startTime,
      );

      return users;
    } catch (error) {
      logger.logDatabaseOperation(
        "SELECT",
        "profiles with content counts",
        Date.now() - startTime,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * Optimized content fetching with batch operations
   * Replaces N+1 query pattern with efficient batch loading
   */
  async fetchAllContentOptimized(): Promise<ContentItem[]> {
    const startTime = Date.now();

    try {
      // First, get all file descriptions with user info in a single query - using active views
      const { data: fileDescriptions, error: descError } = await this.supabase
        .from("active_file_descriptions")
        .select(
          `
          file_name,
          description,
          file_type,
          user_id,
          created_at
        `,
        )
        .order("created_at", { ascending: false });

      if (descError) throw descError;

      // Get user names separately to avoid join issues
      const userIds = Array.from(new Set(fileDescriptions?.map(desc => desc.user_id) || []));
      const { data: users, error: usersError } = await this.supabase
        .from("active_profiles")
        .select("id, name")
        .in("id", userIds);

      if (usersError) throw usersError;

      // Create a user lookup map
      const userLookup = new Map();
      users?.forEach(user => {
        userLookup.set(user.id, user.name);
      });

      // Transform to the expected format
      const content: ContentItem[] =
        fileDescriptions?.map((desc: any) => ({
          name: desc.file_name,
          userId: desc.user_id,
          userName: userLookup.get(desc.user_id) || "Unknown User",
          description: desc.description,
          fileType: desc.file_type,
          created_at: desc.created_at,
        })) || [];

      logger.logDatabaseOperation(
        "SELECT",
        "file_descriptions with profiles",
        Date.now() - startTime,
      );

      return content;
    } catch (error) {
      logger.logDatabaseOperation(
        "SELECT",
        "file_descriptions with profiles",
        Date.now() - startTime,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * Get content for a specific user efficiently
   */
  async fetchUserContent(userId: string): Promise<ContentItem[]> {
    const startTime = Date.now();

    try {
      const { data, error } = await this.supabase
        .from("file_descriptions")
        .select(
          `
          file_name,
          description,
          file_type,
          created_at,
          profiles!inner(name)
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const content =
        data?.map((desc: any) => ({
          name: desc.file_name,
          userId: userId,
          userName: desc.profiles?.name || "Unknown User",
          description: desc.description,
          fileType: desc.file_type,
          created_at: desc.created_at,
        })) || [];

      logger.logDatabaseOperation(
        "SELECT",
        "user_content",
        Date.now() - startTime,
      );

      return content;
    } catch (error) {
      logger.logDatabaseOperation(
        "SELECT",
        "user_content",
        Date.now() - startTime,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * Efficient user deletion with proper cascade handling
   */
  async deleteUserWithContent(userId: string): Promise<void> {
    const startTime = Date.now();

    try {
      // Perform soft delete operations directly without function
      // 1. Soft delete all user's file descriptions
      const { error: contentError } = await this.supabase
        .from("file_descriptions")
        .update({ deleted_at: new Date().toISOString() })
        .eq("user_id", userId)
        .is("deleted_at", null);

      if (contentError) throw contentError;

      // 2. Soft delete all user's talents
      const { error: talentsError } = await this.supabase
        .from("talents")
        .update({ deleted_at: new Date().toISOString() })
        .eq("user_id", userId)
        .is("deleted_at", null);

      if (talentsError) throw talentsError;

      // 3. Soft delete the user profile
      const { error: profileError } = await this.supabase
        .from("profiles")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", userId)
        .is("deleted_at", null);

      if (profileError) throw profileError;

      logger.logDatabaseOperation(
        "DELETE",
        "user_with_content",
        Date.now() - startTime,
      );
      logger.info("User deleted successfully", { userId });
    } catch (error) {
      logger.logDatabaseOperation(
        "DELETE",
        "user_with_content",
        Date.now() - startTime,
        error as Error,
      );
      logger.error("Failed to delete user", { userId, error: error as Error });
      throw error;
    }
  }

  /**
   * Batch content deletion
   */
  async deleteMultipleContent(
    contentItems: { userId: string; fileName: string }[],
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Perform batch soft delete operations directly
      const deletePromises = contentItems.map(async (item) => {
        const { error } = await this.supabase
          .from("file_descriptions")
          .update({ deleted_at: new Date().toISOString() })
          .eq("user_id", item.userId)
          .eq("file_name", item.fileName)
          .is("deleted_at", null);

        if (error) throw error;
      });

      await Promise.all(deletePromises);

      logger.logDatabaseOperation(
        "DELETE",
        "multiple_content",
        Date.now() - startTime,
      );
      logger.info("Multiple content items deleted", {
        count: contentItems.length,
      });
    } catch (error) {
      logger.logDatabaseOperation(
        "DELETE",
        "multiple_content",
        Date.now() - startTime,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * Get admin dashboard statistics efficiently
   */
  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalContent: number;
    activeUsers: number;
    recentUsers: number;
  }> {
    const startTime = Date.now();

    try {
      // Single query to get all stats
      const { data, error } = await this.supabase.rpc(
        "get_admin_dashboard_stats",
      );

      if (error) throw error;

      logger.logDatabaseOperation(
        "SELECT",
        "dashboard_stats",
        Date.now() - startTime,
      );

      return (
        data[0] || {
          totalUsers: 0,
          totalContent: 0,
          activeUsers: 0,
          recentUsers: 0,
        }
      );
    } catch (error) {
      logger.logDatabaseOperation(
        "SELECT",
        "dashboard_stats",
        Date.now() - startTime,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * Search users and content efficiently
   */
  async searchUsersAndContent(
    query: string,
    limit: number = 50,
  ): Promise<{
    users: UserProfile[];
    content: ContentItem[];
  }> {
    const startTime = Date.now();

    try {
      // Parallel searches using Promise.all for better performance
      const [usersResult, contentResult] = await Promise.all([
        this.supabase
          .from("active_profiles")
          .select("id, name, email, role, created_at, avatar_url")
          .or(`name.ilike.%${query}%, email.ilike.%${query}%`)
          .limit(limit),

        this.supabase
          .from("active_file_descriptions")
          .select(
            `
            file_name,
            description,
            file_type,
            user_id,
            created_at,
            profiles!inner(name)
          `,
          )
          .or(`file_name.ilike.%${query}%, description.ilike.%${query}%`)
          .limit(limit),
      ]);

      if (usersResult.error) throw usersResult.error;
      if (contentResult.error) throw contentResult.error;

      const users = usersResult.data || [];
      const content =
        contentResult.data?.map((desc: any) => ({
          name: desc.file_name,
          userId: desc.user_id,
          userName: desc.profiles?.name || "Unknown User",
          description: desc.description,
          fileType: desc.file_type,
          created_at: desc.created_at,
        })) || [];

      logger.logDatabaseOperation(
        "SEARCH",
        "users_and_content",
        Date.now() - startTime,
      );

      return { users, content };
    } catch (error) {
      logger.logDatabaseOperation(
        "SEARCH",
        "users_and_content",
        Date.now() - startTime,
        error as Error,
      );
      throw error;
    }
  }
}

// Singleton instance
export const adminService = new AdminService();
