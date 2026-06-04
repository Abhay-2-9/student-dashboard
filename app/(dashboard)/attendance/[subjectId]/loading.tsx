import { Skeleton } from "../../../_components/ui/Skeleton";
import { Card } from "../../../_components/ui/Card";

export default function SubjectAttendanceLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Skeleton height={20} width={120} />
      <Skeleton height={28} width={200} />
      {[1, 2, 3].map((i) => (
        <Card key={i} style={{ padding: 24 }}>
          <Skeleton height={20} width="40%" style={{ marginBottom: 20 } as React.CSSProperties} />
          <Skeleton height={80} />
        </Card>
      ))}
    </div>
  );
}
