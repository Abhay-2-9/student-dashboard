"use client";

import { useState } from "react";
import { Button } from "../../../_components/ui/Button";
import { useToast } from "../../../_components/ui/Toast";

interface AttendanceSettingsProps {
  initialTarget: number;
}

export function AttendanceSettings({ initialTarget }: AttendanceSettingsProps) {
  const { toast } = useToast();
  const [target, setTarget] = useState(String(initialTarget));
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(target, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      toast("Target must be between 1 and 100", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetAttendance: num }),
      });
      if (!res.ok) throw new Error();
      toast("Settings saved", "success");
    } catch {
      toast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
      <div style={{ flex: 1, maxWidth: 200 }}>
        <label
          htmlFor="attendance-target"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-muted)",
            display: "block",
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Attendance Target (%)
        </label>
        <input
          id="attendance-target"
          type="number"
          className="input"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          min={1}
          max={100}
          required
        />
      </div>
      <Button type="submit" loading={saving}>Save</Button>
    </form>
  );
}
