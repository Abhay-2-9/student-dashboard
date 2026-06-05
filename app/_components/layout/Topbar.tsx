import { ThemeToggle } from "../ui/ThemeToggle";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {actions}
        <ThemeToggle />
      </div>
    </div>
  );
}
