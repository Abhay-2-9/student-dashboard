"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../_components/ui/Button";
import { Modal } from "../../../_components/ui/Modal";
import { useToast } from "../../../_components/ui/Toast";
import { formatDate } from "../../../_lib/utils";
import type { AttendanceRecord } from "../../../_types/attendance";

interface ClassHistoryTableProps {
  records: AttendanceRecord[];
  onDelete: (id: string) => void;
}

export function ClassHistoryTable({ records, onDelete }: ClassHistoryTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/attendance/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("Record deleted", "success");
      onDelete(id);
      router.refresh();
    } catch {
      toast("Failed to delete record", "error");
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  }

  if (records.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p>No classes recorded yet.</p>
        <p style={{ fontSize: 13 }}>Use the form above to start tracking attendance.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Status</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, idx) => (
              <tr key={record.id}>
                <td style={{ color: "var(--text-muted)", width: 40 }}>
                  {records.length - idx}
                </td>
                <td style={{ fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {formatDate(record.date)}
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: record.sessionType === "LAB" ? "var(--accent-light)" : "var(--bg-overlay)",
                      color: record.sessionType === "LAB" ? "var(--accent)" : "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      {record.sessionType}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 10px",
                      borderRadius: 99,
                      fontSize: 12,
                      fontWeight: 700,
                      background: record.status === "PRESENT" ? "var(--safe-light)" : "var(--danger-light)",
                      color: record.status === "PRESENT" ? "var(--safe)" : "var(--danger)",
                    }}
                  >
                    {record.status === "PRESENT" ? "✓ Present" : "✕ Absent"}
                  </span>
                </td>
                <td style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {record.note ?? "—"}
                </td>
                <td style={{ textAlign: "right", width: 80 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmId(record.id)}
                    style={{ color: "var(--danger)", padding: "4px 8px" }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Delete Record"
      >
        <p style={{ marginBottom: 20, color: "var(--text-secondary)" }}>
          Are you sure you want to delete this attendance record? This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleting !== null}
            onClick={() => confirmId && handleDelete(confirmId)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
