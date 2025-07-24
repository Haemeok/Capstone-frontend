"use client";

import { useEffect, useState } from "react";

import { type CarouselApi } from "@/shared/ui/shadcn/carousel";

type UseSlideShowProgressProps = {
  api: CarouselApi | undefined;
  totalSteps: number;
  recipeStepsLength: number;
};

export const useSlideShowProgress = ({
  api,
  totalSteps,
  recipeStepsLength,
}: UseSlideShowProgressProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onScroll = () => {
      const progress = api.scrollProgress();
      setScrollProgress((progress * recipeStepsLength) / totalSteps);
    };

    api.on("scroll", onScroll);
    setScrollProgress(api.scrollProgress());

    return () => {
      api.off("scroll", onScroll);
    };
  }, [api, recipeStepsLength, totalSteps]);

  const handleProgressClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const getStepProgress = (stepIndex: number) => {
    const stepSize = 1 / totalSteps;
    const stepStart = stepSize * stepIndex;

    const newScrollProgress =
      stepIndex === totalSteps - 1
        ? scrollProgress + stepSize
        : scrollProgress;
    const progressRaw = ((newScrollProgress - stepStart) / stepSize) * 100;

    return Math.max(0, Math.min(100, progressRaw));
  };

  return {
    scrollProgress,
    handleProgressClick,
    getStepProgress,
  };
};