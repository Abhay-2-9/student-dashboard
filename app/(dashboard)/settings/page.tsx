import { prisma } from "../../_lib/prisma";
import { Topbar } from "../../_components/layout/Topbar";
import { SubjectManager } from "./_components/SubjectManager";
import { AttendanceSettings } from "./_components/AttendanceSettings";
import { Card } from "../../_components/ui/Card";

export const metadata = { title: "Settings — Student Dashboard" };

export default async function SettingsPage() {
  const [subjects, settings] = await Promise.all([
    prisma.subject.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.settings.findUnique({ where: { id: "singleton" } }),
  ]);

  const target = settings?.targetAttendance ?? 75;

  return (
    <div>
      <Topbar title="Settings" subtitle="Manage subjects and preferences" />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Attendance target */}
        <Card style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Attendance Threshold</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
            The minimum attendance percentage required. Attendance calculations across all subjects use this value.
          </p>
          <AttendanceSettings initialTarget={target} />
        </Card>

        {/* Subject management */}
        <Card style={{ padding: 24 }}>
          <SubjectManager initialSubjects={subjects} />
        </Card>
      </div>
    </div>
  );
}
