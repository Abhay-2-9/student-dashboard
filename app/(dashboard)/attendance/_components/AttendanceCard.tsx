import Link from "next/link";
import { ProgressRing } from "../../../_components/ui/ProgressRing";
import { AttendanceBadge } from "./AttendanceBadge";
import type { SubjectAttendanceSummary } from "../../../_types/attendance";

interface AttendanceCardProps {
  summary: SubjectAttendanceSummary;
}

export function AttendanceCard({ summary }: AttendanceCardProps) {
  const { subjectId, subjectName, subjectCode, subjectColor, stats } = summary;
  const status =
    stats.percentage >= stats.target
      ? "safe"
      : stats.percentage >= stats.target - 10
      ? "warning"
      : "critical";

  return (
    <Link href={`/attendance/${subjectId}`} style={{ textDecoration: "none" }}>
      <div
        className="card card-clickable"
        style={{ padding: 20 }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                className="color-dot"
                style={{ background: subjectColor }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {subjectCode ?? "—"}
              </span>
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {subjectName}
            </h3>
          </div>
          <ProgressRing
            percentage={stats.total === 0 ? 0 : stats.percentage}
            size={72}
            strokeWidth={7}
            status={status}
            label={stats.total === 0 ? "—" : `${stats.percentage}%`}
          />
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          {[
            { label: "Classes", value: stats.total },
            { label: "Attended", value: stats.attended },
            { label: "Missed", value: stats.absent },
          ].map(({ label, value }) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontWeight: 500 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <AttendanceBadge stats={stats} />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {stats.total === 0 ? "No classes yet" : `Target: ${stats.target}%`}
          </span>
        </div>
      </div>
    </Link>
  );
}
