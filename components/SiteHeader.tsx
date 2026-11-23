import Link from "next/link";
import { Landmark } from "lucide-react";

const NAV = [
  { href: "/#museums", label: "施設一覧" },
  { href: "/#simulator", label: "費用計算" },
  { href: "/events", label: "特別展・イベント" },
  { href: "/checklist", label: "チェックリスト" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-forest">
          <Landmark className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          <span className="text-base font-bold tracking-wide">恐竜博物館 滞在費ガイド</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-slate-ink md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-forest hover:underline underline-offset-4">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 text-xs text-slate-ink md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="whitespace-nowrap hover:text-forest">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
