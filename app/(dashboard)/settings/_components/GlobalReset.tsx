"use client";

import { useState } from "react";
import { Button } from "../../../_components/ui/Button";
import { Modal } from "../../../_components/ui/Modal";
import { useToast } from "../../../_components/ui/Toast";

export function GlobalReset() {
  const { toast } = useToast();
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleResetAll() {
    setResetting(true);
    try {
      const res = await fetch("/api/attendance?all=true", { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("All attendance records deleted", "success");
      setResetOpen(false);
    } catch {
      toast("Failed to reset attendance data", "error");
    } finally {
      setResetting(false);
    }
  }

  return (
    <>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--danger)" }}>Danger Zone</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Irreversibly delete all attendance records across all subjects.
        </p>
        <Button variant="danger" onClick={() => setResetOpen(true)}>
          Reset All Attendance Data
        </Button>
      </div>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset All Attendance Data">
        <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
          Are you sure you want to delete <strong style={{ color: "var(--danger)" }}>all attendance records</strong> for every subject?
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>
          This will not delete your subjects or study materials.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button variant="danger" loading={resetting} onClick={handleResetAll}>Delete All Records</Button>
        </div>
      </Modal>
    </>
  );
}
