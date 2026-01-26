"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import {
  Save,
  Eye,
  ArrowLeft,
  Upload,
  Image,
  Music,
  Video,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { NewsItem, CreateNewsInput, UpdateNewsInput } from "@/types/cms";
import { useCMSUser } from "@/hooks/useCMSUser";

type NewsFormProps = {
  initialData?: NewsItem;
  isEdit?: boolean;
};

type UploadResponse = {
  success: boolean;
  url: string;
  path: string;
  mediaType: "image" | "audio" | "video";
  markdown: string;
  fileName: string;
  fileSize: number;
};

export const NewsForm = ({ initialData, isEdit = false }: NewsFormProps) => {
  const router = useRouter();
  const { user } = useCMSUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [text, setText] = useState(initialData?.text ?? "");
  const [author, setAuthor] = useState(
    initialData?.author ?? user?.twitter_handle ?? "",
  );
  const [date, setDate] = useState(
    initialData?.date ?? new Date().toISOString().split("T")[0],
  );
  const [highlight, setHighlight] = useState(initialData?.highlight ?? false);
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status ?? "draft",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!text.trim()) {
      setError("Content is required");
      return;
    }

    if (!author.trim()) {
      setError("Author is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateNewsInput | UpdateNewsInput = {
        text: text.trim(),
        title: title.trim() || undefined,
        author: author.trim(),
        date,
        highlight,
        status,
      };

      const url = isEdit ? `/api/cms/news/${initialData?.id}` : "/api/cms/news";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to save");
      }

      router.push("/cms");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to upload");
      }

      const data: UploadResponse = await response.json();

      // Insert markdown at cursor position or at end
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText =
          text.substring(0, start) +
          "\n" +
          data.markdown +
          "\n" +
          text.substring(end);
        setText(newText);

        // Move cursor after the inserted markdown
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + data.markdown.length + 2;
          textarea.focus();
        }, 0);
      } else {
        // Fallback: append to end
        setText(text + "\n" + data.markdown + "\n");
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/cms")}
            className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-heading text-neutral-100">
            {isEdit ? "Edit Post" : "New Post"}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-300 hover:text-brand-400 hover:bg-neutral-800 rounded-md transition-colors"
        >
          <Eye className="w-4 h-4" />
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      <div
        className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "grid-cols-1"}`}
      >
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Title{" "}
              <span className="text-neutral-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title..."
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-neutral-300"
              >
                Content <span className="text-red-400">*</span>
                <span className="text-neutral-500 font-normal ml-2">
                  (Markdown supported)
                </span>
              </label>

              {/* Media Upload Button */}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,audio/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={triggerFileUpload}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md transition-colors disabled:opacity-50"
                  title="Upload image, audio, or video"
                >
                  {isUploading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  Upload Media
                </button>
              </div>
            </div>

            {uploadError && (
              <div className="mb-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                {uploadError}
              </div>
            )}

            {/* Media type hints */}
            <div className="flex items-center gap-4 mb-2 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Image className="w-3 h-3" /> Images (10MB)
              </span>
              <span className="flex items-center gap-1">
                <Music className="w-3 h-3" /> Audio (50MB)
              </span>
              <span className="flex items-center gap-1">
                <Video className="w-3 h-3" /> Video (50MB)
              </span>
            </div>

            <textarea
              ref={textareaRef}
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your content here..."
              rows={12}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 font-mono text-sm"
            />
          </div>

          {/* Author & Date Row */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Author Handle <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Status & Highlight Row */}
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Status
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    status === "draft"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    status === "published"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700"
                  }`}
                >
                  Published
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Featured
              </label>
              <button
                type="button"
                onClick={() => setHighlight(!highlight)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  highlight
                    ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                    : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700"
                }`}
              >
                {highlight ? "Highlighted" : "Normal"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4 border-t border-neutral-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Spinner size="sm" color="white" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEdit ? "Save Changes" : "Create Post"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/cms")}
              className="px-4 py-2.5 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Preview */}
        {showPreview && (
          <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6">
            <h3 className="text-sm font-medium text-neutral-500 uppercase mb-4">
              Preview
            </h3>
            <article className="prose prose-invert prose-sm max-w-none">
              {title && (
                <h2 className="text-xl font-heading text-neutral-100 mb-3">
                  {title}
                </h2>
              )}
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                <span>{author || "@author"}</span>
                <span>•</span>
                <span>{date}</span>
                {highlight && (
                  <>
                    <span>•</span>
                    <span className="text-brand-400">Featured</span>
                  </>
                )}
              </div>
              <div className="text-neutral-300 [&_img]:rounded-lg [&_img]:max-w-full [&_audio]:w-full [&_video]:w-full [&_video]:rounded-lg">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {text || "*No content yet...*"}
                </ReactMarkdown>
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};
