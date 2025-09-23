import { create } from "zustand";
import { persist } from "zustand/middleware";
// Supabase removed: use a minimal user shape or null
type User = null | { id?: string };
import type { UserProfile } from "@/types";

interface AuthState {
  user: User;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;

  // Computed values
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: false,
      error: null,

      get isAuthenticated() {
        return !!get().user;
      },

      get isAdmin() {
        return get().profile?.role === "admin";
      },

      setUser: (user) => set({ user, error: null }),

      setProfile: (profile) => set({ profile }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      signOut: () =>
        set({
          user: null,
          profile: null,
          error: null,
          isLoading: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        // Only persist profile data, not user session
        profile: state.profile,
      }),
    },
  ),
);

// Selectors for better performance
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    profile: store.profile,
    isAuthenticated: store.isAuthenticated,
    isAdmin: store.isAdmin,
    isLoading: store.isLoading,
    error: store.error,
  };
};

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    setUser: store.setUser,
    setProfile: store.setProfile,
    setLoading: store.setLoading,
    setError: store.setError,
    signOut: store.signOut,
  };
};
