"use client";

import { useState } from "react";
import { Card } from "../../../_components/ui/Card";
import { Button } from "../../../_components/ui/Button";
import { Modal } from "../../../_components/ui/Modal";
import { formatDate, formatFileSize, truncate } from "../../../_lib/utils";
import { MATERIAL_TYPE_ICONS, MATERIAL_TYPE_LABELS } from "../../../_types/material";
import type { Material as Document } from "../../../_types/material";

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [noteOpen, setNoteOpen] = useState(false);
  const icon = MATERIAL_TYPE_ICONS[document.type as keyof typeof MATERIAL_TYPE_ICONS];
  const label = MATERIAL_TYPE_LABELS[document.type as keyof typeof MATERIAL_TYPE_LABELS];

  return (
    <>
      <Card style={{ padding: 16 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={document.title}
              >
                {document.title}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>
                {label}
                {document.fileSize && ` · ${formatFileSize(document.fileSize)}`}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(document.id)}
            style={{ color: "var(--danger)", padding: "2px 6px", flexShrink: 0, fontSize: 16 }}
          >
            ×
          </Button>
        </div>

        {/* Content */}
        {document.type === "NOTE" && document.content && (
          <div style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 8 }}>
              {truncate(document.content, 120)}
            </p>
            <button
              onClick={() => setNoteOpen(true)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontSize: 12,
                color: "var(--accent)",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4
              }}
            >
              View Note →
            </button>
          </div>
        )}

        {/* Action */}
        {document.url && document.type !== "NOTE" && (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              color: "var(--accent)",
              fontWeight: 500,
            }}
          >
            {document.type === "LINK" ? "Open Link ↗" : "View File →"}
          </a>
        )}

        <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-muted)" }}>
          Added {formatDate(document.createdAt)}
        </div>
      </Card>

      <Modal open={noteOpen} onClose={() => setNoteOpen(false)} title={document.title}>
        <div 
          style={{ 
            fontSize: 14, 
            color: "var(--text-primary)", 
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            maxHeight: "60vh",
            overflowY: "auto",
            padding: "4px 4px 4px 0",
            wordBreak: "break-word"
          }}
        >
          {document.content}
        </div>
      </Modal>
    </>
  );
}
