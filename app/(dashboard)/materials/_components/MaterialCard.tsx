import { Card } from "../../../_components/ui/Card";
import { Button } from "../../../_components/ui/Button";
import { formatDate, formatFileSize, truncate } from "../../../_lib/utils";
import { MATERIAL_TYPE_ICONS, MATERIAL_TYPE_LABELS } from "../../../_types/material";
import type { Material } from "../../../_types/material";

interface MaterialCardProps {
  material: Material;
  onDelete: (id: string) => void;
}

export function MaterialCard({ material, onDelete }: MaterialCardProps) {
  const icon = MATERIAL_TYPE_ICONS[material.type];
  const label = MATERIAL_TYPE_LABELS[material.type];

  return (
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
              title={material.title}
            >
              {material.title}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>
              {label}
              {material.fileSize && ` · ${formatFileSize(material.fileSize)}`}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(material.id)}
          style={{ color: "var(--danger)", padding: "2px 6px", flexShrink: 0, fontSize: 16 }}
        >
          ×
        </Button>
      </div>

      {/* Content */}
      {material.type === "NOTE" && material.content && (
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 8 }}>
          {truncate(material.content, 120)}
        </p>
      )}

      {/* Action */}
      {material.url && material.type !== "NOTE" && (
        <a
          href={material.url}
          target={material.type === "LINK" ? "_blank" : undefined}
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
          {material.type === "LINK" ? "Open Link ↗" : "View File →"}
        </a>
      )}

      <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-muted)" }}>
        Added {formatDate(material.createdAt)}
      </div>
    </Card>
  );
}
