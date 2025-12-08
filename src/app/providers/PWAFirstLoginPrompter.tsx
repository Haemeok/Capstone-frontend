"use client";

import { usePWAFirstLoginPrompt } from "@/shared/hooks/usePWAFirstLoginPrompt";

import IOSInstallGuideModal from "@/widgets/IOSInstallGuideModal";
import PWAInstallModal from "@/widgets/PWAInstallModal";

import { usePWAInstallContext } from "./PWAInstallProvider";

export const PWAFirstLoginPrompter = () => {
  const { shouldShowPrompt, hidePrompt } = usePWAFirstLoginPrompt();
  const { promptInstall, skipInstall, isInstallable, isIOS } =
    usePWAInstallContext();

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

  if (isIOS) {
    return (
      <IOSInstallGuideModal isOpen={shouldShowPrompt} onOpenChange={hidePrompt} />
    );
  }

  return (
    <PWAInstallModal
      isOpen={shouldShowPrompt}
      onOpenChange={hidePrompt}
      onInstall={handleInstall}
      onSkip={handleSkip}
      isIOS={false}
    />
  );
};
