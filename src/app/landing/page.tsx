"use client";

import {
  HeroSection,
  RecipeCarousel,
  ProblemCards,
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
        <RecipeCarousel />
        <ProblemCards />
        <FeatureShowcase />
        <TestimonialCarousel />
        <FinalCTA />
      </div>
      <DesktopFooter />
    </>
  );
};

export default LandingPage;
