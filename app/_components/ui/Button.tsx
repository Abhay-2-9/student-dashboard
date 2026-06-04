"use client";

import { cn } from "../../_lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "btn",
        `btn-${variant}`,
        size === "sm" && "btn-sm",
        size === "lg" && "btn-lg",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: 14,
            height: 14,
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
          }}
          className="animate-spin"
        />
      )}
      {children}
    </button>
  );
}
