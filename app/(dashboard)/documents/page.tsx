"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "../../_components/layout/Topbar";
import { DocumentUploadForm } from "./_components/DocumentUploadForm";
import { DocumentGrid } from "./_components/DocumentGrid";
import { Card } from "../../_components/ui/Card";
import type { Material as Document } from "../../_types/material";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return (
    <div>
      <Topbar title="Global Documents" subtitle="Manage college-related files and notes" />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Card style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Add Document</h2>
          <DocumentUploadForm onSuccess={loadDocuments} />
        </Card>

        <Card style={{ padding: 24, flex: 1, minHeight: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>
              All Documents
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginLeft: 8 }}>
                ({documents.length})
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: 200 }} />
          ) : (
            <DocumentGrid documents={documents} onDeleteSuccess={loadDocuments} />
          )}
        </Card>
      </div>
    </div>
  );
}
