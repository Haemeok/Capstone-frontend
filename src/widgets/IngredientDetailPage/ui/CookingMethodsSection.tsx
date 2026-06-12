import { getDictionary, type Locale } from "@/shared/i18n";

import { getCookingMethodIcon } from "@/entities/ingredient/lib/cookingMethodIcon";

type CookingMethodsSectionProps = {
  methods: string[];
  locale?: Locale;
};

const CookingMethodsSection = ({
  methods,
  locale = "ko",
}: CookingMethodsSectionProps) => {
  if (methods.length === 0) {
    return null;
  }

  const t = getDictionary(locale).ingredientDetail;

  return (
    <section className="rounded-2xl bg-white p-4">
      <h2 className="text-ink mb-3 text-lg font-bold">{t.cookingHeader}</h2>

      <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
        {methods.map((method) => {
          const Icon = getCookingMethodIcon(method);
          return (
            <span
              key={method}
              className="text-ink-sub inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm"
            >
              {Icon && <Icon size={14} className="text-ink-muted" />}
              <span>{method}</span>
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default CookingMethodsSection;
