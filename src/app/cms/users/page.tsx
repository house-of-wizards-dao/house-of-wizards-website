"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/spinner";
import { UserPlus, Trash2, Save } from "lucide-react";

import { useCMSUser } from "@/hooks/useCMSUser";
import { User, UserRole } from "@/types/cms";

type UsersResponse = {
  users: User[];
};

async function fetchUsers(): Promise<UsersResponse> {
  const response = await fetch("/api/cms/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

async function createUser(data: {
  eth_address: string;
  twitter_handle?: string;
  role?: UserRole;
}): Promise<void> {
  const response = await fetch("/api/cms/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "Failed to create user");
  }
}

async function updateUser(
  address: string,
  data: { twitter_handle?: string; role?: UserRole },
): Promise<void> {
  const response = await fetch(`/api/cms/users/${address}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
}

async function deleteUser(address: string): Promise<void> {
  const response = await fetch(`/api/cms/users/${address}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "Failed to delete user");
  }
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin, address: currentAddress } = useCMSUser();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newTwitter, setNewTwitter] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("editor");
  const [addError, setAddError] = useState<string | null>(null);

  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>("editor");
  const [editTwitter, setEditTwitter] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cms-users"],
    queryFn: fetchUsers,
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-users"] });
      setShowAddForm(false);
      setNewAddress("");
      setNewTwitter("");
      setNewRole("editor");
      setAddError(null);
    },
    onError: (err: Error) => {
      setAddError(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      address,
      data,
    }: {
      address: string;
      data: { twitter_handle?: string; role?: UserRole };
    }) => updateUser(address, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-users"] });
      setEditingUser(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-users"] });
    },
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      setAddError("Ethereum address is required");
      return;
    }
    createMutation.mutate({
      eth_address: newAddress.trim(),
      twitter_handle: newTwitter.trim() || undefined,
      role: newRole,
    });
  };

  const handleDelete = (address: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      deleteMutation.mutate(address);
    }
  };

  const startEditing = (user: User) => {
    setEditingUser(user.eth_address);
    setEditRole(user.role);
    setEditTwitter(user.twitter_handle ?? "");
  };

  const saveEdit = (address: string) => {
    updateMutation.mutate({
      address,
      data: {
        role: editRole,
        twitter_handle: editTwitter || undefined,
      },
    });
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Admin access required.</p>
        <button
          onClick={() => router.push("/cms")}
          className="mt-4 text-brand-400 hover:text-brand-300"
        >
          Return to dashboard
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Spinner size="lg" color="secondary" />
        <p className="text-neutral-400">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load users.</p>
      </div>
    );
  }

  const users = data?.users ?? [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading text-neutral-100">
            User Management
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Manage CMS users and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddUser}
          className="mb-6 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800"
        >
          <h3 className="text-lg font-medium text-neutral-100 mb-4">
            Add New User
          </h3>
          {addError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {addError}
            </div>
          )}
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="new-address"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Ethereum Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="new-address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="new-twitter"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Twitter Handle
              </label>
              <input
                type="text"
                id="new-twitter"
                value={newTwitter}
                onChange={(e) => setNewTwitter(e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Role
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewRole("editor")}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    newRole === "editor"
                      ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setNewRole("admin")}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    newRole === "admin"
                      ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <Spinner size="sm" color="white" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Add User
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setAddError(null);
              }}
              className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <p className="text-neutral-400">No users found.</p>
        </div>
      ) : (
        <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">
                  Address
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase hidden sm:table-cell">
                  Twitter
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">
                  Role
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isEditing = editingUser === user.eth_address;
                const isSelf =
                  user.eth_address.toLowerCase() ===
                  currentAddress?.toLowerCase();

                return (
                  <tr
                    key={user.id}
                    className="border-b border-neutral-800/50 last:border-0 hover:bg-neutral-800/30"
                  >
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-sm text-neutral-300"
                        title={user.eth_address}
                      >
                        {truncateAddress(user.eth_address)}
                      </span>
                      {isSelf && (
                        <span className="ml-2 text-xs text-brand-400">
                          (you)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editTwitter}
                          onChange={(e) => setEditTwitter(e.target.value)}
                          placeholder="@username"
                          className="w-full px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-sm text-neutral-100"
                        />
                      ) : (
                        <span className="text-sm text-neutral-400">
                          {user.twitter_handle ?? "-"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditRole("editor")}
                            className={`px-2 py-1 text-xs rounded ${
                              editRole === "editor"
                                ? "bg-brand-500/20 text-brand-400"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            Editor
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditRole("admin")}
                            className={`px-2 py-1 text-xs rounded ${
                              editRole === "admin"
                                ? "bg-brand-500/20 text-brand-400"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            Admin
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(user.eth_address)}
                              disabled={updateMutation.isPending}
                              className="p-1.5 text-green-400 hover:bg-neutral-800 rounded transition-colors"
                              title="Save"
                            >
                              {updateMutation.isPending ? (
                                <Spinner size="sm" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="px-2 py-1 text-xs text-neutral-400 hover:text-neutral-200"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(user)}
                              className="px-2 py-1 text-xs text-neutral-400 hover:text-brand-400 transition-colors"
                            >
                              Edit
                            </button>
                            {!isSelf && (
                              <button
                                onClick={() => handleDelete(user.eth_address)}
                                disabled={deleteMutation.isPending}
                                className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
