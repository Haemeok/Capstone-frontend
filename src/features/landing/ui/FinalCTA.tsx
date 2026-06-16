import Link from "next/link";

import type { LandingDict, Locale } from "@/shared/i18n";
import { localizedHref } from "@/shared/i18n";
import { Reveal } from "@/shared/ui/Reveal";
import { Button } from "@/shared/ui/shadcn/button";
import { StoreBadges } from "@/shared/ui/StoreBadges";

import { markLandingVisited } from "@/app/landing/actions";
import { resolveLocaleHome } from "@/app/landing/resolveLocaleHome";

export const FinalCTA = ({ t, locale }: { t: LandingDict; locale: Locale }) => {
  const subtitle = t.finalCta.subtitle.replace("{count}", t.recipeCount.label);

  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-24 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(145,199,136,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(67,194,120,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-ink text-5xl leading-[1.1] font-extrabold md:text-6xl lg:text-7xl">
              {t.finalCta.titleLine1}
              <br />
              <span className="relative inline-block">
                <span className="from-olive-light via-olive-mint to-olive-medium absolute -inset-1 animate-pulse bg-gradient-to-r opacity-20 blur-2xl" />
                <span className="from-olive via-olive-medium to-olive-mint relative bg-gradient-to-r bg-clip-text text-transparent">
                  {t.finalCta.titleHighlight}
                </span>
              </span>
            </h2>

            <p className="text-ink-sub mx-auto max-w-3xl text-xl leading-relaxed md:text-2xl">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col items-center gap-5 pt-6 sm:flex-row sm:justify-center">
            <form action={markLandingVisited}>
              <input
                type="hidden"
                name="localeHome"
                value={resolveLocaleHome(locale)}
              />
              <Button
                type="submit"
                size="lg"
                className="group from-olive-medium to-olive-mint shadow-olive-medium/30 hover:shadow-olive-mint/40 relative h-14 overflow-hidden bg-gradient-to-r px-8 text-lg font-bold text-white shadow-2xl transition-all hover:shadow-2xl"
              >
                <span className="relative z-10">{t.finalCta.primaryCta}</span>
                <span className="from-olive to-olive-medium absolute inset-0 -z-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>
            </form>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-ink hover:border-olive hover:bg-olive/10 h-16 border-2 border-gray-300 bg-white px-10 text-xl font-bold backdrop-blur-sm transition-all"
            >
              <Link href={localizedHref("/search", locale)}>
                {t.finalCta.secondaryCta}
              </Link>
            </Button>
          </div>

          <div className="mt-10">
            <StoreBadges showAndroidNote />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
