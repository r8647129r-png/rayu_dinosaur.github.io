import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm text-slate-500">404</p>
      <h1 className="mt-2 text-xl font-bold text-slate-ink">ページが見つかりません</h1>
      <Link href="/" className="mt-6 inline-block text-sm font-semibold text-forest underline underline-offset-4">
        トップページへ戻る
      </Link>
    </div>
  );
}
