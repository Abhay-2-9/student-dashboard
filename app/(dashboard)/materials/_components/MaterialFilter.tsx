"use client";

import { MATERIAL_TYPE_LABELS } from "../../../_types/material";
import type { MaterialType } from "../../../_types/material";

type Filter = "ALL" | MaterialType;

interface MaterialFilterProps {
  active: Filter;
  onChange: (filter: Filter) => void;
  counts: Partial<Record<Filter, number>>;
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PDF",   label: MATERIAL_TYPE_LABELS.PDF   },
  { key: "IMAGE", label: MATERIAL_TYPE_LABELS.IMAGE },
  { key: "NOTE",  label: MATERIAL_TYPE_LABELS.NOTE  },
  { key: "LINK",  label: MATERIAL_TYPE_LABELS.LINK  },
];

export function MaterialFilter({ active, onChange, counts }: MaterialFilterProps) {
  return (
    <div className="tab-bar">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={`tab-item${active === f.key ? " active" : ""}`}
          onClick={() => onChange(f.key)}
        >
          {f.label}
          {counts[f.key] !== undefined && (
            <span
              style={{
                marginLeft: 5,
                fontSize: 11,
                background: active === f.key ? "var(--accent-light)" : "var(--bg-surface)",
                color: active === f.key ? "var(--accent)" : "var(--text-muted)",
                padding: "1px 6px",
                borderRadius: 99,
                fontWeight: 700,
              }}
            >
              {counts[f.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
