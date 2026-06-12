import { ChefHat, UtensilsCrossed } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n";

type RecipePlatingSectionProps = {
  vessel: string;
  guide: string;
  className?: string;
  locale: Locale;
};

const formatGuide = (text: string): string => {
  return text.replace(/(\d+\.\s)/g, (match, _p1, offset) => {
    return offset === 0 ? match : "\n" + match;
  });
};

export default function RecipePlatingSection({
  vessel,
  guide,
  className = "",
  locale,
}: RecipePlatingSectionProps) {
  const t = getDictionary(locale);

  return (
    <section
      className={`border-brown-light bg-beige rounded-card my-6 border p-4 ${className}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <UtensilsCrossed className="text-brown h-6 w-6 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-brown text-sm font-bold">
              {t.recipeDetail.platingVessel}
            </span>
            <p className="text-ink-sub text-sm">{vessel}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ChefHat className="text-brown h-6 w-6 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-brown text-sm font-bold">
              {t.recipeDetail.platingGuide}
            </span>
            <p className="text-ink-sub text-sm leading-relaxed whitespace-pre-wrap">
              {formatGuide(guide)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
