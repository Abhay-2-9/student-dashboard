interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({ width, height, className, rounded }: SkeletonProps) {
  return (
    <div
      className={`skeleton${className ? ` ${className}` : ""}`}
      style={{
        width: width ?? "100%",
        height: height ?? 16,
        borderRadius: rounded ? "50%" : undefined,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <Skeleton height={20} width="60%" />
      <div style={{ marginTop: 12 }}>
        <Skeleton height={14} />
        <Skeleton height={14} style={{ marginTop: 8 } as React.CSSProperties} width="80%" />
      </div>
    </div>
  );
}
