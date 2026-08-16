import { FileText } from "lucide-react";
import Link from "next/link";

import { fetchPublishedDocuments } from "@/lib/server/documents";
import type { DocumentItem } from "@/types/cms";

type DocumentSection = {
  category: string;
  order: number;
  documents: DocumentItem[];
};

const groupByCategory = (documents: DocumentItem[]): DocumentSection[] => {
  const grouped = new Map<string, DocumentSection>();

  for (const document of documents) {
    const section = grouped.get(document.category) ?? {
      category: document.category,
      order: document.category_order,
      documents: [],
    };
    section.documents.push(document);
    section.order = Math.min(section.order, document.category_order);
    grouped.set(document.category, section);
  }

  return Array.from(grouped.values()).sort(
    (a, b) => a.order - b.order || a.category.localeCompare(b.category),
  );
};

const DocumentsPage = async () => {
  const documents = await fetchPublishedDocuments();
  const sections = groupByCategory(documents);

  return (
    <div className="min-h-screen px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-brand-400">
            House of Wizards DAO
          </p>
          <h1 className="font-heading text-4xl text-neutral-100 sm:text-6xl">
            Documents
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-400 sm:text-lg">
            Proposals, governance resources, and working documents from the
            House of Wizards.
          </p>
        </header>

        {sections.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-neutral-800 bg-neutral-900/40 py-20 text-center">
            <FileText className="mb-4 h-10 w-10 text-brand-500/40" />
            <h2 className="font-heading text-xl text-neutral-200">
              No documents yet
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Published documents will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {sections.map((section) => (
              <section
                key={section.category}
                aria-labelledby={`category-${section.category}`}
              >
                <div className="mb-3 flex items-center gap-4">
                  <h2
                    id={`category-${section.category}`}
                    className="shrink-0 font-heading text-xl text-brand-400 sm:text-2xl"
                  >
                    {section.category}
                  </h2>
                  <div className="h-px w-full bg-gradient-to-r from-neutral-700 to-transparent" />
                </div>

                <div className="space-y-1">
                  {section.documents.map((document) => (
                    <Link
                      key={document.id}
                      href={`/documents/${document.id}`}
                      className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-neutral-200 transition-colors hover:bg-neutral-800/70"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-neutral-500 transition-colors group-hover:text-brand-400" />
                      <h3 className="text-base leading-snug transition-colors group-hover:text-brand-300">
                        {document.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
