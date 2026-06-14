import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import type { Locale } from "@/shared/i18n";
import { format, getDictionary } from "@/shared/i18n";
import { Image } from "@/shared/ui/image";

type RecipeCookingInfoSectionProps = {
  cookingTime: number;
  cookingTools: string[];
  servings: number;
  locale: Locale;
};

export default function RecipeCookingInfoSection({
  cookingTime,
  cookingTools,
  servings,
  locale,
}: RecipeCookingInfoSectionProps) {
  const t = getDictionary(locale);

  return (
    <section className="rounded-card mb-2 border border-gray-200 p-3 sm:p-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <Image
            src={`${ICON_BASE_URL}cooking_time.webp`}
            alt={t.recipeDetail.cookingTimeLabel}
            wrapperClassName="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-ink-muted text-[11px] sm:text-xs">
              {t.recipeDetail.cookingTimeLabel}
            </span>
            <span className="text-ink text-sm font-semibold sm:text-base">
              {cookingTime > 0
                ? format(t.recipeDetail.cookingTimeValue, { n: cookingTime })
                : t.recipeDetail.noInfo}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <Image
            src={`${ICON_BASE_URL}serving_size.webp`}
            alt={t.recipeDetail.servingsLabel}
            wrapperClassName="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-ink-muted text-[11px] sm:text-xs">
              {t.recipeDetail.servingsLabel}
            </span>
            <span className="text-ink text-sm font-semibold sm:text-base">
              {servings > 0
                ? format(t.recipeDetail.servingsValue, { n: servings })
                : t.recipeDetail.noInfo}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <Image
            src={`${ICON_BASE_URL}kitchen_tools.webp`}
            alt={t.recipeDetail.cookingToolsLabel}
            wrapperClassName="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-ink-muted text-[11px] sm:text-xs">
              {t.recipeDetail.cookingToolsLabel}
            </span>
            <span className="text-ink line-clamp-2 text-sm font-semibold break-keep sm:text-base">
              {cookingTools.length > 0
                ? cookingTools.join(", ")
                : t.recipeDetail.noInfo}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
