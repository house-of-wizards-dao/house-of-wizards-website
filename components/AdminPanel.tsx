import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { LogOut, Users, FolderOpen, UserPlus } from "lucide-react";
import { useRouter } from "next/router";

import { Profile } from "@/types";
import UserManagement from "./admin/UserManagement";
import ContentManagement from "./admin/ContentManagement";
import CreateUser from "./admin/CreateUser";

interface ContentItem {
  name: string;
  userId: string;
  userName: string;
  description?: string;
  fileType?: string;
}

const AdminPanel = (): JSX.Element => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"users" | "content" | "create">(
    "users",
  );
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

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError("Failed to fetch users");
    }
  };

  const fetchAllContent = async () => {
    try {
      const { data: users, error: userError } = await supabase
        .from("profiles")
        .select("id, name");

      if (userError) throw userError;

      const allContent = await Promise.all(
        users.map(async (user) => {
          const { data: fileData, error: fileError } = await supabase.storage
            .from("files")
            .list(user.id + "/");

          if (fileError) {
            return [];
          }

          const { data: descData } = await supabase
            .from("file_descriptions")
            .select("*")
            .eq("user_id", user.id);

          return (fileData || []).map((file) => {
            const fileDesc = descData?.find(
              (desc) => desc.file_name === file.name,
            );

            return {
              name: file.name,
              userId: user.id,
              userName: user.name || "Unknown User",
              description: fileDesc?.description || "",
              fileType: fileDesc?.file_type || "",
            };
          });
        }),
      );

      setContent(allContent.flat());
    } catch (err: any) {
      setError("Failed to fetch content");
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchAllContent()]);
      setLoading(false);
    };

    initializeData();
  }, [supabase]);

  const handleUserDelete = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      // Delete user files first
      const { data: files } = await supabase.storage
        .from("files")
        .list(userId + "/");

      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${userId}/${file.name}`);

        await supabase.storage.from("files").remove(filePaths);
      }

      // Delete file descriptions
      await supabase.from("file_descriptions").delete().eq("user_id", userId);

      // Delete profile
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      // Refresh data
      await Promise.all([fetchUsers(), fetchAllContent()]);
    } catch (err: any) {
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleContentDelete = async (item: ContentItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      setLoading(true);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("files")
        .remove([`${item.userId}/${item.name}`]);

      if (storageError) throw storageError;

      // Delete description
      await supabase
        .from("file_descriptions")
        .delete()
        .eq("user_id", item.userId)
        .eq("file_name", item.name);

      // Refresh content
      await fetchAllContent();
    } catch (err: any) {
      setError("Failed to delete content");
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

  const tabIcons = {
    users: Users,
    content: FolderOpen,
    create: UserPlus,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-violet">Admin Panel</h1>
          <button
            aria-label="Sign out"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
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
        <div className="flex space-x-1 mb-6">
          {(["users", "content", "create"] as const).map((tab) => {
            const Icon = tabIcons[tab];

            return (
              <button
                key={tab}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-violet text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <Icon size={16} />
                {tab === "users"
                  ? "Users"
                  : tab === "content"
                    ? "Content"
                    : "Create User"}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300">Total Users</h3>
            <p className="text-3xl font-bold text-violet">{users.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300">
              Total Content
            </h3>
            <p className="text-3xl font-bold text-violet">{content.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300">
              Active Users
            </h3>
            <p className="text-3xl font-bold text-violet">
              {
                users.filter((user) =>
                  content.some((item) => item.userId === user.id),
                ).length
              }
            </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-850 rounded-lg p-6">
          {activeTab === "users" && (
            <UserManagement
              expandedUser={expandedUser}
              loading={loading}
              searchTerm={searchTerm}
              users={users}
              onSearchChange={setSearchTerm}
              onUserDelete={handleUserDelete}
              onUserToggle={handleUserToggle}
            />
          )}

          {activeTab === "content" && (
            <ContentManagement
              content={content}
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
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
