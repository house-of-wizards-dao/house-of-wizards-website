import { Calendar, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { fetchPublishedDocumentById } from "@/lib/server/documents";

type PageProps = { params: Promise<{ id: string }> };

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

const DocumentPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const documentId = Number.parseInt(id, 10);
  if (Number.isNaN(documentId)) notFound();

  const document = await fetchPublishedDocumentById(documentId);
  if (!document) notFound();

  return (
    <div className="min-h-screen px-4 py-12 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/documents"
          className="mb-10 inline-flex text-sm text-brand-400 hover:text-brand-300"
        >
          ← Back to documents
        </Link>

        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-400">
          {document.category}
        </p>
        <h1 className="font-heading text-4xl leading-tight text-neutral-100 sm:text-6xl">
          {document.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-5 border-b border-neutral-800 pb-8 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={document.date}>{formatDate(document.date)}</time>
          </span>
          <span className="inline-flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            {document.author}
          </span>
        </div>

        <div className="document-content prose-invert mt-10 max-w-none text-neutral-300">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {document.text}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default DocumentPage;
