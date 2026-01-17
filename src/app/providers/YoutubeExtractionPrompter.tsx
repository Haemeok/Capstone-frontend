"use client";

import { useYoutubeExtractionPrompt } from "@/shared/hooks/useYoutubeExtractionPrompt";

import YoutubeExtractionDrawer from "@/widgets/YoutubeExtractionDrawer";

export const YoutubeExtractionPrompter = () => {
  const { shouldShowPrompt, hidePrompt } = useYoutubeExtractionPrompt();

  if (!shouldShowPrompt) {
    return null;
  }

  return (
    <YoutubeExtractionDrawer isOpen={shouldShowPrompt} onOpenChange={hidePrompt} />
  );
};
