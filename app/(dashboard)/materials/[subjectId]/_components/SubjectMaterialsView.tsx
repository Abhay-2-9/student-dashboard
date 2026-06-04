"use client";

import { useCallback, useState } from "react";
import { MaterialFilter } from "../../_components/MaterialFilter";
import { MaterialCard } from "../../_components/MaterialCard";
import { MaterialUploadForm } from "../../_components/MaterialUploadForm";
import { Card } from "../../../../_components/ui/Card";
import { useToast } from "../../../../_components/ui/Toast";
import type { Material, MaterialType } from "../../../../_types/material";

type Filter = "ALL" | MaterialType;

interface SubjectMaterialsViewProps {
  subjectId: string;
  initialMaterials: Material[];
}

export function SubjectMaterialsView({ subjectId, initialMaterials }: SubjectMaterialsViewProps) {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [filter, setFilter] = useState<Filter>("ALL");

  const reload = useCallback(async () => {
    const res = await fetch(`/api/materials?subjectId=${subjectId}`);
    if (res.ok) setMaterials(await res.json() as Material[]);
  }, [subjectId]);

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      toast("Material deleted", "success");
    } catch {
      toast("Failed to delete material", "error");
    }
  }

  const filtered = filter === "ALL" ? materials : materials.filter((m) => m.type === filter);

  const counts: Partial<Record<Filter, number>> = {
    ALL: materials.length,
    PDF:   materials.filter((m) => m.type === "PDF").length,
    IMAGE: materials.filter((m) => m.type === "IMAGE").length,
    NOTE:  materials.filter((m) => m.type === "NOTE").length,
    LINK:  materials.filter((m) => m.type === "LINK").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Upload form */}
      <Card style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Add Material</h2>
        <MaterialUploadForm subjectId={subjectId} onSuccess={reload} />
      </Card>

      {/* Materials list */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>
            Materials
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginLeft: 8 }}>
              ({materials.length})
            </span>
          </h2>
          <MaterialFilter active={filter} onChange={setFilter} counts={counts} />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <p>{filter === "ALL" ? "No materials yet." : `No ${filter.toLowerCase()} files yet.`}</p>
          </div>
        ) : (
          <div className="material-grid animate-fade-in">
            {filtered.map((m) => (
              <MaterialCard key={m.id} material={m} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
