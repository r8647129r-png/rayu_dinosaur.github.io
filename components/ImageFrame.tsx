import { Camera } from "lucide-react";
import type { ImageSpec } from "@/data/images";

/**
 * 画像枠。src があれば写真を、なければ「写真提供募集中 / イメージ」の
 * プレースホルダーを表示する。比率は className（aspect-*）で指定。
 */
export default function ImageFrame({
  image,
  className = "aspect-[16/9]",
  priority = false,
  showLabel = true,
}: {
  image: ImageSpec;
  className?: string;
  priority?: boolean;
  showLabel?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-forest-pale ${className}`}>
      {image.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
        />
      ) : (
        <div className="absolute inset-0" role="img" aria-label={`${image.alt}（イメージ）`}>
          {/* 地層をイメージした控えめなストライプ */}
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
            <rect width="100" height="100" fill="#E8F0EC" />
            <path d="M0 62 Q25 56 50 61 T100 58 V100 H0Z" fill="#D5E4DB" />
            <path d="M0 74 Q30 69 55 74 T100 71 V100 H0Z" fill="#C3D8CB" />
            <path d="M0 86 Q35 82 60 86 T100 84 V100 H0Z" fill="#AECBB9" />
          </svg>
          <Camera className="absolute left-1/2 top-[38%] h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-forest/30" strokeWidth={1.5} />
        </div>
      )}
      {showLabel && !image.src && (
        <span className="absolute right-2 top-2 rounded-sm bg-white/85 px-1.5 py-0.5 text-[10px] text-slate-500">
          写真提供募集中 / イメージ
        </span>
      )}
      {image.src && image.credit && (
        <span className="absolute bottom-1 right-1.5 text-[10px] text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
          {image.credit}
        </span>
      )}
    </div>
  );
}
