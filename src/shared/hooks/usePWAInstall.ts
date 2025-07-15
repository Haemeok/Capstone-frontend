"use client";

import { useCallback,useEffect, useState } from "react";

import { PWA_STORAGE_KEYS } from "@/shared/config/constants/pwa";
import { storage } from "@/shared/lib/storage";

// beforeinstallprompt 이벤트 타입 정의
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * PWA 설치 상태와 프롬프트를 관리하는 훅
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // PWA 설치 상태 확인
  const checkInstallationStatus = useCallback(() => {
    // 1. 스탠드얼론 모드로 실행 중인지 확인
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      return true;
    }

    // 2. iOS Safari의 홈 화면 추가 확인
    if (
      typeof window !== "undefined" &&
      (window.navigator as any).standalone === true
    ) {
      return true;
    }

    // 3. localStorage에서 설치 상태 확인
    return storage.getBooleanItem(PWA_STORAGE_KEYS.INSTALLED);
  }, []);

  // PWA 설치 프롬프트 실행
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("사용자가 PWA 설치를 수락했습니다");
      } else {
        console.log("사용자가 PWA 설치를 거부했습니다");
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error("PWA 설치 프롬프트 에러:", error);
    }
  }, [deferredPrompt]);

  // 설치 프롬프트 스킵 처리
  const skipInstall = useCallback(() => {
    storage.setBooleanItem(PWA_STORAGE_KEYS.INSTALL_SKIPPED, true);
  }, []);

  useEffect(() => {
    setIsInstalled(checkInstallationStatus());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      console.log("PWA가 성공적으로 설치되었습니다!");
      setIsInstalled(true);
      setDeferredPrompt(null);
      storage.setBooleanItem(PWA_STORAGE_KEYS.INSTALLED, true);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
      }
    };
  }, [checkInstallationStatus]);

  return {
    isInstallable: !!deferredPrompt && !isInstalled,
    isInstalled,
    promptInstall,
    skipInstall,
  };
};
