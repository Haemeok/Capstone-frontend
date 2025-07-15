"use client";

import { useEffect,useState } from "react";

import {
  PWA_PROMPT_DELAY,
  PWA_STORAGE_KEYS,
} from "@/shared/config/constants/pwa";
import { storage } from "@/shared/lib/storage";

import { useUserStore } from "@/entities/user/model/store";

import { usePWAInstall } from "./usePWAInstall";

export const usePWAFirstLoginPrompt = () => {
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const { user } = useUserStore();
  const { isInstallable } = usePWAInstall();

  const checkShouldShowPrompt = () => {
    if (!user) return false;

    if (!isInstallable) return false;

    if (storage.getBooleanItem(PWA_STORAGE_KEYS.FIRST_LOGIN_PROMPTED))
      return false;

    if (storage.getBooleanItem(PWA_STORAGE_KEYS.INSTALL_SKIPPED)) return false;

    return true;
  };

  const markAsPrompted = () => {
    storage.setBooleanItem(PWA_STORAGE_KEYS.FIRST_LOGIN_PROMPTED, true);
  };

  const hidePrompt = () => {
    setShouldShowPrompt(false);
  };

  useEffect(() => {
    if (!checkShouldShowPrompt()) return;

    const timeoutId = setTimeout(() => {
      setShouldShowPrompt(true);
      markAsPrompted();
    }, PWA_PROMPT_DELAY);

    return () => clearTimeout(timeoutId);
  }, [user, isInstallable]);

  return {
    shouldShowPrompt,
    hidePrompt,
  };
};
