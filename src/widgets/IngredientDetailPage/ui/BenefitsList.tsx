import { getDictionary, type Locale } from "@/shared/i18n";

type BenefitsListProps = {
  benefits: string | null;
  locale?: Locale;
};

const BenefitsList = ({ benefits, locale = "ko" }: BenefitsListProps) => {
  if (!benefits) return null;

  const t = getDictionary(locale).ingredientDetail;

  return (
    <section className="border-t border-gray-100 px-5 py-6">
      <h2 className="text-ink mb-1 text-lg font-bold">{t.benefitsHeader}</h2>
      <p className="text-ink-muted mb-3 text-sm">{t.benefitsSubtitle}</p>
      <p className="text-ink-sub text-sm leading-relaxed">{benefits}</p>
    </section>
  );
};

export default BenefitsList;
