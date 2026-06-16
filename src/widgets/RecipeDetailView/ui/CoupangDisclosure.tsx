import type { Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n";

type CoupangDisclosureProps = {
  locale: Locale;
};

export const CoupangDisclosure = ({ locale }: CoupangDisclosureProps) => {
  if (locale !== "ko") return null;

  const t = getDictionary(locale);

  return (
    <div className="mt-2 mb-4 text-center">
      <p className="text-[11px] leading-tight font-light text-pretty break-keep text-gray-400">
        {t.recipeDetail.coupangDisclosure}
      </p>
    </div>
  );
};
