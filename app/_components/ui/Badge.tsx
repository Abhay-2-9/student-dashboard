import { cn } from "../../_lib/utils";

type BadgeVariant = "safe" | "warning" | "danger" | "neutral";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn("badge", `badge-${variant}`, className)}>
      {children}
    </span>
  );
}
