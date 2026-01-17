"use client";

import { useCallback, useEffect, useState } from "react";

import { PWA_STORAGE_KEYS } from "@/shared/config/constants/pwa";
import { storage } from "@/shared/lib/storage";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const isIOSSafari = () => {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isStandalone = (window.navigator as any).standalone === true;
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);

  return isIOS && isSafari && !isStandalone;
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const checkInstallationStatus = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      return true;
    }

    if (
      typeof window !== "undefined" &&
      (window.navigator as any).standalone === true
    ) {
      return true;
    }

    return storage.getBooleanItem(PWA_STORAGE_KEYS.INSTALLED);
  }, []);

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

  const skipInstall = useCallback(() => {
    storage.setBooleanItem(PWA_STORAGE_KEYS.INSTALL_SKIPPED, true);
  }, []);

  useEffect(() => {
    setIsInstalled(checkInstallationStatus());
    setIsIOS(isIOSSafari());

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
    isIOS,
    promptInstall,
    skipInstall,
  };
};
