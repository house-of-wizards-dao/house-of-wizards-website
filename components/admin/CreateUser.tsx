import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserPlus, Eye, EyeOff } from "lucide-react";

interface NewUser {
  email: string;
  name: string;
  password: string;
  role: "user" | "admin";
}

interface CreateUserProps {
  onUserCreated?: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ onUserCreated }) => {
  const supabase = useSupabaseClient();
  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    name: "",
    password: "",
    role: "user",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUser.email || !newUser.name || !newUser.password) {
      setError("All fields are required");

      return;
    }

    if (newUser.password.length < 6) {
      setError("Password must be at least 6 characters");

      return;
    }

    try {
      setCreating(true);
      setError(null);
      setSuccess(null);

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
            role: newUser.role,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create or update profile
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          created_at: new Date().toISOString(),
        });

        if (profileError) throw profileError;

        setSuccess(`User ${newUser.name} created successfully!`);
        setNewUser({ email: "", name: "", password: "", role: "user" });

        if (onUserCreated) {
          onUserCreated();
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="h-5 w-5 text-violet" />
          <h3 className="text-lg font-semibold text-white">Create New User</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded text-green-200 text-sm">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleCreateUser}>
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-1"
              htmlFor="user-email"
            >
              Email *
            </label>
            <input
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-white"
              id="user-email"
              placeholder="user@example.com"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-1"
              htmlFor="user-name"
            >
              Name *
            </label>
            <input
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-white"
              id="user-name"
              placeholder="John Doe"
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-1"
              htmlFor="user-password"
            >
              Password *
            </label>
            <div className="relative">
              <input
                required
                className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-white"
                id="user-password"
                minLength={6}
                placeholder="Minimum 6 characters"
                type={showPassword ? "text" : "password"}
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-1"
              htmlFor="user-role"
            >
              Role
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-white"
              id="user-role"
              value={newUser.role}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  role: e.target.value as "user" | "admin",
                })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            className="w-full bg-violet hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            disabled={creating}
            type="submit"
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Create User
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
