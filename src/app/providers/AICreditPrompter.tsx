"use client";

import { useAICreditPrompt } from "@/entities/user/model/useAICreditPrompt";

import AICreditDrawer from "@/widgets/AICreditDrawer";

export const AICreditPrompter = () => {
  const { shouldShowPrompt, hidePrompt } = useAICreditPrompt();

  if (!shouldShowPrompt) {
    return null;
  }

  return <AICreditDrawer isOpen={shouldShowPrompt} onOpenChange={hidePrompt} />;
};
