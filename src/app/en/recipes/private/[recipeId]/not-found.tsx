import Link from "next/link";

import { getDictionary } from "@/shared/i18n";

export default function EnPrivateRecipeNotFound() {
  const t = getDictionary("en");
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-ink-sub">{t.notFound.message}</p>
      <Link href="/en/search/results" className="text-olive-dark underline">
        {t.notFound.searchCta}
      </Link>
    </div>
  );
}
