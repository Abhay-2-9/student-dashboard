"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",           label: "Home",       icon: "◈" },
  { href: "/attendance", label: "Attendance", icon: "✓" },
  { href: "/materials",  label: "Materials",  icon: "📂" },
  { href: "/settings",   label: "Settings",   icon: "⚙" },
];

export function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav
      style={{
        display: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        zIndex: 40,
        padding: "8px 0 env(safe-area-inset-bottom,0)",
      }}
      className="mobile-nav"
    >
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "6px 16px",
                fontSize: 10,
                fontWeight: 600,
                color: active ? "var(--accent)" : "var(--text-muted)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
