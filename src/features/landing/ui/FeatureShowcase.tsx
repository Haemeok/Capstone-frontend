import type { LandingDict, Locale } from "@/shared/i18n";
import { Reveal } from "@/shared/ui/Reveal";

const BADGE_COLORS = [
  "bg-red-50 text-red-600",
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-green-50 text-green-600",
  "bg-amber-50 text-amber-600",
];

export const FeatureShowcase = ({ t }: { t: LandingDict; locale: Locale }) => {
  return (
    <section className="from-beige/30 to-beige/30 relative w-full overflow-hidden bg-gradient-to-b via-white px-4 py-12 md:py-20">
      <div className="bg-olive-mint/10 absolute top-1/4 left-0 h-96 w-96 rounded-full blur-3xl" />
      <div className="bg-olive-light/10 absolute right-0 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mb-20 text-center">
          <div className="bg-olive-light/10 text-olive-medium mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold">
            {t.features.eyebrow}
          </div>
          <h2 className="text-ink mb-4 text-4xl font-extrabold md:text-5xl">
            {t.features.title}
          </h2>
          <p className="text-ink-sub mx-auto max-w-2xl text-lg">
            {t.features.subtitle}
          </p>
        </Reveal>

        <div className="space-y-24">
          {t.features.items.map((feature, index) => {
            const isReversed = index % 2 === 1;
            const badgeColor = BADGE_COLORS[index];
            const badge = feature.badge.replace("{count}", t.recipeCount.label);
            const description = feature.description
              .replace("{count}", t.recipeCount.label)
              .replace("{phrase}", t.recipeCount.phrase);

            return (
              <Reveal
                key={index}
                className={`flex flex-col items-center gap-12 lg:gap-16 ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                <div className="flex-1 space-y-6">
                  <div>
                    <div
                      className={`mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-bold ${badgeColor}`}
                    >
                      {badge}
                    </div>
                    <h3 className="text-ink mb-4 text-3xl leading-tight font-extrabold md:text-4xl lg:text-5xl">
                      {feature.title}
                    </h3>
                    <p className="text-ink-sub text-lg leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center gap-3"
                      >
                        <div className="bg-olive-mint/20 flex h-6 w-6 items-center justify-center rounded-full">
                          <svg
                            className="text-olive-medium h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-ink-sub text-base font-medium">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
