"use client";

import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/spinner";
import { use } from "react";

import { DocumentForm } from "@/components/cms/DocumentForm";
import type { DocumentItem } from "@/types/cms";

type PageProps = { params: Promise<{ id: string }> };
type DocumentResponse = { document: DocumentItem };

const fetchDocument = async (id: string): Promise<DocumentResponse> => {
  const response = await fetch(`/api/cms/documents/${id}`);
  if (!response.ok) throw new Error("Failed to fetch document");
  return response.json();
};

const EditDocumentPage = ({ params }: PageProps) => {
  const { id } = use(params);
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms-documents", id],
    queryFn: () => fetchDocument(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Spinner size="lg" color="secondary" />
        <p className="text-neutral-400">Loading document...</p>
      </div>
    );
  }
  if (error || !data?.document) {
    return (
      <p className="py-12 text-center text-red-400">Failed to load document.</p>
    );
  }

  return <DocumentForm initialData={data.document} isEdit />;
};

export default EditDocumentPage;
