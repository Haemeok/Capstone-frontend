"use client";

import {
  createLandingFAQStructuredData,
  createTagItemListStructuredData,
} from "@/shared/lib/metadata/structuredData";

import {
  FeatureShowcase,
  FinalCTA,
  HeroSection,
  ProblemCards,
  StatsSection,
  TagChipsSection,
  TestimonialCarousel,
} from "@/features/landing";
import { LANDING_TAG_GROUPS } from "@/features/landing/config/landingTags";

const LandingPage = () => {
  const faqJsonLd = createLandingFAQStructuredData();
  const tagItemListJsonLd = createTagItemListStructuredData(
    LANDING_TAG_GROUPS.flatMap((group) => group.chips)
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
      <HeroSection />
      <ProblemCards />
      <StatsSection />
      <TagChipsSection />
      <FeatureShowcase />
      <TestimonialCarousel />
      <FinalCTA />
    </div>
  );
};

export default LandingPage;
