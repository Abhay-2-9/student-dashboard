/**
 * Pure attendance math functions.
 * No database calls — all inputs come from the caller.
 */

export interface AttendanceStats {
  total: number;       // total classes conducted
  attended: number;    // classes attended
  absent: number;      // classes missed
  percentage: number;  // attended / total * 100, rounded to 1dp
  target: number;      // e.g. 75 (%)
  isSafe: boolean;     // percentage >= target

  /**
   * If safe (percentage >= target):
   * How many more classes can be missed before dropping below target.
   * Formula: floor((attended - target*total) / (1 - target))   [target as decimal]
   */
  canMiss: number;

  /**
   * If below target (percentage < target):
   * How many consecutive classes must be attended to recover to >= target.
   * Formula: ceil((target*total - attended) / (1 - target))    [target as decimal]
   */
  mustAttend: number;
}

/**
 * Calculate attendance statistics for a subject.
 * @param attended  Number of classes attended
 * @param total     Total classes conducted
 * @param target    Target attendance percentage (e.g. 75)
 */
export function calculateAttendanceStats(
  attended: number,
  total: number,
  target: number = 75
): AttendanceStats {
  if (total === 0) {
    return {
      total: 0,
      attended: 0,
      absent: 0,
      percentage: 0,
      target,
      isSafe: true,
      canMiss: Infinity,
      mustAttend: 0,
    };
  }

  const t = target / 100; // convert to decimal
  const percentage = parseFloat(((attended / total) * 100).toFixed(1));
  const isSafe = percentage >= target;

  let canMiss = 0;
  let mustAttend = 0;

  if (isSafe) {
    // solve: attended / (total + m) >= t  →  m <= attended/t - total
    const raw = attended / t - total;
    canMiss = raw < 0 ? 0 : Math.floor(raw);
  } else {
    // solve: (attended + a) / (total + a) >= t  →  a >= (t*total - attended) / (1 - t)
    const raw = (t * total - attended) / (1 - t);
    mustAttend = raw <= 0 ? 0 : Math.ceil(raw);
  }

  return {
    total,
    attended,
    absent: total - attended,
    percentage,
    target,
    isSafe,
    canMiss,
    mustAttend,
  };
}

/**
 * Returns a human-readable status label based on percentage vs target.
 */
export function getAttendanceStatus(
  percentage: number,
  target: number
): "safe" | "warning" | "critical" {
  if (percentage >= target) return "safe";
  if (percentage >= target - 10) return "warning";
  return "critical";
}
