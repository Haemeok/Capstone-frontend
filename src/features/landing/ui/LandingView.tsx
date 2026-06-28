import type { Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n";

import {
  createLandingFAQStructuredData,
  createTagItemListStructuredData,
} from "@/entities/recipe/lib/metadata/schema";

import { LANDING_TAG_GROUPS } from "@/features/landing/config/landingTags";

import { FeatureShowcase } from "./FeatureShowcase";
import { FinalCTA } from "./FinalCTA";
import { HeroSection } from "./HeroSection";
import { ProblemCards } from "./ProblemCards";
import { StatsSection } from "./StatsSection";
import { TagChipsSection } from "./TagChipsSection";
import { TestimonialCarousel } from "./TestimonialCarousel";

export const LandingView = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).landing;
  const faqJsonLd = createLandingFAQStructuredData(locale);
  const tagItemListJsonLd = createTagItemListStructuredData(
    LANDING_TAG_GROUPS.flatMap((group) =>
      group.chips.map((chip) => ({
        code: chip.code,
        name: t.tagChips.chipNames[chip.code] ?? chip.name,
      }))
    )
  );

  return (
    <div className="flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tagItemListJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection t={t} locale={locale} />
      <ProblemCards t={t} locale={locale} />
      <StatsSection t={t} locale={locale} />
      <TagChipsSection t={t} locale={locale} />
      <FeatureShowcase t={t} locale={locale} />
      <TestimonialCarousel t={t} locale={locale} />
      <FinalCTA t={t} locale={locale} />
    </div>
  );
};
