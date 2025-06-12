import React, { useState } from "react";
import { Trash2, Search, File, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import { Profile } from "@/types";

const CDNURL =
  "https://wqpyojcwtcuzpmghjwpp.supabase.co/storage/v1/object/public/files/";

interface ContentItem {
  name: string;
  userId: string;
  userName: string;
  description?: string;
  fileType?: string;
}

interface ContentManagementProps {
  content: ContentItem[];
  users: Profile[];
  loading: boolean;
  searchTerm: string;
  selectedUser: string;
  onSearchChange: (term: string) => void;
  onUserFilter: (userId: string) => void;
  onContentDelete: (item: ContentItem) => void;
}

const ContentManagement: React.FC<ContentManagementProps> = ({
  content,
  users,
  loading,
  searchTerm,
  selectedUser,
  onSearchChange,
  onUserFilter,
  onContentDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = selectedUser === "all" || item.userId === selectedUser;

    return matchesSearch && matchesUser;
  });

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContent = filteredContent.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const renderFilePreview = (item: ContentItem) => {
    const fileUrl = `${CDNURL}${item.userId}/${item.name}`;

    if (item.fileType?.startsWith("image/")) {
      return (
        <Image
          alt={item.description || item.name}
          className="w-full h-32 object-cover rounded-lg"
          height={150}
          src={fileUrl}
          unoptimized
          width={150}
        />
      );
    } else if (item.fileType?.startsWith("video/")) {
      return (
        <video
          muted
          className="w-full h-32 object-cover rounded-lg"
          controls={false}
          src={fileUrl}
        />
      );
    } else {
      return (
        <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center">
          <File className="h-8 w-8 text-gray-400" />
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-white"
            placeholder="Search content..."
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-white"
          value={selectedUser}
          onChange={(e) => onUserFilter(e.target.value)}
        >
          <option value="all">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || `User ${user.id.slice(0, 8)}`}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-400">
        Showing {paginatedContent.length} of {filteredContent.length} items
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedContent.map((item, index) => (
          <div
            key={`${item.userId}-${item.name}-${index}`}
            className="bg-gray-800 rounded-lg overflow-hidden group hover:bg-gray-750 transition-colors"
          >
            <div className="relative">
              {renderFilePreview(item)}
              <button
                aria-label={`Delete ${item.name}`}
                className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                onClick={() => onContentDelete(item)}
              >
                <Trash2 className="text-white" size={14} />
              </button>
            </div>

            <div className="p-3">
              <h4
                className="text-white font-medium text-sm truncate"
                title={item.name}
              >
                {item.name}
              </h4>
              <p
                className="text-gray-400 text-xs mt-1 truncate"
                title={item.userName}
              >
                by {item.userName}
              </p>
              {item.description && (
                <p
                  className="text-gray-300 text-xs mt-2 line-clamp-2"
                  title={item.description}
                >
                  {item.description}
                </p>
              )}
              <div className="flex items-center gap-1 mt-2">
                {item.fileType?.startsWith("image/") ? (
                  <ImageIcon className="text-blue-400" size={12} />
                ) : item.fileType?.startsWith("video/") ? (
                  <File className="text-green-400" size={12} />
                ) : (
                  <File className="text-gray-400" size={12} />
                )}
                <span className="text-xs text-gray-500">
                  {item.fileType?.split("/")[0] || "unknown"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50 hover:bg-gray-700"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>

          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50 hover:bg-gray-700"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          >
            Next
          </button>
        </div>
      )}

      {filteredContent.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No content found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
