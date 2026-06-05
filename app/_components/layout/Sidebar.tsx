"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",           label: "Overview",       icon: "◈" },
  { href: "/attendance", label: "Attendance",      icon: "✓" },
  { href: "/materials",  label: "Study Materials", icon: "📂" },
  { href: "/documents",  label: "Documents",       icon: "📄" },
  { href: "/settings",   label: "Settings",        icon: "⚙" },
];

export function Sidebar({ academicYear }: { academicYear: string }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: "24px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            S
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
              Student
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, lineHeight: 1.2 }}>
              Dashboard
            </div>
          </div>
        </div>
      </div>

      <div className="divider" style={{ margin: "0 12px" }} />

      {/* Navigation */}
      <nav style={{ padding: "8px 12px", flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 6px 10px" }}>
          Navigation
        </div>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-nav-item${isActive(item.href) ? " active" : ""}`}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Academic Year {academicYear}
        </div>
      </div>
    </aside>
  );
}
