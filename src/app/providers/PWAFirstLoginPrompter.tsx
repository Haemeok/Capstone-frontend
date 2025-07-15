"use client";

import { usePWAFirstLoginPrompt } from "@/shared/hooks/usePWAFirstLoginPrompt";
import { usePWAInstallContext } from "./PWAInstallProvider";
import PWAInstallModal from "@/widgets/PWAInstallModal";

/**
 * 첫 로그인 시 PWA 설치 모달을 표시하는 컴포넌트
 * 실제 로직은 usePWAFirstLoginPrompt 훅에서 처리됨
 */
export const PWAFirstLoginPrompter = () => {
  const { shouldShowPrompt, hidePrompt } = usePWAFirstLoginPrompt();
  const { promptInstall, skipInstall, isInstallable } = usePWAInstallContext();

  // PWA 설치가 불가능한 환경에서는 렌더링하지 않음
  if (!isInstallable || !shouldShowPrompt) {
    return null;
  }

  // PWA 설치 실행 후 모달 닫기
  const handleInstall = async () => {
    await promptInstall();
    hidePrompt();
  };

  // PWA 설치 스킵 후 모달 닫기
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
