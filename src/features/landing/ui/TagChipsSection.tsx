import Link from "next/link";

import type { LandingDict, Locale } from "@/shared/i18n";
import { Reveal } from "@/shared/ui/Reveal";

import {
  buildTagSearchUrl,
  LANDING_TAG_GROUPS,
} from "@/features/landing/config/landingTags";

export const TagChipsSection = (_props: { t: LandingDict; locale: Locale }) => {
  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-12 md:py-20">
      <div className="bg-olive-mint/5 absolute top-1/3 right-0 h-80 w-80 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mb-12 text-center">
          <div className="bg-olive-light/10 text-olive-medium mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold">
            상황별 레시피
          </div>
          <h2 className="text-ink mb-4 text-4xl font-extrabold md:text-5xl">
            이런 날에도, 이런 상황에도
          </h2>
          <p className="text-ink-sub mx-auto max-w-2xl text-lg">
            원하는 상황에 딱 맞는 레시피를 바로 찾아보세요
          </p>
        </Reveal>

        <div className="space-y-8">
          {LANDING_TAG_GROUPS.map((group) => (
            <Reveal
              key={group.id}
              className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6"
            >
              <div className="flex items-center gap-2 md:w-52 md:shrink-0">
                <span className="text-2xl">{group.emoji}</span>
                <span className="text-ink text-base font-bold md:text-lg">
                  {group.label}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3">
                {group.chips.map((chip) => (
                  <Link
                    key={chip.code}
                    href={buildTagSearchUrl(chip.code)}
                    className="hover:border-olive-light hover:bg-olive-light/10 hover:text-olive-medium text-ink-sub inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-all active:scale-[0.97] md:text-base"
                  >
                    # {chip.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
