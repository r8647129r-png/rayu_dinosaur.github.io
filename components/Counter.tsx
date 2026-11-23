"use client";

import { Minus, Plus } from "lucide-react";

export default function Counter({
  value,
  onChange,
  min = 0,
  max = 20,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  const btn =
    "flex h-8 w-8 items-center justify-center border border-slate-300 bg-white text-slate-ink hover:border-forest hover:text-forest disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="flex items-center" role="group" aria-label={label}>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`${label}を減らす`}
      >
        <Minus className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>
      <output className="flex h-8 w-10 items-center justify-center border-y border-slate-300 bg-paper text-sm font-semibold tabular-nums text-slate-ink">
        {value}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`${label}を増やす`}
      >
        <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
