import { Skeleton, SkeletonCard } from "../../_components/ui/Skeleton";

export default function AttendanceLoading() {
  return (
    <div>
      <div className="page-header">
        <div>
          <Skeleton height={28} width={180} />
          <Skeleton height={14} width={260} style={{ marginTop: 8 } as React.CSSProperties} />
        </div>
      </div>
      <div className="subject-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
