import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../../_lib/prisma";
import { Topbar } from "../../../../_components/layout/Topbar";
import { SubjectMaterialsView } from "./_components/SubjectMaterialsView";

export async function generateMetadata(props: PageProps<"/materials/[subjectId]">) {
  const { subjectId } = await props.params;
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  return { title: subject ? `${subject.name} — Materials` : "Materials" };
}

export default async function SubjectMaterialsPage(props: PageProps<"/materials/[subjectId]">) {
  const { subjectId } = await props.params;

  const [subject, materials] = await Promise.all([
    prisma.subject.findUnique({ where: { id: subjectId } }),
    prisma.material.findMany({ where: { subjectId }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!subject) notFound();

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Link href="/materials" style={{ fontSize: 13, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
          ← Back to Materials
        </Link>
      </div>
      <Topbar title={subject.name} subtitle={subject.code ?? undefined} />
      <SubjectMaterialsView
        subjectId={subject.id}
        initialMaterials={materials}
      />
    </div>
  );
}
