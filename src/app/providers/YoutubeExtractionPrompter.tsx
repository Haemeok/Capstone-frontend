"use client";

import dynamic from "next/dynamic";

import { useYoutubeExtractionPrompt } from "@/shared/hooks/useYoutubeExtractionPrompt";

const YoutubeExtractionDrawer = dynamic(
  () => import("@/widgets/YoutubeExtractionDrawer"),
  { ssr: false }
);

export const YoutubeExtractionPrompter = () => {
  const { shouldShowPrompt, hidePrompt } = useYoutubeExtractionPrompt();

  if (!shouldShowPrompt) {
    return null;
  }

  return (
    <YoutubeExtractionDrawer
      isOpen={shouldShowPrompt}
      onOpenChange={hidePrompt}
    />
  );
};
