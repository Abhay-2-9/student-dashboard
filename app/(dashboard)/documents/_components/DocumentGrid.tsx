"use client";

import { DocumentCard } from "./DocumentCard";
import { useToast } from "../../../_components/ui/Toast";
import type { Material as Document } from "../../../_types/material";

interface DocumentGridProps {
  documents: Document[];
  onDeleteSuccess: () => void;
}

export function DocumentGrid({ documents, onDeleteSuccess }: DocumentGridProps) {
  const { toast } = useToast();

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("Document deleted", "success");
      onDeleteSuccess();
    } catch {
      toast("Failed to delete document", "error");
    }
  }

  if (documents.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📄</div>
        <p>No documents found.</p>
        <p style={{ fontSize: 13 }}>Upload a file, add a link, or write a note above.</p>
      </div>
    );
  }

  return (
    <div className="material-grid">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
      ))}
    </div>
  );
}
