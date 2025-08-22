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

  const handleAvatarUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = event.target.files?.[0];

      if (!file || !user?.id) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      try {
        console.log("Starting avatar upload...", {
          filePath,
          fileName,
          fileSize: file.size,
        });

        const { data, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, { upsert: true });

        console.log("Upload result:", { data, uploadError });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          alert(`Upload failed: ${uploadError.message}`);
          throw new Error(uploadError.message);
        } else {
          console.log("Upload successful, updating profile...");

          // Get the public URL for the uploaded file
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

          const publicUrl = urlData.publicUrl;
          console.log("Public URL:", publicUrl);

          setAvatar(publicUrl);
          await updateProfile({ avatar: publicUrl });
          alert("Avatar uploaded successfully!");
        }
      } catch (err) {
        console.error("Avatar upload failed:", err);
        alert(
          `Avatar upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        throw err;
      }
    },
    [user?.id, supabase, updateProfile],
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
              {/* Welcome Section */}
              <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-heading">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-brand">House of Wizards</span>
                </h1>
                <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                  Set up your profile, showcase your art, and join our magical community
                </p>
              </div>

              {/* Responsive Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column - Profile & Upload */}
                <div className="lg:col-span-5 space-y-8">
                  {/* Profile Section */}
                  <section className="group">
                    <div className="bg-gradient-card backdrop-blur-sm border border-brand-500/20 rounded-3xl p-8 transition-all duration-300 hover:border-brand-500/40 hover:shadow-brand">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-2 h-8 bg-gradient-brand rounded-full"></div>
                        <div>
                          <h2 className="text-white text-2xl font-bold font-heading">
                            Profile Settings
                          </h2>
                          <p className="text-neutral-400 text-sm mt-1">
                            Customize your wizard identity
                          </p>
                        </div>
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
                    </div>
                  </section>

                  {/* Upload Section */}
                  <section className="group">
                    <div className="bg-gradient-card backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8 transition-all duration-300 hover:border-accent-400/40 hover:shadow-lg">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-2 h-8 bg-gradient-accent rounded-full"></div>
                        <div>
                          <h2 className="text-white text-2xl font-bold font-heading">
                            Upload Artwork
                          </h2>
                          <p className="text-neutral-400 text-sm mt-1">
                            Share your magical creations
                          </p>
                        </div>
                      </div>
                      <FileUpload onUploadComplete={getFiles} />
                    </div>
                  </section>
                </div>

                {/* Right Column - Gallery */}
                <div className="lg:col-span-7">
                  <section className="group h-full">
                    <div className="bg-gradient-card backdrop-blur-sm border border-neutral-700/50 rounded-3xl p-8 transition-all duration-300 hover:border-neutral-600/50 hover:shadow-lg h-full min-h-[600px] flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-8 bg-gradient-to-b from-brand-500 to-accent-400 rounded-full"></div>
                          <div>
                            <h2 className="text-white text-2xl font-bold font-heading">
                              Your Gallery
                            </h2>
                            <p className="text-neutral-400 text-sm mt-1">
                              Your magical collection
                            </p>
                          </div>
                        </div>
                        {files.length > 0 && (
                          <div className="flex items-center gap-3">
                            <div className="bg-brand-500/20 text-brand-400 px-4 py-2 rounded-xl border border-brand-500/30 text-sm font-medium">
                              {files.length} {files.length === 1 ? "artwork" : "artworks"}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        {files.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="w-24 h-24 bg-gradient-brand rounded-full flex items-center justify-center mb-6 opacity-60">
                              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 font-heading">
                              No artwork yet
                            </h3>
                            <p className="text-neutral-400 max-w-sm">
                              Upload your first magical creation to start building your gallery
                            </p>
                          </div>
                        ) : (
                          <div className="h-full overflow-y-auto custom-scrollbar">
                            <FileGallery files={files} onDeleteFile={deleteContent} />
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-16 flex justify-center">
                <div className="flex items-center gap-4 bg-neutral-900/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      editableName ? 'bg-brand-500' : 'bg-neutral-600'
                    }`}></div>
                    <span className="text-sm text-neutral-400">Profile</span>
                  </div>
                  <div className="w-px h-4 bg-neutral-700"></div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      files.length > 0 ? 'bg-accent-400' : 'bg-neutral-600'
                    }`}></div>
                    <span className="text-sm text-neutral-400">Artwork</span>
                  </div>
                  <div className="w-px h-4 bg-neutral-700"></div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      (twitter || discord || website) ? 'bg-info' : 'bg-neutral-600'
                    }`}></div>
                    <span className="text-sm text-neutral-400">Social</span>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
