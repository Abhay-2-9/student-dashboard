"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "../../../../_components/ui/Card";
import { Button } from "../../../../_components/ui/Button";
import { Modal } from "../../../../_components/ui/Modal";
import { useToast } from "../../../../_components/ui/Toast";
import { AttendanceStatsPanel } from "../../_components/AttendanceStats";
import { ClassLogForm } from "../../_components/ClassLogForm";
import { ClassHistoryTable } from "../../_components/ClassHistoryTable";
import { calculateAttendanceStats } from "../../../../_lib/attendance";
import type { AttendanceRecord } from "../../../../_types/attendance";

interface SubjectAttendanceViewProps {
  subjectId: string;
  subjectName: string;
  subjectCode: string | null;
  subjectColor: string;
  target: number;
  initialRecords: AttendanceRecord[];
}

export function SubjectAttendanceView({
  subjectId,
  subjectName,
  subjectCode,
  subjectColor,
  target,
  initialRecords,
}: SubjectAttendanceViewProps) {
  const { toast } = useToast();
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const reload = useCallback(async () => {
    const res = await fetch(`/api/attendance?subjectId=${subjectId}`);
    if (res.ok) {
      const data = await res.json() as AttendanceRecord[];
      setRecords(data);
    }
  }, [subjectId]);

  const attended = records.filter((r) => r.status === "PRESENT").length;
  const stats = calculateAttendanceStats(attended, records.length, target);

  const theoryRecords = records.filter(r => r.sessionType === "THEORY");
  const labRecords = records.filter(r => r.sessionType === "LAB");

  const theoryTotal = theoryRecords.length;
  const theoryAttended = theoryRecords.filter(r => r.status === "PRESENT").length;

  const labTotal = labRecords.length;
  const labAttended = labRecords.filter(r => r.status === "PRESENT").length;

  function removeRecord(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleReset() {
    setResetting(true);
    try {
      const res = await fetch(`/api/attendance?subjectId=${subjectId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("Attendance history reset", "success");
      setRecords([]);
      setResetOpen(false);
    } catch {
      toast("Failed to reset history", "error");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats */}
      <Card style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <span className="color-dot" style={{ background: subjectColor, width: 12, height: 12 }} />
          {subjectName}
          {subjectCode && (
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>· {subjectCode}</span>
          )}
        </h2>
        <AttendanceStatsPanel stats={stats} subjectColor={subjectColor} />
      </Card>

      {/* Theory & Lab Breakdown */}
      <Card style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Session Breakdown</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Theory */}
          <div style={{ background: "var(--bg-overlay)", padding: 16, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              📚 Theory Sessions
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                {theoryAttended}
              </span>
              <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
                / {theoryTotal} attended
              </span>
            </div>
          </div>
          
          {/* Lab */}
          <div style={{ background: "var(--bg-overlay)", padding: 16, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              🔬 Lab Sessions
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                {labAttended}
              </span>
              <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
                / {labTotal} attended
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Log a class */}
      <Card style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Mark a Class</h2>
        <ClassLogForm subjectId={subjectId} onSuccess={reload} />
      </Card>

      {/* History */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>
            Class History
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginLeft: 8 }}>
              ({records.length} class{records.length === 1 ? "" : "es"})
            </span>
          </h2>
          {records.length > 0 && (
            <Button variant="ghost" size="sm" style={{ color: "var(--danger)" }} onClick={() => setResetOpen(true)}>
              Reset History
            </Button>
          )}
        </div>
        <ClassHistoryTable records={records} onDelete={removeRecord} />
      </Card>

      {/* Reset Confirm Modal */}
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset Attendance History">
        <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
          Are you sure you want to delete all attendance records for <strong style={{ color: "var(--text-primary)" }}>{subjectName}</strong>?
        </p>
        <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 20 }}>
          ⚠ This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button variant="danger" loading={resetting} onClick={handleReset}>Reset History</Button>
        </div>
      </Modal>
    </div>
  );
}
