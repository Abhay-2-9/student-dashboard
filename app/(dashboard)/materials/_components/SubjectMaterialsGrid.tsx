import Link from "next/link";
import { Card } from "../../../_components/ui/Card";
import { MATERIAL_TYPE_ICONS } from "../../../_types/material";

interface SubjectMaterialsGridProps {
  subjects: Array<{
    id: string;
    name: string;
    code: string | null;
    color: string;
    _count: { materials: number };
  }>;
}

export function SubjectMaterialsGrid({ subjects }: SubjectMaterialsGridProps) {
  if (subjects.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <p>No subjects found.</p>
        <p style={{ fontSize: 13 }}>Go to Settings to add subjects first.</p>
      </div>
    );
  }

  return (
    <div className="subject-grid">
      {subjects.map((s) => (
        <Link key={s.id} href={`/materials/${s.id}`} style={{ textDecoration: "none" }}>
          <Card clickable style={{ padding: 20 }}>
            {/* Color bar */}
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: s.color,
                marginBottom: 16,
                opacity: 0.8,
              }}
            />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                {s.code && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                    {s.code}
                  </div>
                )}
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{s.name}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
                  {s._count.materials} material{s._count.materials === 1 ? "" : "s"}
                </p>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius)",
                  background: `${s.color}22`,
                  border: `1px solid ${s.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                📂
              </div>
            </div>

            {/* Quick type indicators */}
            {s._count.materials > 0 && (
              <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                {(Object.entries(MATERIAL_TYPE_ICONS) as [string, string][]).map(([type, icon]) => (
                  <span key={type} style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {icon} {type}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}
