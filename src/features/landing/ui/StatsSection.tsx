import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import type { LandingDict, Locale } from "@/shared/i18n";
import { Image } from "@/shared/ui/image/Image";
import { Reveal } from "@/shared/ui/Reveal";

type StatStatic = {
  image: string;
  accent: string;
};

const STAT_STATICS: StatStatic[] = [
  {
    image: `${ICON_BASE_URL}book.webp`,
    accent: "from-purple-500/10 to-pink-500/10",
  },
  {
    image: `${ICON_BASE_URL}money.webp`,
    accent: "from-green-500/10 to-emerald-500/10",
  },
  {
    image: `${ICON_BASE_URL}clock.webp`,
    accent: "from-blue-500/10 to-cyan-500/10",
  },
  {
    image: `${ICON_BASE_URL}food.webp`,
    accent: "from-orange-500/10 to-amber-500/10",
  },
];

export const StatsSection = ({ t }: { t: LandingDict; locale: Locale }) => {
  return (
    <section className="from-beige/30 relative w-full overflow-hidden bg-gradient-to-b to-white px-4 py-12 md:py-20">
      <div className="bg-olive-mint/5 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <h2 className="text-ink mb-4 text-4xl font-extrabold md:text-5xl">
            {t.stats.title}
          </h2>
          <p className="text-ink-sub mx-auto max-w-2xl text-lg">
            {t.stats.subtitle}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {t.stats.items.map((stat, index) => {
            const statics = STAT_STATICS[index];
            return (
              <Reveal
                key={index}
                className="group relative"
                delayMs={index * 100}
              >
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${statics.accent} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative h-full rounded-3xl border border-gray-200/50 bg-white p-4 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-gray-300 group-hover:shadow-2xl md:p-8">
                  <div className="mb-4 flex justify-center md:mb-6">
                    <Image
                      src={statics.image}
                      alt={stat.label}
                      wrapperClassName="h-28 w-28 md:h-32 md:w-32 lg:h-40 lg:w-40"
                    />
                  </div>
                  <div className="from-olive-light via-olive-mint to-olive-medium bg-gradient-to-br bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                    {stat.metric}
                  </div>
                  <h3 className="text-ink mt-3 mb-1 text-sm font-bold text-balance break-keep md:mt-4 md:mb-2 md:text-xl">
                    {stat.label}
                  </h3>
                  <p className="text-ink-muted text-xs text-pretty break-keep md:text-sm">
                    {stat.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
