import { ProgressRing } from "../../../_components/ui/ProgressRing";
import { Card } from "../../../_components/ui/Card";
import type { AttendanceStats } from "../../../_types/attendance";

interface AttendanceStatsProps {
  stats: AttendanceStats;
  subjectColor: string;
}

export function AttendanceStatsPanel({ stats, subjectColor }: AttendanceStatsProps) {
  const status =
    stats.percentage >= stats.target
      ? "safe"
      : stats.percentage >= stats.target - 10
      ? "warning"
      : "critical";

  const statusColor =
    status === "safe"
      ? "var(--safe)"
      : status === "warning"
      ? "var(--warning)"
      : "var(--danger)";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center" }}>
      {/* Ring */}
      <ProgressRing
        percentage={stats.total === 0 ? 0 : stats.percentage}
        size={120}
        strokeWidth={10}
        status={status}
        label={stats.total === 0 ? "—" : `${stats.percentage}%`}
        sublabel={stats.total === 0 ? "" : "attended"}
      />

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Stat row */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "Total Classes", value: stats.total, color: "var(--text-primary)" },
            { label: "Attended",      value: stats.attended, color: "var(--safe)" },
            { label: "Missed",        value: stats.absent,   color: "var(--danger)" },
            { label: "Target",        value: `${stats.target}%`, color: "var(--text-secondary)" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Threshold insight */}
        {stats.total > 0 && (
          <Card
            style={{
              padding: "12px 16px",
              background: status === "safe" ? "var(--safe-light)" : status === "warning" ? "var(--warning-light)" : "var(--danger-light)",
              border: `1px solid ${statusColor}30`,
              marginTop: 4,
            }}
          >
            {stats.isSafe ? (
              <p style={{ fontSize: 14, color: statusColor, fontWeight: 500, margin: 0 }}>
                <strong>✓ You&apos;re safe.</strong>{" "}
                {stats.canMiss === Infinity
                  ? "You have not missed any classes yet."
                  : `You can miss up to ${stats.canMiss} more class${stats.canMiss === 1 ? "" : "es"} and stay above ${stats.target}%.`}
              </p>
            ) : (
              <p style={{ fontSize: 14, color: statusColor, fontWeight: 500, margin: 0 }}>
                <strong>
                  {status === "warning" ? "⚠ Warning." : "✕ Critical."}
                </strong>{" "}
                You must attend the next{" "}
                <strong>{stats.mustAttend} consecutive class{stats.mustAttend === 1 ? "" : "es"}</strong>{" "}
                to recover to {stats.target}%.
              </p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
