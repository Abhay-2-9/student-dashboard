import { prisma } from "../../_lib/prisma";
import { calculateAttendanceStats } from "../../_lib/attendance";
import { Topbar } from "../../_components/layout/Topbar";
import { AttendanceCard } from "./_components/AttendanceCard";
import type { SubjectAttendanceSummary } from "../../_types/attendance";

export const metadata = {
  title: "Attendance — Student Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const [subjects, settings] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { createdAt: "asc" },
      include: { attendance: true },
    }),
    prisma.settings.findUnique({ where: { id: "singleton" } }),
  ]);

  const target = settings?.targetAttendance ?? 75;

  const summaries: SubjectAttendanceSummary[] = subjects.map((s) => {
    const attended = s.attendance.filter((r) => r.status === "PRESENT").length;
    const total = s.attendance.length;
    return {
      subjectId: s.id,
      subjectName: s.name,
      subjectCode: s.code,
      subjectColor: s.color,
      stats: calculateAttendanceStats(attended, total, target),
    };
  });

  // Sort: critical → warning → safe
  summaries.sort((a, b) => a.stats.percentage - b.stats.percentage);

  return (
    <div>
      <Topbar
        title="Attendance"
        subtitle={`Tracking ${subjects.length} subject${subjects.length === 1 ? "" : "s"} · Target ${target}%`}
      />

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>No subjects found.</p>
          <p style={{ fontSize: 13 }}>Go to Settings to add subjects first.</p>
        </div>
      ) : (
        <div className="subject-grid animate-fade-in">
          {summaries.map((summary) => (
            <AttendanceCard key={summary.subjectId} summary={summary} />
          ))}
        </div>
      )}
    </div>
  );
}
