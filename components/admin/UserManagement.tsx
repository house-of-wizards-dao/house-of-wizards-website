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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-white"
            placeholder="Search users..."
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-600 font-semibold text-gray-300">
          <span>Name</span>
          <span>Email</span>
          <span>ID</span>
          <span>Role</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-gray-600">
          {filteredUsers.map((user) => (
            <div key={user.id}>
              <div className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-gray-700 transition-colors">
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
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    (user as any).role === "admin"
                      ? "bg-red-900 text-red-200"
                      : "bg-blue-900 text-blue-200"
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
                    className="p-1 text-gray-400 hover:text-white transition-colors"
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
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    onClick={() => onUserDelete(user.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {expandedUser === user.id && (
                <div className="px-4 pb-4 bg-gray-750">
                  <div className="bg-gray-900 p-4 rounded">
                    <h4 className="text-white font-medium mb-2">
                      User Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Full ID:</span>
                        <p className="text-white font-mono">{user.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Created:</span>
                        <p className="text-white">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Bio:</span>
                        <p className="text-white">
                          {user.bio || "No bio provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
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
