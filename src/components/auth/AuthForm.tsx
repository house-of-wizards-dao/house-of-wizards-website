import React, { useState, useCallback } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

import { sanitizeString, sanitizeEmail } from "@/lib/sanitization";
import { useToast } from "@/hooks/useToast";
import { EyeSlashFilledIcon } from "../EyeSlashFilledIcon";
import { EyeFilledIcon } from "../EyeFilledIcon";

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const supabase = useSupabaseClient();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const toggleVisibility = useCallback(
    (): void => setIsVisible((prev) => !prev),
    [],
  );

  const signInWithEmail = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });

      if (error) {
        showError(error.message, "Sign In Error");
        return;
      }

      if (!data.user) return;

      // Get user data including role
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (!userError && userData) {
        // Redirect admin users to admin panel
        if (userData.role === "admin") {
          router.push("/admin");
        }
      }

      // Profile is automatically created by database trigger
      // No manual profile creation needed here

      success("Successfully signed in!", "Welcome!");
      onSuccess?.();
    } catch (err) {
      showError(
        "An unexpected error occurred during sign in.",
        "Sign In Error",
      );
    } finally {
      setIsLoading(false);
    }
  }, [email, password, supabase, router, onSuccess, success, showError]);

  const signUpWithEmail = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(email);
      const sanitizedName = sanitizeString(name, 100);

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: password,
        options: {
          data: {
            name: sanitizedName,
          },
        },
      });

      if (error) {
        showError(error.message, "Sign Up Error");
        return;
      }

      if (!data.user) return;

      // Profile is automatically created by database trigger
      // No manual profile creation needed here

      success(
        "Account created successfully! Please check your email for verification.",
        "Sign Up Successful",
      );
    } catch (err) {
      showError(
        "An unexpected error occurred during sign up.",
        "Sign Up Error",
      );
    } finally {
      setIsLoading(false);
    }
  }, [email, password, name, supabase, success, showError]);

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
        <p className="text-gray-400">
          Sign in to your account or create a new one
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex gap-1 bg-gray-700/50 rounded-lg p-1">
          <button
            aria-label="Switch to sign in form"
            className={`px-6 py-2 rounded-md transition-all duration-200 font-medium ${
              activeTab === "signin"
                ? "bg-purple-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>
          <button
            aria-label="Switch to sign up form"
            className={`px-6 py-2 rounded-md transition-all duration-200 font-medium ${
              activeTab === "signup"
                ? "bg-purple-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>
      </div>

      {activeTab === "signin" ? (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Sign In</h2>
            <p className="text-gray-400 text-sm">
              Welcome back! Please sign in to continue.
            </p>
          </div>
          <div className="space-y-4">
            <Input
              aria-label="Email address"
              classNames={{
                input: "bg-gray-800/50 border-gray-600 text-white",
                inputWrapper:
                  "bg-gray-800/50 border-gray-600 hover:border-purple-500 focus-within:border-purple-500",
              }}
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              aria-label="Password"
              classNames={{
                input: "bg-gray-800/50 border-gray-600 text-white",
                inputWrapper:
                  "bg-gray-800/50 border-gray-600 hover:border-purple-500 focus-within:border-purple-500",
              }}
              endContent={
                <button
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  className="focus:outline-none focus:ring-2 focus:ring-purple-500 focus:rounded"
                  type="button"
                  onClick={toggleVisibility}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleVisibility();
                    }
                  }}
                  tabIndex={0}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-gray-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-gray-400 pointer-events-none" />
                  )}
                </button>
              }
              label="Password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium"
              disabled={isLoading}
              size="lg"
              onClick={signInWithEmail}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm">
              Join our community of artists and creators.
            </p>
          </div>
          <div className="space-y-4">
            <Input
              aria-label="Full name"
              classNames={{
                input: "bg-gray-800/50 border-gray-600 text-white",
                inputWrapper:
                  "bg-gray-800/50 border-gray-600 hover:border-purple-500 focus-within:border-purple-500",
              }}
              label="Name"
              placeholder="Enter your name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              aria-label="Email address"
              classNames={{
                input: "bg-gray-800/50 border-gray-600 text-white",
                inputWrapper:
                  "bg-gray-800/50 border-gray-600 hover:border-purple-500 focus-within:border-purple-500",
              }}
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              aria-label="Password"
              classNames={{
                input: "bg-gray-800/50 border-gray-600 text-white",
                inputWrapper:
                  "bg-gray-800/50 border-gray-600 hover:border-purple-500 focus-within:border-purple-500",
              }}
              endContent={
                <button
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  className="focus:outline-none focus:ring-2 focus:ring-purple-500 focus:rounded"
                  type="button"
                  onClick={toggleVisibility}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleVisibility();
                    }
                  }}
                  tabIndex={0}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-gray-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-gray-400 pointer-events-none" />
                  )}
                </button>
              }
              label="Password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium"
              disabled={isLoading}
              size="lg"
              onClick={signUpWithEmail}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
