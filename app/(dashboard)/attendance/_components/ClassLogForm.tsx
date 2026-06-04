"use client";

import { useState } from "react";
import { Button } from "../../../_components/ui/Button";
import { useToast } from "../../../_components/ui/Toast";
import { todayISO } from "../../../_lib/utils";

interface ClassLogFormProps {
  subjectId: string;
  onSuccess: () => void;
}

export function ClassLogForm({ subjectId, onSuccess }: ClassLogFormProps) {
  const { toast } = useToast();
  const [date, setDate] = useState(todayISO());
  const [status, setStatus] = useState<"PRESENT" | "ABSENT">("PRESENT");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, date, status, note: note.trim() || undefined }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast("Class recorded successfully", "success");
      setNote("");
      onSuccess();
    } catch {
      toast("Failed to record class", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Date + Status row */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Date
          </label>
          <input
            id="attendance-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayISO()}
            className="input"
            required
          />
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Status
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["PRESENT", "ABSENT"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: "var(--radius)",
                  border: `2px solid ${status === s ? (s === "PRESENT" ? "var(--safe)" : "var(--danger)") : "var(--border-strong)"}`,
                  background: status === s
                    ? s === "PRESENT" ? "var(--safe-light)" : "var(--danger-light)"
                    : "var(--bg-surface)",
                  color: status === s
                    ? s === "PRESENT" ? "var(--safe)" : "var(--danger)"
                    : "var(--text-secondary)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {s === "PRESENT" ? "✓ Present" : "✕ Absent"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Note */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Note (optional)
        </label>
        <input
          id="attendance-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Lab session, Guest lecture…"
          className="input"
          maxLength={500}
        />
      </div>

      <Button type="submit" loading={loading} style={{ alignSelf: "flex-start" }}>
        Record Class
      </Button>
    </form>
  );
}
