import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  LogOut,
  Users,
  FolderOpen,
  UserPlus,
  Briefcase,
  Hammer,
} from "lucide-react";
import { useRouter } from "next/router";

import { Profile } from "@/types";
import UserManagement from "./admin/UserManagement";
import ContentManagement from "./admin/ContentManagement";
import CreateUser from "./admin/CreateUser";
import TalentManagement from "./admin/TalentManagement";
import CreateAuction from "./admin/CreateAuction";

interface ContentItem {
  name: string;
  userId: string;
  userName: string;
  description?: string;
  fileType?: string;
}

const AdminPanel = React.memo((): JSX.Element => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<
    "users" | "content" | "create" | "talents" | "auctions"
  >("users");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
      router.push("/admin/login");
    } catch (err) {
      setError("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      // Use active_profiles view to exclude soft-deleted users
      const { data, error } = await supabase
        .from("active_profiles")
        .select("id, name, email, role, created_at, avatar_url")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError("Failed to fetch users");
    }
  }, [supabase]);

  const fetchAllContent = useCallback(async () => {
    try {
      // Get file descriptions without join to avoid 400 error
      const { data: fileDescriptions, error: descError } = await supabase
        .from("active_file_descriptions")
        .select("file_name, description, mime_type, user_id, created_at")
        .order("created_at", { ascending: false });

      if (descError) throw descError;

      // Get user names separately to avoid join issues
      const userIds = Array.from(
        new Set(fileDescriptions?.map((desc) => desc.user_id) || []),
      );
      const { data: users, error: usersError } = await supabase
        .from("active_profiles")
        .select("id, name")
        .in("id", userIds);

      if (usersError) throw usersError;

      // Create a user lookup map
      const userLookup = new Map();
      users?.forEach((user) => {
        userLookup.set(user.id, user.name);
      });

      const contentItems = (fileDescriptions || []).map((desc: any) => ({
        name: desc.file_name,
        userId: desc.user_id,
        userName: userLookup.get(desc.user_id) || "Unknown User",
        description: desc.description || "",
        fileType: desc.mime_type || "",
      }));

      setContent(contentItems);
    } catch (err: any) {
      setError("Failed to fetch content");
    }
  }, [supabase]);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchAllContent()]);
      setLoading(false);
    };

    initializeData();
  }, [fetchUsers, fetchAllContent]);

  const handleUserDelete = async (userId: string) => {
    if (
      !confirm(
        "⚠️ PERMANENT DELETE: Are you sure you want to permanently delete this user? This will completely remove the user and ALL their data from the database. This action CANNOT be undone!",
      )
    ) {
      return;
    }

    // Double confirmation for permanent deletion
    if (
      !confirm(
        "🚨 FINAL WARNING: This will permanently delete:\n" +
          "• User profile\n" +
          "• All uploaded files\n" +
          "• File descriptions\n" +
          "• Talents records\n" +
          "• User sessions\n" +
          "• Everything related to this user\n\n" +
          "Type 'DELETE' to confirm you understand this is permanent.",
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      // Use the fixed version that handles admin check and column ambiguity
      console.log("Attempting to delete user:", userId);
      const { data, error } = await supabase.rpc(
        "admin_hard_delete_user_fixed",
        {
          target_user_id: userId,
        },
      );

      console.log("Delete result:", { data, error });

      if (error) {
        console.error("Delete error:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      // The v2 function returns JSON with success/error info
      if (!data || data.success !== true) {
        const errorMsg = data?.error || "Unknown error occurred";
        console.error("Delete failed:", data);
        throw new Error(`Delete failed: ${errorMsg}`);
      }

      // Refresh data
      await Promise.all([fetchUsers(), fetchAllContent()]);

      // Success message
      alert("User has been permanently deleted successfully.");
    } catch (err: any) {
      setError("Failed to delete user: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleContentDelete = async (item: ContentItem) => {
    if (
      !confirm(
        `⚠️ PERMANENT DELETE: Are you sure you want to permanently delete "${item.name}"? This will remove both the file and database record. This action CANNOT be undone!`,
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      // Delete the actual file from storage
      const { error: storageError } = await supabase.storage
        .from("files")
        .remove([`${item.userId}/${item.name}`]);

      if (storageError) {
        console.warn("Storage delete warning:", storageError);
        // Continue with database delete even if storage fails
      }

      // Delete the file description record from database
      const { error: dbError } = await supabase
        .from("file_descriptions")
        .delete()
        .eq("user_id", item.userId)
        .eq("file_name", item.name);

      if (dbError) throw dbError;

      // Refresh content
      await fetchAllContent();

      alert(`"${item.name}" has been permanently deleted.`);
    } catch (err: any) {
      setError("Failed to delete content: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleUserCreated = () => {
    fetchUsers();
    setActiveTab("users");
  };

  // Memoize expensive calculations
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  const filteredContent = useMemo(() => {
    let filtered = content;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.userName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedUser !== "all") {
      filtered = filtered.filter((item) => item.userId === selectedUser);
    }

    return filtered;
  }, [content, searchTerm, selectedUser]);

  const statsData = useMemo(
    () => ({
      totalUsers: users.length,
      totalContent: content.length,
      activeUsers: new Set(content.map((item) => item.userId)).size,
    }),
    [users, content],
  );

  const tabIcons = useMemo(
    () => ({
      users: Users,
      content: FolderOpen,
      create: UserPlus,
      talents: Briefcase,
      auctions: Hammer,
    }),
    [],
  );

  return (
    <div className="mx-auto py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-atirose text-violet text-5xl md:text-6xl mb-6">
            Admin Panel
          </h1>
          <div className="flex justify-center">
            <button
              aria-label="Sign out"
              className="flex items-center gap-2 px-6 py-3 bg-red-600/20 border border-red-600 text-red-400 hover:bg-red-600 hover:text-white rounded-full transition-all duration-300"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="w-full mb-12">
          <svg
            className="w-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 330 8"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_453_22)">
              <path
                d="M35 3L-0.5 7.5V12.5H330V7.5L294.5 3H271L242 0H87.5L58.5 3H35Z"
                fill="transparent"
              />
              <path
                d="M59.0303 3.5303L58.8107 3.75H58.5H35.3107L0.25 7.8107V11.75H329.25V7.8107L294.189 3.75H271H270.689L270.47 3.5303L241.689 0.75H87.8107L59.0303 3.5303Z"
                stroke="#A986D9"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            <defs>
              <clipPath id="clip0_453_22">
                <rect fill="white" height="8" width="330" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-xl text-red-200">
            {error}
            <button
              aria-label="Dismiss error"
              className="float-right text-red-300 hover:text-white"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {(["users", "content", "create", "talents", "auctions"] as const).map(
            (tab) => {
              const Icon = tabIcons[tab];

              return (
                <button
                  key={tab}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-violet text-white shadow-lg transform scale-105"
                      : "bg-transparent border border-darkviolet text-gray-300 hover:border-violet hover:bg-violet/20"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <Icon size={16} />
                  {tab === "users"
                    ? "Users"
                    : tab === "content"
                      ? "Content"
                      : tab === "create"
                        ? "Create User"
                        : tab === "talents"
                          ? "Talents"
                          : "Auctions"}
                </button>
              );
            },
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl hover:border-violet hover:shadow-xl transition-all duration-300 p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-violet">
              {statsData.totalUsers}
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl hover:border-violet hover:shadow-xl transition-all duration-300 p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Total Content
            </h3>
            <p className="text-3xl font-bold text-violet">
              {statsData.totalContent}
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl hover:border-violet hover:shadow-xl transition-all duration-300 p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Active Users
            </h3>
            <p className="text-3xl font-bold text-violet">
              {statsData.activeUsers}
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Tab Content */}
        <div className="border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl p-6">
          {activeTab === "users" && (
            <UserManagement
              expandedUser={expandedUser}
              loading={loading}
              searchTerm={searchTerm}
              users={filteredUsers}
              onSearchChange={setSearchTerm}
              onUserDelete={handleUserDelete}
              onUserToggle={handleUserToggle}
            />
          )}

          {activeTab === "content" && (
            <ContentManagement
              content={filteredContent}
              loading={loading}
              searchTerm={searchTerm}
              selectedUser={selectedUser}
              users={users}
              onContentDelete={handleContentDelete}
              onSearchChange={setSearchTerm}
              onUserFilter={setSelectedUser}
            />
          )}

          {activeTab === "create" && (
            <CreateUser onUserCreated={handleUserCreated} />
          )}

          {activeTab === "talents" && (
            <TalentManagement
              loading={loading}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          )}

          {activeTab === "auctions" && <CreateAuction />}
        </div>
      </div>
    </div>
  );
});

AdminPanel.displayName = "AdminPanel";

export default AdminPanel;
