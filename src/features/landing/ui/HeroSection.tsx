import type { LandingDict, Locale } from "@/shared/i18n";
import { localizedHref } from "@/shared/i18n";
import { Button } from "@/shared/ui/shadcn/button";
import { StoreBadges } from "@/shared/ui/StoreBadges";

import { markLandingVisited } from "@/app/landing/actions";

import { CarouselRow } from "./RecipeCarousel";

export const HeroSection = ({
  t,
  locale,
}: {
  t: LandingDict;
  locale: Locale;
}) => {
  const badge = t.hero.badge.replace("{count}", t.recipeCount.label);
  const subjectRest = t.hero.subjectRest.replace(
    "{count}",
    t.recipeCount.label
  );

  return (
    <section className="via-beige/30 relative overflow-hidden bg-gradient-to-b from-white to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(145,199,136,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(67,194,120,0.08),transparent_50%)]" />

      <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 pt-20 text-center md:pt-32">
        <div
          className="hero-rise border-olive-light/30 bg-olive-light/10 text-olive-medium mb-6 inline-block rounded-full border px-6 py-2 text-sm font-bold backdrop-blur-sm"
          style={{ animationDelay: "0.1s" }}
        >
          🍳 {badge}
        </div>

        <h1
          className="hero-rise text-ink mb-8 max-w-5xl text-5xl leading-[1.15] font-extrabold tracking-tight md:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.2s" }}
        >
          {t.hero.titleLine1}
          <br />
          <span className="relative inline-block">
            <span className="from-olive-light via-olive-mint to-olive-medium absolute -inset-1 animate-pulse bg-gradient-to-r opacity-20 blur-2xl" />
            <span className="from-olive via-olive-medium to-olive-mint relative bg-gradient-to-r bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </span>
        </h1>

        <p
          className="hero-rise text-ink-sub mb-12 max-w-3xl text-xl leading-relaxed md:text-2xl"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="text-olive-medium font-semibold">
            {t.hero.subjectHighlight}
          </span>
          {subjectRest}
        </p>

        <form
          action={markLandingVisited}
          className="hero-rise flex flex-col items-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.6s" }}
        >
          <input
            type="hidden"
            name="localeHome"
            value={localizedHref("/", locale)}
          />
          <Button
            type="submit"
            size="lg"
            className="group from-olive-medium to-olive-mint shadow-olive-medium/30 hover:shadow-olive-mint/40 relative h-14 overflow-hidden bg-gradient-to-r px-8 text-lg font-bold text-white shadow-2xl transition-all hover:shadow-2xl"
          >
            <span className="relative z-10">{t.hero.cta}</span>
            <span className="from-olive to-olive-medium absolute inset-0 -z-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>
        </form>

        <div className="hero-rise mt-8" style={{ animationDelay: "0.8s" }}>
          <StoreBadges showAndroidNote />
        </div>

        <div
          className="hero-rise text-ink-muted mt-16 flex flex-wrap items-center justify-center gap-8 text-sm"
          style={{ animationDelay: "1.2s" }}
        >
          {t.hero.checklist.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-12 pb-8">
        <div className="space-y-5">
          <CarouselRow direction="left" />
          <CarouselRow direction="right" />
        </div>
      </div>
    </section>
  );
};
