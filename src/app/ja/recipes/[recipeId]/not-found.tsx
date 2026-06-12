import Link from "next/link";

export default function JaRecipeNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-ink-sub">レシピが見つかりませんでした。</p>
      <Link href="/ja/search/results" className="text-olive-dark underline">
        レシピを探す
      </Link>
    </div>
  );
}
