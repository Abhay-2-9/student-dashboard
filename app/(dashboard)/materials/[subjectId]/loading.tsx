import { Skeleton, SkeletonCard } from "../../../../_components/ui/Skeleton";
import { Card } from "../../../../_components/ui/Card";

export default function SubjectMaterialsLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Skeleton height={20} width={120} />
      <Skeleton height={28} width={200} />
      <Card style={{ padding: 24 }}>
        <Skeleton height={20} width="40%" style={{ marginBottom: 16 } as React.CSSProperties} />
        <Skeleton height={60} />
      </Card>
      <div className="material-grid">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}
