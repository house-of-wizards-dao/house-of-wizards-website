import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@nextui-org/button";
import type { FileData, UserProfile } from "@/types";

import DefaultLayout from "@/layouts/default";
import AuthForm from "@/components/auth/AuthForm";
import ProfileEditor from "@/components/profile/ProfileEditor";
import FileUpload from "@/components/upload/FileUpload";
import FileGallery from "@/components/gallery/FileGallery";

export default function IndexPage(): JSX.Element {
  // Core state
  const user = useUser();
  const supabase = useSupabaseClient();

  // Profile state
  const [files, setFiles] = useState<FileData[]>([]);
  const [userDescription, setUserDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [twitter, setTwitter] = useState<string>("");
  const [discord, setDiscord] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [editableName, setEditableName] = useState<string>("");

  const getFiles = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    const { data, error } = await supabase.storage
      .from("files")
      .list(user.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      // Error loading files - handled gracefully

      return;
    }

    if (!data) return;

    // Fetch descriptions for these files
    const { data: descData, error: descError } = await supabase
      .from("file_descriptions")
      .select("file_name, description, file_type, created_at")
      .eq("user_id", user.id);

    if (descError) {
      // Error loading file descriptions - using fallback
      setFiles(
        data.map((file) => ({
          ...file,
          description: "",
          fileType: "",
        })),
      );
    } else {
      // Combine file data with descriptions
      const filesWithDesc = data.map((file) => ({
        ...file,
        description:
          descData?.find((desc) => desc.file_name === file.name)?.description ||
          "",
        fileType:
          descData?.find((desc) => desc.file_name === file.name)?.file_type ||
          "",
      }));

      setFiles(filesWithDesc);
    }
  }, [user, supabase]);

  // Initialize user data on mount and user change
  useEffect(() => {
    if (!user) return;

    // Load user files
    getFiles();

    // Set initial editable name
    setEditableName(
      user.user_metadata?.name || user.email?.split("@")[0] || "",
    );

    // Set initial social media from user metadata
    setTwitter(user.user_metadata?.twitter || "");
    setDiscord(user.user_metadata?.discord || "");
    setWebsite(user.user_metadata?.website || "");

    // Fetch and load profile data from database
    const loadProfileData = async (): Promise<void> => {
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("description, twitter, discord, website, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) {
          // If profile doesn't exist, create it
          if (error.code === "PGRST116") {
            await supabase.from("profiles").insert({
              id: user.id,
              email: user.email,
              name:
                user.user_metadata?.name || user.email?.split("@")[0] || "User",
            });
          }
        } else {
          const profile = profileData as UserProfile;
          setUserDescription(profile.description || "");
          setTwitter(profile.twitter || "");
          setDiscord(profile.discord || "");
          setWebsite(profile.website || "");
          setAvatar(profile.avatar_url || "");
        }
      } catch (err) {
        // Error loading profile data - handled gracefully
      }
    };

    loadProfileData();
  }, [user, supabase, getFiles]);

  const signOut = useCallback(async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // Error signing out - handled gracefully
    }
  }, [supabase]);

  const updateUserDescription = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ description: userDescription })
        .eq("id", user.id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      throw err;
    }
  }, [user?.id, userDescription, supabase]);

  const handleAvatarUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = event.target.files?.[0];

      if (!file || !user?.id) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          throw new Error(uploadError.message);
        } else {
          setAvatar(filePath);
          await updateProfile({ avatar: filePath });
        }
      } catch (err) {
        throw err;
      }
    },
    [user?.id, supabase],
  );

  const updateProfile = useCallback(
    async ({ avatar }: { avatar: string }): Promise<void> => {
      if (!user?.id) return;

      try {
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: avatar })
          .eq("id", user.id);

        if (error) throw error;
      } catch (error) {
        throw error;
      }
    },
    [user?.id, supabase],
  );

  const deleteContent = useCallback(
    async (file: FileData): Promise<void> => {
      if (!user?.id) return;

      try {
        const { error } = await supabase.storage
          .from("files")
          .remove([`${user.id}/${file.name}`]);

        if (error) {
          throw new Error(error.message);
        }

        // Remove the file from state
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

        // Delete the description
        const { error: descError } = await supabase
          .from("file_descriptions")
          .delete()
          .match({ user_id: user.id, file_name: file.name });

        if (descError) {
          // Error deleting file description - handled gracefully
        }
      } catch (err) {
        throw err;
      }
    },
    [user?.id, supabase],
  );

  const updateSocialMedia = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ twitter, discord, website })
        .eq("id", user.id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      throw err;
    }
  }, [user?.id, twitter, discord, website, supabase]);

  const updateUserName = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      // Update the user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: editableName },
      });

      if (authError) throw authError;

      // Also update the name in the profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ name: editableName })
        .eq("id", user.id);

      if (profileError) throw profileError;
    } catch (error) {
      throw error;
    }
  }, [user?.id, editableName, supabase]);

  return (
    <DefaultLayout>
      <div className="min-h-screen">
        {user === null ? (
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md">
              <AuthForm />
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-h-screen">
            {/* Header Section */}
            <header className="sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-end h-16">
                  <Button
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 transition-all duration-200"
                    size="sm"
                    variant="bordered"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-8">
                {/* Profile Section */}
                <section className="p-2">
                  <div className="flex items-center space-x-4 mb-6">
                    <h2 className="text-white text-2xl font-bold">
                      Profile Settings
                    </h2>
                  </div>
                  <ProfileEditor
                    avatar={avatar}
                    discord={discord}
                    editableName={editableName}
                    setAvatar={setAvatar}
                    setDiscord={setDiscord}
                    setEditableName={setEditableName}
                    setTwitter={setTwitter}
                    setUserDescription={setUserDescription}
                    setWebsite={setWebsite}
                    twitter={twitter}
                    userDescription={userDescription}
                    website={website}
                    onAvatarUpload={handleAvatarUpload}
                    onDescriptionUpdate={updateUserDescription}
                    onNameUpdate={updateUserName}
                    onSocialUpdate={updateSocialMedia}
                  />
                </section>

                {/* File Upload Section */}
                <section className="p-2">
                  <div className="flex items-center space-x-4 mb-6">
                    <h2 className="text-white text-2xl font-bold">
                      Upload Artwork
                    </h2>
                  </div>
                  <FileUpload onUploadComplete={getFiles} />
                </section>

                {/* File Gallery Section */}
                <section className="p-2">
                  <div className="flex items-center space-x-4 mb-6">
                    <h2 className="text-white text-2xl font-bold">
                      Your Gallery
                    </h2>
                    {files.length > 0 && (
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {files.length} {files.length === 1 ? "file" : "files"}
                      </span>
                    )}
                  </div>
                  <FileGallery files={files} onDeleteFile={deleteContent} />
                </section>
              </div>
            </main>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
