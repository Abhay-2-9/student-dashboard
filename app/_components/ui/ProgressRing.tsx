"use client";

interface ProgressRingProps {
  percentage: number;   // 0–100
  size?: number;        // diameter in px
  strokeWidth?: number;
  status?: "safe" | "warning" | "critical";
  label?: string;
  sublabel?: string;
}

const STATUS_COLORS = {
  safe:     "var(--safe)",
  warning:  "var(--warning)",
  critical: "var(--danger)",
};

export function ProgressRing({
  percentage,
  size = 96,
  strokeWidth = 8,
  status = "safe",
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = STATUS_COLORS[status];

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-overlay)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      {/* Centre text */}
      {(label || sublabel) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {label && (
            <span style={{ fontSize: size * 0.18, fontWeight: 800, color, lineHeight: 1 }}>
              {label}
            </span>
          )}
          {sublabel && (
            <span style={{ fontSize: size * 0.12, color: "var(--text-muted)", lineHeight: 1 }}>
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
