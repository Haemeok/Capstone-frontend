"use client";

import {
  HeroSection,
  ProblemCards,
  StatsSection,
  FeatureShowcase,
  TestimonialCarousel,
  FinalCTA,
} from "@/features/landing";

import DesktopFooter from "@/widgets/Footer/DesktopFooter";

const LandingPage = () => {
  return (
    <>
      <div className="flex flex-col bg-white">
        <HeroSection />
        <ProblemCards />
        <StatsSection />
        <FeatureShowcase />
        <TestimonialCarousel />
        <FinalCTA />
      </div>
      <DesktopFooter />
    </>
  );
};

export default LandingPage;
