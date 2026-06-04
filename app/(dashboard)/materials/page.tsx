import { prisma } from "../../_lib/prisma";
import { Topbar } from "../../_components/layout/Topbar";
import { SubjectMaterialsGrid } from "./_components/SubjectMaterialsGrid";

export const metadata = { title: "Study Materials — Student Dashboard" };

export default async function MaterialsPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { materials: true } } },
  });

  const totalMaterials = subjects.reduce((sum, s) => sum + s._count.materials, 0);

  return (
    <div>
      <Topbar
        title="Study Materials"
        subtitle={`${subjects.length} subjects · ${totalMaterials} material${totalMaterials === 1 ? "" : "s"} total`}
      />
      <SubjectMaterialsGrid subjects={subjects} />
    </div>
  );
}
