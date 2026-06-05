"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../_components/ui/Button";
import { Modal } from "../../../_components/ui/Modal";
import { useToast } from "../../../_components/ui/Toast";
import type { Subject } from "../../../_types/subject";

interface SubjectManagerProps {
  initialSubjects: Subject[];
}

const PRESET_COLORS = [
  "#6366f1","#8b5cf6","#ec4899","#06b6d4","#10b981",
  "#f59e0b","#ef4444","#84cc16","#f97316","#3b82f6",
];

export function SubjectManager({ initialSubjects }: SubjectManagerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Subject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state for add/edit
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);

  function openAdd() {
    setFormName(""); setFormCode(""); setFormColor(PRESET_COLORS[0]);
    setAddOpen(true);
  }

  function openEdit(s: Subject) {
    setFormName(s.name); setFormCode(s.code ?? ""); setFormColor(s.color);
    setEditTarget(s);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, code: formCode || undefined, color: formColor }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json() as Subject;
      setSubjects((prev) => [...prev, created]);
      toast("Subject added", "success");
      setAddOpen(false);
      router.refresh();
    } catch {
      toast("Failed to add subject", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/subjects/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, code: formCode || null, color: formColor }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json() as Subject;
      setSubjects((prev) => prev.map((s) => s.id === updated.id ? updated : s));
      toast("Subject updated", "success");
      setEditTarget(null);
      router.refresh();
    } catch {
      toast("Failed to update subject", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/subjects/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSubjects((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast("Subject deleted", "success");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast("Failed to delete subject", "error");
    } finally {
      setDeleting(false);
    }
  }

  function SubjectForm({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) {
    return (
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Subject Name *
          </label>
          <input id="subject-name" className="input" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Mathematics" required />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Code (optional)
          </label>
          <input id="subject-code" className="input" value={formCode} onChange={(e) => setFormCode(e.target.value)} placeholder="e.g. MATH101" maxLength={20} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Color
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFormColor(c)}
                style={{
                  width: 28, height: 28, borderRadius: "50%", background: c, border: "none", cursor: "pointer",
                  outline: formColor === c ? `3px solid ${c}` : "none",
                  outlineOffset: 2,
                  transform: formColor === c ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.15s ease",
                }}
              />
            ))}
            <input
              id="subject-color-custom"
              type="color"
              value={formColor}
              onChange={(e) => setFormColor(e.target.value)}
              style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid var(--border-strong)", cursor: "pointer", padding: 0, background: "none" }}
              title="Custom color"
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => { setAddOpen(false); setEditTarget(null); }}
          >
            Cancel
          </Button>
          <Button type="submit" loading={saving}>{submitLabel}</Button>
        </div>
      </form>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Subjects</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{subjects.length} subject{subjects.length === 1 ? "" : "s"}</p>
        </div>
        <Button onClick={openAdd} size="sm">+ Add Subject</Button>
      </div>

      {/* Subject list */}
      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>No subjects yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {subjects.map((s) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "var(--bg-surface)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="color-dot" style={{ background: s.color, width: 14, height: 14 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</div>
                {s.code && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.code}</div>}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>Edit</Button>
                <Button variant="ghost" size="sm" style={{ color: "var(--danger)" }} onClick={() => setDeleteTarget(s)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Subject">
        <SubjectForm onSubmit={handleAdd} submitLabel="Add Subject" />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Subject">
        <SubjectForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Subject">
        <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
          Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>{deleteTarget?.name}</strong>?
        </p>
        <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 20 }}>
          ⚠ This will permanently delete all attendance records and materials for this subject.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete Subject</Button>
        </div>
      </Modal>
    </div>
  );
}
