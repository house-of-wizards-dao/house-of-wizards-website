import React, { useState, useEffect, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Trash2, Eye, EyeOff, Edit2, Save, X } from "lucide-react";
import Image from "next/image";

interface Talent {
  id: string;
  name: string;
  twitter: string;
  discord: string;
  focus: string;
  skillset: string;
  site?: string;
  avatar_url?: string;
  user_id?: string;
  created_at: string;
}

interface TalentManagementProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading: boolean;
}

const getAvatarStorageURL = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL environment variable is not set");
    return "https://placeholder.supabase.co/storage/v1/object/public/talent-avatars/";
  }
  return `${supabaseUrl}/storage/v1/object/public/talent-avatars/`;
};

const TalentManagement: React.FC<TalentManagementProps> = ({
  searchTerm,
  onSearchChange,
  loading,
}) => {
  const supabase = useSupabaseClient();
  const [talents, setTalents] = useState<Talent[]>([]);
  const [expandedTalent, setExpandedTalent] = useState<string | null>(null);
  const [editingTalent, setEditingTalent] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Talent>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchTalents = useCallback(async () => {
    try {
      // Use active_talents view to exclude soft-deleted talents
      const { data, error } = await supabase
        .from("active_talents")
        .select(
          "id, name, twitter_handle, discord_handle, focus, skillset, website_url, avatar_url, user_id, created_at",
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map database fields to interface fields
      const mappedTalents = (data || []).map((talent: any) => ({
        ...talent,
        twitter: talent.twitter_handle || "",
        discord: talent.discord_handle || "",
        site: talent.website_url || "",
      }));

      setTalents(mappedTalents);
    } catch (err: any) {
      setError("Failed to fetch talents");
    }
  }, [supabase]);

  useEffect(() => {
    fetchTalents();
  }, [fetchTalents]);

  const handleDelete = async (talentId: string, talentName: string) => {
    if (
      !confirm(
        `⚠️ PERMANENT DELETE: Are you sure you want to permanently delete "${talentName}" from the talent board? This will completely remove the talent record and avatar from the database. This action CANNOT be undone!`,
      )
    ) {
      return;
    }

    try {
      // Use the hard delete function
      const { data, error } = await supabase.rpc("hard_delete_talent", {
        talent_id: talentId,
      });

      console.log("Hard delete talent result:", { data, error });

      if (error) {
        console.error("Hard delete error:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      // The function returns JSON with success/error info
      if (!data || data.success !== true) {
        const errorMsg = data?.error || "Unknown error occurred";
        console.error("Soft delete failed:", data);
        throw new Error(`Delete failed: ${errorMsg}`);
      }

      // Refresh talents list to reflect the change
      await fetchTalents();
      setError(null);
    } catch (err: any) {
      setError("Failed to delete talent: " + (err.message || "Unknown error"));
    }
  };

  const handleEdit = (talent: Talent) => {
    setEditingTalent(talent.id);
    setEditForm({ ...talent });
  };

  const handleSaveEdit = async () => {
    if (!editingTalent || !editForm) return;

    try {
      const { error } = await supabase
        .from("talents")
        .update({
          name: editForm.name,
          twitter_handle: editForm.twitter,
          discord_handle: editForm.discord,
          focus: editForm.focus,
          skillset: editForm.skillset,
          website_url: editForm.site,
        })
        .eq("id", editingTalent);

      if (error) throw error;

      setTalents(
        talents.map((t) =>
          t.id === editingTalent ? { ...t, ...editForm } : t,
        ),
      );

      setEditingTalent(null);
      setEditForm({});
      setError(null);
    } catch (err: any) {
      setError("Failed to update talent");
    }
  };

  const handleCancelEdit = () => {
    setEditingTalent(null);
    setEditForm({});
  };

  const handleToggleExpand = (talentId: string) => {
    setExpandedTalent(expandedTalent === talentId ? null : talentId);
  };

  const filteredTalents = talents.filter(
    (talent) =>
      talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.skillset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (talent.twitter &&
        talent.twitter.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (talent.discord &&
        talent.discord.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">
          Talent Board Management
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {filteredTalents.length} of {talents.length} talents
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-xl text-red-200">
          {error}
          <button
            className="float-right text-red-300 hover:text-white"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search talents by name, focus, skills, or social handles..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-3 bg-background/50 border border-darkviolet rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet transition-colors"
        />
      </div>

      {/* Talents List */}
      <div className="space-y-4">
        {filteredTalents.map((talent) => (
          <div
            key={talent.id}
            className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl hover:border-violet hover:shadow-xl transition-all duration-300"
          >
            {/* Talent Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-background/50 border border-darkviolet">
                  <Image
                    src={
                      talent.avatar_url
                        ? talent.avatar_url.startsWith("http")
                          ? talent.avatar_url
                          : `${getAvatarStorageURL()}${talent.avatar_url}`
                        : "/img/logo.png"
                    }
                    alt={`${talent.name}'s avatar`}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/img/logo.png";
                    }}
                  />
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {talent.name}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <span className="bg-violet/20 text-violet px-2 py-1 rounded-full text-xs">
                      {talent.focus}
                    </span>
                    <span>
                      Added {new Date(talent.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(talent)}
                  className="p-2 text-gray-400 hover:text-violet transition-colors rounded-lg hover:bg-violet/20"
                  title="Edit talent"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleToggleExpand(talent.id)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  title={expandedTalent === talent.id ? "Collapse" : "Expand"}
                >
                  {expandedTalent === talent.id ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(talent.id, talent.name)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/20"
                  title="Delete talent"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedTalent === talent.id && (
              <div className="border-t border-darkviolet p-6 bg-background/30">
                {editingTalent === talent.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-background/50 border border-darkviolet rounded-lg text-white focus:outline-none focus:border-violet transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Focus
                        </label>
                        <select
                          value={editForm.focus || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, focus: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-background/50 border border-darkviolet rounded-lg text-white focus:outline-none focus:border-violet transition-colors"
                        >
                          <option value="Developer">Developer</option>
                          <option value="Artist">Artist</option>
                          <option value="Writer">Writer</option>
                          <option value="Project Manager">
                            Project Manager
                          </option>
                          <option value="Musician + Dev">Musician + Dev</option>
                          <option value="Filmmaker">Filmmaker</option>
                          <option value="Biz Dev">Biz Dev</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Twitter
                        </label>
                        <input
                          type="text"
                          value={editForm.twitter || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              twitter: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-background/50 border border-darkviolet rounded-lg text-white focus:outline-none focus:border-violet transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Discord
                        </label>
                        <input
                          type="text"
                          value={editForm.discord || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              discord: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-background/50 border border-darkviolet rounded-lg text-white focus:outline-none focus:border-violet transition-colors"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          value={editForm.site || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, site: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-background/50 border border-darkviolet rounded-lg text-white focus:outline-none focus:border-violet transition-colors"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Skills & Expertise
                        </label>
                        <textarea
                          value={editForm.skillset || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              skillset: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 bg-background/50 border border-darkviolet rounded-lg text-white focus:outline-none focus:border-violet transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-3 bg-transparent border border-darkviolet text-gray-300 hover:border-violet hover:bg-violet/20 rounded-full transition-all duration-300 flex items-center space-x-2"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-6 py-3 bg-violet hover:bg-violet-600 text-white rounded-full transition-all duration-300 flex items-center space-x-2"
                      >
                        <Save size={16} />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Skills & Expertise
                      </h4>
                      <p className="text-gray-300">{talent.skillset}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {talent.site && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-1">
                            Website
                          </h4>
                          <a
                            href={talent.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet hover:text-violet-400 text-sm break-all"
                          >
                            {talent.site}
                          </a>
                        </div>
                      )}

                      {talent.twitter && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-1">
                            Twitter
                          </h4>
                          <a
                            href={`https://twitter.com/${talent.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet hover:text-violet-400 text-sm"
                          >
                            @{talent.twitter}
                          </a>
                        </div>
                      )}

                      {talent.discord && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-1">
                            Discord
                          </h4>
                          <span className="text-gray-300 text-sm">
                            {talent.discord}
                          </span>
                        </div>
                      )}
                    </div>

                    {talent.user_id && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">
                          User ID
                        </h4>
                        <span className="text-gray-400 text-xs font-mono">
                          {talent.user_id}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTalents.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          {searchTerm
            ? "No talents found matching your search."
            : "No talents found."}
        </div>
      )}
    </div>
  );
};

export default TalentManagement;
