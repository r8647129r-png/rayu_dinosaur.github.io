import { AtSign, ExternalLink, ImageIcon } from "lucide-react";
import type { Museum } from "@/data/museums";
import type { SocialConfig } from "@/data/social";
import SocialEmbed from "./SocialEmbed";

export default function SocialSection({ museum: m, social }: { museum: Museum; social: SocialConfig }) {
  const hasEmbeds = social.embeds.length > 0;
  return (
    <div>
      {social.accounts.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {social.accounts.map((a) => (
            <a
              key={a.url}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[40px] items-center gap-1.5 rounded-sm border border-slate-300 bg-white px-3 text-sm text-slate-ink hover:border-forest hover:text-forest"
            >
              <AtSign className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {a.label}
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </a>
          ))}
        </div>
      )}
      {hasEmbeds ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {social.embeds.map((html, i) => (
            <div key={i} className="rounded-sm border border-slate-200 bg-white p-2">
              <SocialEmbed html={html} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-slate-300 bg-white p-4 text-center ${i > 0 ? "hidden sm:flex" : ""}`}
            >
              <ImageIcon className="h-7 w-7 text-slate-300" strokeWidth={1.5} aria-hidden />
              <p className="text-xs text-slate-500">公式X・Instagramの投稿を準備中です</p>
              {i === 0 && (
                <a href={m.officialUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-forest underline underline-offset-4">
                  最新情報は公式サイトへ
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
