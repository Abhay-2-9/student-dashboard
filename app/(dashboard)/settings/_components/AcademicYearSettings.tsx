"use client";

import { useState } from "react";
import { Button } from "../../../_components/ui/Button";
import { useToast } from "../../../_components/ui/Toast";

interface AcademicYearSettingsProps {
  initialYear: string;
}

export function AcademicYearSettings({ initialYear }: AcademicYearSettingsProps) {
  const { toast } = useToast();
  const [year, setYear] = useState(initialYear);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!year.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ academicYear: year.trim() }),
      });
      if (!res.ok) throw new Error();
      toast("Academic year updated. Please refresh to see changes globally.", "success");
    } catch {
      toast("Failed to update academic year", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", maxWidth: 300 }}>
      <input
        className="input"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="e.g. 2025-26"
      />
      <Button onClick={handleSave} loading={loading} disabled={year === initialYear || !year.trim()}>
        Save
      </Button>
    </div>
  );
}
