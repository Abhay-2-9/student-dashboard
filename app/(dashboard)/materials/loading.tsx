import { Skeleton, SkeletonCard } from "../../_components/ui/Skeleton";

export default function MaterialsLoading() {
  return (
    <div>
      <div className="page-header">
        <Skeleton height={28} width={200} />
      </div>
      <div className="subject-grid">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}
