"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "../../../../_components/ui/Card";
import { AttendanceStatsPanel } from "../_components/AttendanceStats";
import { ClassLogForm } from "../_components/ClassLogForm";
import { ClassHistoryTable } from "../_components/ClassHistoryTable";
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
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);

  const reload = useCallback(async () => {
    const res = await fetch(`/api/attendance?subjectId=${subjectId}`);
    if (res.ok) {
      const data = await res.json() as AttendanceRecord[];
      setRecords(data);
    }
  }, [subjectId]);

  const attended = records.filter((r) => r.status === "PRESENT").length;
  const stats = calculateAttendanceStats(attended, records.length, target);

  function removeRecord(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
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

      {/* Log a class */}
      <Card style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Mark a Class</h2>
        <ClassLogForm subjectId={subjectId} onSuccess={reload} />
      </Card>

      {/* History */}
      <Card style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Class History
          <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginLeft: 8 }}>
            ({records.length} class{records.length === 1 ? "" : "es"})
          </span>
        </h2>
        <ClassHistoryTable records={records} onDelete={removeRecord} />
      </Card>
    </div>
  );
}
