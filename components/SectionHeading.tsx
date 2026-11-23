import type { LucideIcon } from "lucide-react";

export default function SectionHeading({
  icon: Icon,
  title,
  lead,
  id,
}: {
  icon: LucideIcon;
  title: string;
  lead?: string;
  id?: string;
}) {
  return (
    <div id={id} className="mb-6 scroll-mt-24 border-l-4 border-forest pl-4">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-ink">
        <Icon className="h-5 w-5 text-forest" strokeWidth={1.75} aria-hidden />
        {title}
      </h2>
      {lead && <p className="mt-1 text-sm text-slate-500">{lead}</p>}
    </div>
  );
}
