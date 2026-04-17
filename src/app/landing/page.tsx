"use client";

import {
  FeatureShowcase,
  FinalCTA,
  HeroSection,
  ProblemCards,
  StatsSection,
  TestimonialCarousel,
} from "@/features/landing";

const LandingPage = () => {
  return (
    <div className="flex flex-col bg-white">
      <HeroSection />
      <ProblemCards />
      <StatsSection />
      <FeatureShowcase />
      <TestimonialCarousel />
      <FinalCTA />
    </div>
  );
};

export default LandingPage;
