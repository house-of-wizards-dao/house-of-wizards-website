import React from "react";
import { Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";

import { Profile } from "@/types";

interface UserManagementProps {
  users: Profile[];
  loading: boolean;
  searchTerm: string;
  expandedUser: string | null;
  onSearchChange: (term: string) => void;
  onUserToggle: (userId: string) => void;
  onUserDelete: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  loading,
  searchTerm,
  expandedUser,
  onSearchChange,
  onUserToggle,
  onUserDelete,
}) => {
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="text-sm text-gray-400">
          {filteredUsers.length} of {users.length} users
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-darkviolet rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet transition-colors"
            placeholder="Search users by name, email, or ID..."
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Header - Hidden on mobile */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4 p-4 font-semibold text-gray-300 border-b border-darkviolet">
          <span>Name</span>
          <span>Email</span>
          <span>ID</span>
          <span>Role</span>
          <span>Actions</span>
        </div>

        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl hover:border-violet hover:shadow-xl transition-all duration-300"
          >
            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-lg">
                    {user.name || "No name"}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {(user as any).email || "No email"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (user as any).role === "admin"
                        ? "bg-red-600/20 text-red-400 border border-red-600"
                        : "bg-violet/20 text-violet border border-violet"
                    }`}
                  >
                    {(user as any).role || "user"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-mono text-sm">
                  ID: {user.id.slice(0, 8)}...
                </span>
                <div className="flex items-center gap-2">
                  <button
                    aria-label={
                      expandedUser === user.id
                        ? "Collapse user details"
                        : "Expand user details"
                    }
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    onClick={() => onUserToggle(user.id)}
                  >
                    {expandedUser === user.id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  <button
                    aria-label={`Delete user ${user.name}`}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/20"
                    onClick={() => onUserDelete(user.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-5 gap-4 p-4 items-center">
              <span className="text-white font-medium">
                {user.name || "No name"}
              </span>
              <span className="text-gray-300">
                {(user as any).email || "No email"}
              </span>
              <span className="text-gray-400 font-mono text-sm">
                {user.id.slice(0, 8)}...
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                  (user as any).role === "admin"
                    ? "bg-red-600/20 text-red-400 border border-red-600"
                    : "bg-violet/20 text-violet border border-violet"
                }`}
              >
                {(user as any).role || "user"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  aria-label={
                    expandedUser === user.id
                      ? "Collapse user details"
                      : "Expand user details"
                  }
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  onClick={() => onUserToggle(user.id)}
                >
                  {expandedUser === user.id ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                <button
                  aria-label={`Delete user ${user.name}`}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/20"
                  onClick={() => onUserDelete(user.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedUser === user.id && (
              <div className="border-t border-darkviolet p-6 bg-background/30">
                <h4 className="text-white font-medium mb-4">User Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block mb-1">Full ID:</span>
                    <p className="text-white font-mono break-all">{user.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Created:</span>
                    <p className="text-white">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-400 block mb-1">Bio:</span>
                    <p className="text-white">
                      {user.description || "No bio provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No users found matching your search.
        </div>
      )}
    </div>
  );
};

export default UserManagement;
