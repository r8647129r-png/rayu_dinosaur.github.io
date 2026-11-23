import { API_KEYS, AFFILIATE_IDS, wrapValueCommerce } from "@/config/affiliates";
import type { Museum } from "@/data/museums";

export interface NearbyHotel {
  id: string;
  name: string;
  url: string; // アフィリエイトID付き
  minCharge: number | null; // 1泊あたり最安料金（税込・円）
  reviewAverage: number | null;
  reviewCount: number;
  access: string;
  imageUrl?: string;
}

export interface NearbyRestaurant {
  id: string;
  name: string;
  url: string;
  couponUrl?: string;
  genre: string;
  budget: string;
  hasCoupon: boolean;
  access: string;
  imageUrl?: string;
}

export interface NearbyResult<T> {
  status: "ok" | "empty" | "no-key" | "error";
  items: T[];
  checkedAt: string;
}

const now = () => new Date().toISOString();

/* ---------------- 楽天トラベル（宿の最安値） ---------------- */

export const HOTEL_REVALIDATE = 60 * 60; // 1時間

interface RakutenBasicInfo {
  hotelNo: number;
  hotelName: string;
  hotelInformationUrl: string;
  planListUrl?: string;
  hotelMinCharge?: number | null;
  reviewAverage?: number | null;
  reviewCount?: number | null;
  access?: string;
  nearestStation?: string;
  hotelThumbnailUrl?: string;
}

export async function getNearbyHotels(m: Museum, limit = 4): Promise<NearbyResult<NearbyHotel>> {
  if (!API_KEYS.rakutenAppId) return { status: "no-key", items: [], checkedAt: now() };
  const params = new URLSearchParams({
    applicationId: API_KEYS.rakutenAppId,
    format: "json",
    formatVersion: "1",
    latitude: String(m.geo.lat),
    longitude: String(m.geo.lng),
    datumType: "1", // 世界測地系・度
    searchRadius: "3", // km（APIの上限）
    hits: "10",
    responseType: "small",
  });
  if (API_KEYS.rakutenAffiliateId) params.set("affiliateId", API_KEYS.rakutenAffiliateId);
  // 新しい楽天APIはアクセスキー必須。設定されていれば新エンドポイントを使う
  const base = API_KEYS.rakutenAccessKey
    ? "https://openapi.rakuten.co.jp/engine/api/Travel/SimpleHotelSearch/20170426"
    : "https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426";
  if (API_KEYS.rakutenAccessKey) params.set("accessKey", API_KEYS.rakutenAccessKey);

  try {
    const res = await fetch(`${base}?${params}`, {
      next: { revalidate: HOTEL_REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });
    // 範囲内に宿がない場合 404 (not_found) が返る
    if (res.status === 404) return { status: "empty", items: [], checkedAt: now() };
    if (!res.ok) return { status: "error", items: [], checkedAt: now() };
    const json = (await res.json()) as { hotels?: { hotel: { hotelBasicInfo?: RakutenBasicInfo }[] }[] };
    const items = (json.hotels ?? [])
      .map((h) => h.hotel.find((x) => x.hotelBasicInfo)?.hotelBasicInfo)
      .filter((h): h is RakutenBasicInfo => !!h)
      .map<NearbyHotel>((h) => ({
        id: String(h.hotelNo),
        name: h.hotelName,
        url: h.planListUrl || h.hotelInformationUrl,
        minCharge: h.hotelMinCharge ?? null,
        reviewAverage: h.reviewAverage ?? null,
        reviewCount: h.reviewCount ?? 0,
        access: h.access || h.nearestStation || "",
        imageUrl: h.hotelThumbnailUrl,
      }))
      .sort((a, b) => (a.minCharge ?? Infinity) - (b.minCharge ?? Infinity))
      .slice(0, limit);
    return { status: items.length ? "ok" : "empty", items, checkedAt: now() };
  } catch {
    return { status: "error", items: [], checkedAt: now() };
  }
}

/* ---------------- ホットペッパーグルメ（周辺飲食店・クーポン） ---------------- */

export const RESTAURANT_REVALIDATE = 60 * 60 * 6; // 6時間

interface HotpepperShop {
  id: string;
  name: string;
  genre?: { name?: string };
  budget?: { name?: string; average?: string };
  urls?: { pc?: string };
  coupon_urls?: { pc?: string; sp?: string };
  ktai_coupon?: number | string; // 0: クーポンあり
  mobile_access?: string;
  access?: string;
  photo?: { pc?: { m?: string } };
}

export async function getNearbyRestaurants(m: Museum, limit = 6): Promise<NearbyResult<NearbyRestaurant>> {
  if (!API_KEYS.hotpepperKey) return { status: "no-key", items: [], checkedAt: now() };
  const params = new URLSearchParams({
    key: API_KEYS.hotpepperKey,
    format: "json",
    lat: String(m.geo.lat),
    lng: String(m.geo.lng),
    range: "5", // 3km
    count: String(limit),
    order: "4", // おすすめ順
  });
  try {
    const res = await fetch(`https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params}`, {
      next: { revalidate: RESTAURANT_REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { status: "error", items: [], checkedAt: now() };
    const json = (await res.json()) as { results?: { shop?: HotpepperShop[]; error?: unknown } };
    if (json.results?.error) return { status: "error", items: [], checkedAt: now() };
    const pid = AFFILIATE_IDS.valuecommercePidHotpepper;
    const items = (json.results?.shop ?? []).map<NearbyRestaurant>((s) => ({
      id: s.id,
      name: s.name,
      url: wrapValueCommerce(s.urls?.pc ?? "https://www.hotpepper.jp/", pid),
      couponUrl: s.coupon_urls?.pc ? wrapValueCommerce(s.coupon_urls.pc, pid) : undefined,
      genre: s.genre?.name ?? "",
      budget: s.budget?.average || s.budget?.name || "",
      hasCoupon: String(s.ktai_coupon) === "0",
      access: s.mobile_access || s.access || "",
      imageUrl: s.photo?.pc?.m,
    }));
    return { status: items.length ? "ok" : "empty", items, checkedAt: now() };
  } catch {
    return { status: "error", items: [], checkedAt: now() };
  }
}
