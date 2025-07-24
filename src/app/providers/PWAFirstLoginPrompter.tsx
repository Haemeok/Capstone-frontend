"use client";

import { usePWAFirstLoginPrompt } from "@/shared/hooks/usePWAFirstLoginPrompt";

import PWAInstallModal from "@/widgets/PWAInstallModal";

import { usePWAInstallContext } from "./PWAInstallProvider";

export const PWAFirstLoginPrompter = () => {
  const { shouldShowPrompt, hidePrompt } = usePWAFirstLoginPrompt();
  const { promptInstall, skipInstall, isInstallable } = usePWAInstallContext();

  if (!isInstallable || !shouldShowPrompt) {
    return null;
  }

  const handleInstall = async () => {
    await promptInstall();
    hidePrompt();
  };

  const handleSkip = () => {
    skipInstall();
    hidePrompt();
  };

  return (
    <PWAInstallModal
      isOpen={shouldShowPrompt}
      onOpenChange={hidePrompt}
      onInstall={handleInstall}
      onSkip={handleSkip}
    />
  );
};
