import {
  COUNTRY_DEFINITIONS,
  SORT_TYPE_CODES,
} from "@/shared/config/constants/recipe";
import type { Locale } from "@/shared/i18n";
import { getDictionary, localizedHref } from "@/shared/i18n";

import EventCtaButton from "./EventCtaButton";
import EventFAQ from "./EventFAQ";
import EventPageShell from "./EventPageShell";
import EventSection from "./EventSection";

export const WorldRecipesEventView = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).events;
  const w = t.worldRecipes;

  const popularWorldSearchHref = localizedHref(
    `/search/results?${new URLSearchParams({
      sort: SORT_TYPE_CODES.인기순,
      creatorCountryTags: COUNTRY_DEFINITIONS.filter(
        (country) => country.code !== "KR"
      )
        .map((country) => country.code)
        .join(","),
    }).toString()}`,
    locale
  );

  return (
    <EventPageShell
      title={w.headerTitle}
      heroSrc="/events/world-recipes/hero.png"
      heroAlt={w.heroAlt}
    >
      <EventSection label={w.intro.label} title={w.intro.title}>
        <p className="text-ink-sub text-base leading-7">{w.intro.body}</p>
      </EventSection>
      <EventSection label={w.howTo.label} title={w.howTo.title}>
        <p className="text-ink-sub mb-5 text-base leading-7">
          {w.howTo.body.lead}
          <b className="text-ink font-semibold">{w.howTo.body.filter}</b>
          {w.howTo.body.middle}
          <b className="text-ink font-semibold">{w.howTo.body.country}</b>
          {w.howTo.body.tail}
        </p>
        <EventCtaButton label={w.howTo.cta} href={popularWorldSearchHref} />
      </EventSection>
      <EventFAQ heading={t.faqHeading} items={w.faq} />
    </EventPageShell>
  );
};
