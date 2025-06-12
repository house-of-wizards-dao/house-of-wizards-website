import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { LogOut, Users, FolderOpen, UserPlus, Briefcase } from "lucide-react";
import { useRouter } from "next/router";

import { Profile } from "@/types";
import UserManagement from "./admin/UserManagement";
import ContentManagement from "./admin/ContentManagement";
import CreateUser from "./admin/CreateUser";
import TalentManagement from "./admin/TalentManagement";

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
  const [activeTab, setActiveTab] = useState<
    "users" | "content" | "create" | "talents"
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
    talents: Briefcase,
  };

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
          {(["users", "content", "create", "talents"] as const).map((tab) => {
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
                      : "Talents"}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl hover:border-violet hover:shadow-xl transition-all duration-300 p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-violet">{users.length}</p>
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl hover:border-violet hover:shadow-xl transition-all duration-300 p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Total Content
            </h3>
            <p className="text-3xl font-bold text-violet">{content.length}</p>
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl hover:border-violet hover:shadow-xl transition-all duration-300 p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Active Users
            </h3>
            <p className="text-3xl font-bold text-violet">
              {
                users.filter((user) =>
                  content.some((item) => item.userId === user.id),
                ).length
              }
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

          {activeTab === "talents" && (
            <TalentManagement
              loading={loading}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
