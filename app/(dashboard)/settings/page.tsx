import { prisma } from "../../_lib/prisma";
import { Topbar } from "../../_components/layout/Topbar";
import { SubjectManager } from "./_components/SubjectManager";
import { AttendanceSettings } from "./_components/AttendanceSettings";
import { AcademicYearSettings } from "./_components/AcademicYearSettings";
import { GlobalReset } from "./_components/GlobalReset";
import { Card } from "../../_components/ui/Card";

export const metadata = { title: "Settings — Student Dashboard" };

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";

export default async function SettingsPage() {
  noStore();
  const [subjects, settings] = await Promise.all([
    prisma.subject.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.settings.findUnique({ where: { id: "singleton" } }),
  ]);

  const target = settings?.targetAttendance ?? 75;
  const academicYear = settings?.academicYear ?? "2025-26";

  return (
    <div>
      <Topbar title="Settings" subtitle="Manage subjects and preferences" />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* General Settings */}
        <Card style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>General Settings</h2>
          
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Academic Year</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
              The academic year displayed in the sidebar.
            </p>
            <AcademicYearSettings initialYear={academicYear} />
          </div>

          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Attendance Threshold</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
              The minimum attendance percentage required.
            </p>
            <AttendanceSettings initialTarget={target} />
          </div>
        </Card>

        {/* Subject management */}
        <Card style={{ padding: 24 }}>
          <SubjectManager initialSubjects={subjects} />
        </Card>

        {/* Danger zone */}
        <Card style={{ padding: 24, border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          <GlobalReset />
        </Card>
      </div>
    </div>
  );
}
