"use client";

import { useTheme } from "../providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  
  const isDark = theme === "dark";

  if (!mounted) {
    return (
      <button
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius)",
          border: "1px solid var(--border-strong)",
          background: "var(--bg-surface)",
          visibility: "hidden"
        }}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "var(--radius)",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-surface)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-overlay)";
        e.currentTarget.style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-surface)";
        e.currentTarget.style.color = "var(--text-secondary)";
      }}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
