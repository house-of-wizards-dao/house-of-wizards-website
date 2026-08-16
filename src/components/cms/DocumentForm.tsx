"use client";

import { Spinner } from "@nextui-org/spinner";
import { ArrowLeft, Eye, Save, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { useCMSUser } from "@/hooks/useCMSUser";
import type {
  CreateDocumentInput,
  DocumentItem,
  NewsStatus,
  UpdateDocumentInput,
} from "@/types/cms";

type DocumentFormProps = {
  initialData?: DocumentItem;
  isEdit?: boolean;
};

type UploadResponse = { markdown: string };

export const DocumentForm = ({
  initialData,
  isEdit = false,
}: DocumentFormProps) => {
  const router = useRouter();
  const { user } = useCMSUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [categoryOrder, setCategoryOrder] = useState(
    initialData?.category_order ?? 0,
  );
  const [text, setText] = useState(initialData?.text ?? "");
  const [author, setAuthor] = useState(
    initialData?.author ?? user?.twitter_handle ?? "",
  );
  const [date, setDate] = useState(
    initialData?.date ?? new Date().toISOString().split("T")[0],
  );
  const [status, setStatus] = useState<NewsStatus>(
    initialData?.status ?? "draft",
  );
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goBack = () => router.push("/cms/documents");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (
      !title.trim() ||
      !category.trim() ||
      !Number.isInteger(categoryOrder) ||
      categoryOrder < 0 ||
      !text.trim() ||
      !author.trim()
    ) {
      setError(
        "Title, category, a non-negative category order, content, and author are required",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateDocumentInput | UpdateDocumentInput = {
        title: title.trim(),
        category: category.trim(),
        category_order: categoryOrder,
        text: text.trim(),
        author: author.trim(),
        date,
        status,
      };
      const response = await fetch(
        isEdit ? `/api/cms/documents/${initialData?.id}` : "/api/cms/documents",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const result: { error?: string } = await response.json();
        throw new Error(result.error ?? "Failed to save document");
      }

      goBack();
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to save document",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result: { error?: string } = await response.json();
        throw new Error(result.error ?? "Failed to upload media");
      }

      const result: UploadResponse = await response.json();
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? text.length;
      const end = textarea?.selectionEnd ?? text.length;
      const insertedText = `${text.slice(0, start)}\n${result.markdown}\n${text.slice(end)}`;
      setText(insertedText);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const fieldClassName =
    "w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
            aria-label="Back to documents"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="font-heading text-2xl text-neutral-100">
            {isEdit ? "Edit Document" : "New Document"}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview((visible) => !visible)}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-brand-400"
        >
          <Eye className="h-4 w-4" />
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : ""}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm text-neutral-300"
              >
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={fieldClassName}
                placeholder="Document title"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm text-neutral-300"
              >
                Category <span className="text-red-400">*</span>
              </label>
              <input
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={fieldClassName}
                placeholder="e.g. Governance"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Documents with the same category appear in one section.
              </p>
            </div>
            <div>
              <label
                htmlFor="category-order"
                className="mb-2 block text-sm text-neutral-300"
              >
                Category order <span className="text-red-400">*</span>
              </label>
              <input
                id="category-order"
                type="number"
                min={0}
                step={1}
                value={categoryOrder}
                onChange={(event) =>
                  setCategoryOrder(Number(event.target.value))
                }
                className={fieldClassName}
              />
              <p className="mt-1 text-xs text-neutral-500">
                Categories are shown from lowest to highest.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="text" className="text-sm text-neutral-300">
                Content <span className="text-red-400">*</span>
                <span className="ml-2 text-neutral-500">
                  (Markdown supported)
                </span>
              </label>
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,audio/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 disabled:opacity-50"
                >
                  {isUploading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  Upload Media
                </button>
              </>
            </div>
            <textarea
              ref={textareaRef}
              id="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={15}
              className={`${fieldClassName} font-mono text-sm`}
              placeholder="Write the document content..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="author"
                className="mb-2 block text-sm text-neutral-300"
              >
                Author <span className="text-red-400">*</span>
              </label>
              <input
                id="author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className={fieldClassName}
                placeholder="@username or name"
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm text-neutral-300"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={fieldClassName}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Status
            </label>
            <div className="flex gap-2">
              {(["draft", "published"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`rounded-md border px-3 py-1.5 text-sm capitalize ${
                    status === option
                      ? option === "published"
                        ? "border-green-500/30 bg-green-500/20 text-green-400"
                        : "border-yellow-500/30 bg-yellow-500/20 text-yellow-400"
                      : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-neutral-800 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-white transition-colors hover:bg-brand-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Spinner size="sm" color="white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEdit ? "Save Changes" : "Create Document"}
            </button>
            <button
              type="button"
              onClick={goBack}
              className="text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>
          </div>
        </form>

        {showPreview && (
          <aside className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <p className="mb-2 text-xs uppercase tracking-wider text-brand-400">
              {category || "Category"}
            </p>
            <h2 className="font-heading text-3xl text-neutral-100">
              {title || "Document title"}
            </h2>
            <p className="mt-2 text-xs text-neutral-500">
              {author || "Author"} · {date}
            </p>
            <div className="prose prose-invert mt-8 max-w-none text-neutral-300">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {text || "*No content yet...*"}
              </ReactMarkdown>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
