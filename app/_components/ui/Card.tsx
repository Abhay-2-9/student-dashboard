import { cn } from "../../_lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  clickable?: boolean;
  style?: React.CSSProperties;
}

export function Card({ className, children, clickable = false, style }: CardProps) {
  return (
    <div
      className={cn("card", clickable && "card-clickable", className)}
      style={style}
    >
      {children}
    </div>
  );
}
