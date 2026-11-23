import { FALLBACK_EVENTS, type CuratedEvent } from "@/data/events";

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
}

export interface EventsPayload {
  curated: CuratedEvent[];
  news: NewsItem[];
  newsStatus: "ok" | "fallback";
  fetchedAt: string;
}

/** ISR の再検証間隔（秒） */
export const EVENTS_REVALIDATE = 3600;

/** 取得するRSSフィード。追加・変更はここで行う */
const FEEDS = [
  "https://news.google.com/rss/search?q=%E6%81%90%E7%AB%9C%E5%B1%95&hl=ja&gl=JP&ceid=JP:ja",
  "https://news.google.com/rss/search?q=%E5%8C%96%E7%9F%B3+%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88+%E5%8D%9A%E7%89%A9%E9%A4%A8&hl=ja&gl=JP&ceid=JP:ja",
];

const KEYWORDS = /恐竜|化石|古生物|ジュラ紀|白亜紀/;

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

function pick(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decode(m[1]) : "";
}

export function parseRss(xml: string): NewsItem[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.map((item) => {
    const rawTitle = pick(item, "title");
    const source = pick(item, "source");
    // Google News はタイトル末尾に " - 媒体名" が付くので除去
    const title = source && rawTitle.endsWith(` - ${source}`)
      ? rawTitle.slice(0, -(source.length + 3))
      : rawTitle;
    const pub = pick(item, "pubDate");
    const date = pub ? new Date(pub) : null;
    return {
      title,
      link: pick(item, "link"),
      source: source || "ニュース",
      publishedAt: date && !isNaN(date.getTime()) ? date.toISOString() : null,
    };
  });
}

async function fetchFeed(url: string): Promise<NewsItem[]> {
  const res = await fetch(url, {
    next: { revalidate: EVENTS_REVALIDATE },
    signal: AbortSignal.timeout(6000),
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DinoMuseumGuide/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseRss(await res.text());
}

export async function getEvents(limit = 12): Promise<EventsPayload> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const seen = new Set<string>();
  const news: NewsItem[] = [];
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      if (!item.title || !item.link || !KEYWORDS.test(item.title)) continue;
      if (seen.has(item.title)) continue;
      seen.add(item.title);
      news.push(item);
    }
  }
  news.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

  return {
    curated: FALLBACK_EVENTS,
    news: news.slice(0, limit),
    newsStatus: news.length > 0 ? "ok" : "fallback",
    fetchedAt: new Date().toISOString(),
  };
}
