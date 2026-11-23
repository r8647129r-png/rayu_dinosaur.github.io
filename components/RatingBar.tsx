export default function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="flex items-center gap-1" aria-label={`${label} 5段階中${value}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-2.5 w-5 ${i <= value ? "bg-forest" : "bg-slate-200"}`}
            aria-hidden
          />
        ))}
        <span className="ml-1 w-4 text-right font-semibold tabular-nums text-slate-ink">{value}</span>
      </span>
    </div>
  );
}
