import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { PencilIcon } from "@heroicons/react/24/solid";
import { FaTwitter, FaDiscord, FaGlobe } from "react-icons/fa";
import { useUser } from "@supabase/auth-helpers-react";

import { useToast } from "@/hooks/useToast";

const AVATAR_CDN_URL =
  "https://wqpyojcwtcuzpmghjwpp.supabase.co/storage/v1/object/public/avatars/";

interface ProfileEditorProps {
  userDescription: string;
  setUserDescription: (description: string) => void;
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
  twitter: string;
  setTwitter: (twitter: string) => void;
  discord: string;
  setDiscord: (discord: string) => void;
  website: string;
  setWebsite: (website: string) => void;
  editableName: string;
  setEditableName: (name: string) => void;
  onNameUpdate: () => void;
  onDescriptionUpdate: () => void;
  onSocialUpdate: () => void;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileEditor({
  userDescription,
  setUserDescription,
  avatar,
  twitter,
  setTwitter,
  discord,
  setDiscord,
  website,
  setWebsite,
  editableName,
  setEditableName,
  onNameUpdate,
  onDescriptionUpdate,
  onSocialUpdate,
  onAvatarUpload,
}: ProfileEditorProps): JSX.Element {
  // Component state
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  // Hooks
  const user = useUser();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { success, error: showError } = useToast();

  // Event handlers
  const handleNameUpdate = useCallback(async () => {
    try {
      await onNameUpdate();
      setIsEditingName(false);
      success("Name updated successfully!");
    } catch (err) {
      showError("Failed to update name", "Update Error");
    }
  }, [onNameUpdate, success, showError]);

  const handleDescriptionUpdate = useCallback(async () => {
    try {
      await onDescriptionUpdate();
      setIsEditingDescription(false);
      success("Description updated successfully!");
    } catch (err) {
      showError("Failed to update description", "Update Error");
    }
  }, [onDescriptionUpdate, success, showError]);

  const handleSocialUpdate = useCallback(async () => {
    try {
      await onSocialUpdate();
      setIsEditingSocial(false);
      success("Social media updated successfully!");
    } catch (err) {
      showError("Failed to update social media", "Update Error");
    }
  }, [onSocialUpdate, success, showError]);

  // Early return if no user
  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar and Name Section */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          {avatar ? (
            <Image
              alt="User avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/30"
              height={80}
              src={`${AVATAR_CDN_URL}${avatar}`}
              unoptimized
              width={80}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-2 border-purple-500/30 flex items-center justify-center">
              <span className="text-purple-300 text-sm font-medium">
                {user.user_metadata?.name?.[0]?.toUpperCase() ||
                  user.email?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <input
            ref={fileInputRef}
            accept="image/*"
            aria-label="Upload avatar"
            className="hidden"
            type="file"
            onChange={onAvatarUpload}
          />
          <button
            aria-label="Change avatar"
            className="absolute -bottom-1 -right-1 bg-purple-500 hover:bg-purple-600 rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            tabIndex={0}
          >
            <PencilIcon className="h-3 w-3 text-white" />
          </button>
        </div>

        {/* Name and Email */}
        <div className="flex-1 space-y-2">
          {isEditingName ? (
            <div className="space-y-3">
              <Input
                aria-label="Edit your name"
                className="max-w-md"
                classNames={{
                  input: "bg-gray-800/50 border-gray-600 text-white",
                  inputWrapper:
                    "bg-gray-800/50 border-gray-600 hover:border-purple-500 focus-within:border-purple-500",
                }}
                label="Display Name"
                placeholder="Enter your name"
                type="text"
                value={editableName}
                onChange={(e) => setEditableName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400"
                  size="sm"
                  variant="bordered"
                  onClick={handleNameUpdate}
                >
                  Save
                </Button>
                <Button
                  className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400"
                  size="sm"
                  variant="bordered"
                  onClick={() => setIsEditingName(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-white text-xl font-semibold">
                  {user.user_metadata?.name || user.email?.split("@")[0]}
                </h3>
                <button
                  aria-label="Edit name"
                  className="p-1 rounded-md bg-gray-700/50 hover:bg-gray-600/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onClick={() => setIsEditingName(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsEditingName(true);
                    }
                  }}
                  tabIndex={0}
                >
                  <PencilIcon className="h-4 w-4 text-gray-400 hover:text-purple-400" />
                </button>
              </div>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="text-white text-lg font-medium">About</h4>
          <button
            aria-label="Edit description"
            className="p-1 rounded-md bg-gray-700/50 hover:bg-gray-600/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            onClick={() => setIsEditingDescription(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsEditingDescription(true);
              }
            }}
            tabIndex={0}
          >
            <PencilIcon className="h-4 w-4 text-gray-400 hover:text-purple-400" />
          </button>
        </div>

        {isEditingDescription ? (
          <div className="space-y-3">
            <Input
              aria-label="Edit your description"
              className="max-w-lg"
              classNames={{
                input: "bg-gray-800/50 border-gray-600 text-white",
                inputWrapper:
                  "bg-gray-800/50 border-gray-600 hover:border-purple-500 focus-within:border-purple-500",
              }}
              label="Description"
              placeholder="Tell us about yourself..."
              type="text"
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400"
                size="sm"
                variant="bordered"
                onClick={handleDescriptionUpdate}
              >
                Save
              </Button>
              <Button
                className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400"
                size="sm"
                variant="bordered"
                onClick={() => setIsEditingDescription(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed">
            {userDescription || "No description added yet"}
          </p>
        )}
      </div>

      {/* Social Media Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="text-white text-lg font-medium">Social Links</h4>
          <button
            aria-label="Edit social media links"
            className="p-1 rounded-md bg-gray-700/50 hover:bg-gray-600/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            onClick={() => setIsEditingSocial(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsEditingSocial(true);
              }
            }}
            tabIndex={0}
          >
            <PencilIcon className="h-4 w-4 text-gray-400 hover:text-purple-400" />
          </button>
        </div>

        {isEditingSocial ? (
          <div className="space-y-3 max-w-lg">
            <Input
              aria-label="Twitter username"
              classNames={{
                input: "bg-gray-800/50 border-gray-600 text-white",
                inputWrapper:
                  "bg-gray-800/50 border-gray-600 hover:border-purple-500 focus-within:border-purple-500",
              }}
              label="Twitter"
              placeholder="@username"
              startContent={<FaTwitter className="text-blue-400" />}
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
            <Input
              aria-label="Discord username"
              classNames={{
                input: "bg-gray-800/50 border-gray-600 text-white",
                inputWrapper:
                  "bg-gray-800/50 border-gray-600 hover:border-purple-500 focus-within:border-purple-500",
              }}
              label="Discord"
              placeholder="username#1234"
              startContent={<FaDiscord className="text-indigo-400" />}
              type="text"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
            />
            <Input
              aria-label="Website URL"
              classNames={{
                input: "bg-gray-800/50 border-gray-600 text-white",
                inputWrapper:
                  "bg-gray-800/50 border-gray-600 hover:border-purple-500 focus-within:border-purple-500",
              }}
              label="Website"
              placeholder="https://your-website.com"
              startContent={<FaGlobe className="text-green-400" />}
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400"
                size="sm"
                variant="bordered"
                onClick={handleSocialUpdate}
              >
                Save
              </Button>
              <Button
                className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400"
                size="sm"
                variant="bordered"
                onClick={() => setIsEditingSocial(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {twitter && (
              <a
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                href={`https://twitter.com/${twitter}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaTwitter size={16} />
                <span className="text-sm">{twitter}</span>
              </a>
            )}
            {discord && (
              <div
                className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400"
                title={discord}
              >
                <FaDiscord size={16} />
                <span className="text-sm">{discord}</span>
              </div>
            )}
            {website && (
              <a
                className="flex items-center gap-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-colors"
                href={website}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaGlobe size={16} />
                <span className="text-sm truncate max-w-32">
                  {website.replace(/^https?:\/\//, "")}
                </span>
              </a>
            )}
            {!twitter && !discord && !website && (
              <p className="text-gray-400 text-sm">No social links added yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
