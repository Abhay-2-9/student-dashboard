import Link from "next/link";
import { prisma } from "../_lib/prisma";
import { calculateAttendanceStats } from "../_lib/attendance";
import { Topbar } from "../_components/layout/Topbar";
import { Card } from "../_components/ui/Card";
import { Badge } from "../_components/ui/Badge";
import { ProgressRing } from "../_components/ui/ProgressRing";
import { formatDate } from "../_lib/utils";

export const metadata = { title: "Overview — Student Dashboard" };

export default async function OverviewPage() {
  const [subjects, settings, recentRecords, totalMaterials] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { createdAt: "asc" },
      include: { attendance: true },
    }),
    prisma.settings.findUnique({ where: { id: "singleton" } }),
    prisma.attendanceRecord.findMany({
      orderBy: { date: "desc" },
      take: 8,
      include: { subject: { select: { id: true, name: true, color: true } } },
    }),
    prisma.material.count(),
  ]);

  const target = settings?.targetAttendance ?? 75;

  const summaries = subjects.map((s) => {
    const attended = s.attendance.filter((r) => r.status === "PRESENT").length;
    return { ...s, attended, total: s.attendance.length, stats: calculateAttendanceStats(attended, s.attendance.length, target) };
  });

  const totalClasses = summaries.reduce((n, s) => n + s.total, 0);
  const totalAttended = summaries.reduce((n, s) => n + s.attended, 0);
  const overallPct = totalClasses === 0 ? 0 : parseFloat(((totalAttended / totalClasses) * 100).toFixed(1));
  const overallStatus = overallPct >= target ? "safe" : overallPct >= target - 10 ? "warning" : "critical";
  const safeSubjects = summaries.filter((s) => s.stats.isSafe).length;
  const atRisk = summaries.length - safeSubjects;

  return (
    <div>
      <Topbar
        title="Overview"
        subtitle={`Good ${getTimeOfDay()}, here's your summary`}
      />

      {/* Top stats */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { label: "Overall Attendance", value: totalClasses === 0 ? "—" : `${overallPct}%`, subtext: `${totalAttended}/${totalClasses} classes`, color: totalClasses === 0 ? "var(--text-primary)" : getStatusColor(overallStatus) },
          { label: "Subjects",           value: subjects.length,    subtext: "enrolled subjects",     color: "var(--accent)" },
          { label: "At Risk",            value: atRisk,             subtext: "below threshold",       color: atRisk > 0 ? "var(--danger)" : "var(--safe)" },
          { label: "Study Materials",    value: totalMaterials,     subtext: "files, links & notes",  color: "var(--text-primary)" },
        ].map(({ label, value, subtext, color }) => (
          <Card key={label} style={{ padding: 22 }}>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className="stat-label">{label}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{subtext}</div>
          </Card>
        ))}
      </div>

      {/* Per-subject breakdown */}
      {subjects.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Attendance by Subject</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {summaries.map((s) => {
              const status = s.stats.percentage >= target ? "safe" : s.stats.percentage >= target - 10 ? "warning" : "critical";
              return (
                <Link key={s.id} href={`/attendance/${s.id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 18px",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      transition: "border-color 0.15s ease",
                      cursor: "pointer",
                    }}
                  >
                    {/* Color indicator */}
                    <span className="color-dot" style={{ background: s.color, width: 12, height: 12, flexShrink: 0 }} />

                    {/* Name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.name}
                      </div>
                      {s.code && (
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.code}</div>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div style={{ flex: 2, maxWidth: 200, minWidth: 80 }}>
                      <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 99, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(100, s.total === 0 ? 0 : s.stats.percentage)}%`,
                            background: getStatusColor(status),
                            borderRadius: 99,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Percentage */}
                    <div style={{ minWidth: 48, textAlign: "right" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: getStatusColor(status) }}>
                        {s.total === 0 ? "—" : `${s.stats.percentage}%`}
                      </span>
                    </div>

                    {/* Badge */}
                    <div style={{ minWidth: 100 }}>
                      <Badge variant={status === "safe" ? "safe" : status === "warning" ? "warning" : "danger"}>
                        {s.total === 0
                          ? "No data"
                          : s.stats.isSafe
                          ? `Can miss ${s.stats.canMiss === Infinity ? "∞" : s.stats.canMiss}`
                          : `Attend ${s.stats.mustAttend} more`}
                      </Badge>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentRecords.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent Activity</h2>
          <Card>
            <div style={{ padding: "0 4px" }}>
              {recentRecords.map((r, i) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderBottom: i < recentRecords.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span className="color-dot" style={{ background: r.subject.color }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{r.subject.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(r.date)}</div>
                  </div>
                  <Badge variant={r.status === "PRESENT" ? "safe" : "danger"}>
                    {r.status === "PRESENT" ? "✓ Present" : "✕ Absent"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Empty state for first launch */}
      {subjects.length === 0 && (
        <Card style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Welcome to Student Dashboard!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
            Get started by going to Settings to verify your subjects, then start tracking attendance.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/settings" className="btn btn-primary">Go to Settings</Link>
            <Link href="/attendance" className="btn btn-secondary">Attendance</Link>
          </div>
        </Card>
      )}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function getStatusColor(status: "safe" | "warning" | "critical") {
  if (status === "safe") return "var(--safe)";
  if (status === "warning") return "var(--warning)";
  return "var(--danger)";
}
