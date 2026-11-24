"use client";

import { useEffect, useRef } from "react";

/** 貼り付けたSNS埋め込みコードを描画し、必要なスクリプトを読み込む */
export default function SocialEmbed({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // <script> を除いたマークアップを挿入
    el.innerHTML = html.replace(/<script[\s\S]*?<\/script>/gi, "");
    const load = (src: string, id: string, after?: () => void) => {
      const existing = document.getElementById(id);
      if (existing) {
        after?.();
        return;
      }
      const s = document.createElement("script");
      s.id = id;
      s.src = src;
      s.async = true;
      s.onload = () => after?.();
      document.body.appendChild(s);
    };
    if (/twitter-tweet|twitter-timeline|x\.com|twitter\.com/.test(html)) {
      load("https://platform.twitter.com/widgets.js", "x-widgets", () =>
        (window as unknown as { twttr?: { widgets?: { load: (e?: Element) => void } } }).twttr?.widgets?.load(el)
      );
    }
    if (/instagram-media/.test(html)) {
      load("https://www.instagram.com/embed.js", "ig-embed", () =>
        (window as unknown as { instgrm?: { Embeds?: { process: () => void } } }).instgrm?.Embeds?.process()
      );
    }
  }, [html]);
  return <div ref={ref} className="min-h-[200px] overflow-hidden [&_iframe]:!max-w-full" />;
}
