import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../../_lib/prisma";
import { Topbar } from "../../../../_components/layout/Topbar";
import { SubjectAttendanceView } from "./_components/SubjectAttendanceView";

export async function generateMetadata(props: PageProps<"/attendance/[subjectId]">) {
  const { subjectId } = await props.params;
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  return { title: subject ? `${subject.name} Attendance — Student Dashboard` : "Attendance" };
}

export default async function SubjectAttendancePage(props: PageProps<"/attendance/[subjectId]">) {
  const { subjectId } = await props.params;

  const [subject, settings, records] = await Promise.all([
    prisma.subject.findUnique({ where: { id: subjectId } }),
    prisma.settings.findUnique({ where: { id: "singleton" } }),
    prisma.attendanceRecord.findMany({
      where: { subjectId },
      orderBy: { date: "desc" },
    }),
  ]);

  if (!subject) notFound();

  const target = settings?.targetAttendance ?? 75;

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Link
          href="/attendance"
          style={{ fontSize: 13, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}
        >
          ← Back to Attendance
        </Link>
      </div>
      <Topbar
        title={subject.name}
        subtitle={subject.code ?? undefined}
      />
      <SubjectAttendanceView
        subjectId={subject.id}
        subjectName={subject.name}
        subjectCode={subject.code}
        subjectColor={subject.color}
        target={target}
        initialRecords={records.map((r) => ({
          ...r,
          note: r.note ?? null,
        }))}
      />
    </div>
  );
}
