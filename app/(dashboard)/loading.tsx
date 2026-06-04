import { Skeleton } from "../_components/ui/Skeleton";
import { Card } from "../_components/ui/Card";

export default function OverviewLoading() {
  return (
    <div>
      <div className="page-header">
        <Skeleton height={28} width={160} />
      </div>
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} style={{ padding: 22 }}>
            <Skeleton height={36} width="60%" />
            <Skeleton height={14} width="80%" style={{ marginTop: 10 } as React.CSSProperties} />
          </Card>
        ))}
      </div>
      <Skeleton height={22} width={200} style={{ marginBottom: 16 } as React.CSSProperties} />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} height={56} style={{ marginBottom: 8 } as React.CSSProperties} />
      ))}
    </div>
  );
}
