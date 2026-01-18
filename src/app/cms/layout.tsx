"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ShieldAlert, LogIn } from "lucide-react";

import { useCMSUser } from "@/hooks/useCMSUser";

export default function CMSLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated, hasCMSAccess, user } = useCMSUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="secondary" />
        <p className="text-neutral-400">Loading CMS...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <LogIn className="w-16 h-16 text-brand-500/50" />
        <div className="text-center">
          <h1 className="text-2xl font-heading text-neutral-100 mb-2">
            Connect Your Wallet
          </h1>
          <p className="text-neutral-400 max-w-md">
            You need to connect your wallet to access the CMS.
          </p>
        </div>
        <ConnectButton />
      </div>
    );
  }

  if (!hasCMSAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <ShieldAlert className="w-16 h-16 text-red-500/50" />
        <div className="text-center">
          <h1 className="text-2xl font-heading text-neutral-100 mb-2">
            Access Denied
          </h1>
          <p className="text-neutral-400 max-w-md">
            Your wallet is not authorized to access the CMS. Contact an
            administrator if you believe this is an error.
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* CMS Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-heading text-brand-400">CMS</h1>
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/cms")}
                  className="px-3 py-1.5 text-sm text-neutral-300 hover:text-brand-400 hover:bg-neutral-800 rounded-md transition-colors"
                >
                  News
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => router.push("/cms/users")}
                    className="px-3 py-1.5 text-sm text-neutral-300 hover:text-brand-400 hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    Users
                  </button>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-500 uppercase">
                {user?.role}
              </span>
              <ConnectButton
                chainStatus="none"
                showBalance={false}
                accountStatus="avatar"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CMS Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">{children}</main>
    </div>
  );
}
