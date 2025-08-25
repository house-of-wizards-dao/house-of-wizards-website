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
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <UserPlus className="h-6 w-6 text-violet" />
            <h2 className="text-2xl font-bold text-white">Create New User</h2>
          </div>
          <p className="text-gray-400">
            Add a new user to the platform with admin privileges
          </p>
        </div>

        <div className="border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-600 rounded-xl text-green-200 text-sm">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleCreateUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="user-email"
                >
                  Email *
                </label>
                <input
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-darkviolet rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet transition-colors"
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
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="user-name"
                >
                  Name *
                </label>
                <input
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-darkviolet rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet transition-colors"
                  id="user-name"
                  placeholder="John Doe"
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="user-password"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    required
                    className="w-full px-4 py-3 pr-12 bg-background/50 border border-darkviolet rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet transition-colors"
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="user-role"
                >
                  Role
                </label>
                <select
                  className="w-full px-4 py-3 bg-background/50 border border-darkviolet rounded-xl text-white focus:outline-none focus:border-violet transition-colors"
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
            </div>

            <div className="pt-4">
              <button
                className="w-full bg-violet hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                disabled={creating}
                type="submit"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Creating User...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create New User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
