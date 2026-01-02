"use client";

import { useAICreditPrompt } from "@/shared/hooks/useAICreditPrompt";

import AICreditDrawer from "@/widgets/AICreditDrawer";

export const AICreditPrompter = () => {
  const { shouldShowPrompt, hidePrompt } = useAICreditPrompt();

  if (!shouldShowPrompt) {
    return null;
  }

  return <AICreditDrawer isOpen={shouldShowPrompt} onOpenChange={hidePrompt} />;
};
