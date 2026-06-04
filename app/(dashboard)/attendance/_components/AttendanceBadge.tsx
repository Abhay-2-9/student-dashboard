import { Badge } from "../../../_components/ui/Badge";
import type { AttendanceStats } from "../../../_types/attendance";

interface AttendanceBadgeProps {
  stats: AttendanceStats;
}

export function AttendanceBadge({ stats }: AttendanceBadgeProps) {
  if (stats.total === 0) {
    return <Badge variant="neutral">No data</Badge>;
  }

  if (stats.isSafe) {
    if (stats.canMiss === Infinity) {
      return <Badge variant="safe">✓ Safe</Badge>;
    }
    return (
      <Badge variant="safe">
        ✓ Can miss {stats.canMiss} more
      </Badge>
    );
  }

  if (stats.percentage >= stats.target - 10) {
    return (
      <Badge variant="warning">
        ⚠ Attend {stats.mustAttend} more
      </Badge>
    );
  }

  return (
    <Badge variant="danger">
      ✕ Attend {stats.mustAttend} more
    </Badge>
  );
}
