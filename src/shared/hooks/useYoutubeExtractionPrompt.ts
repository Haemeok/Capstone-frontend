"use client";

import { useEffect, useState } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { PWA_STORAGE_KEYS } from "@/shared/config/constants/pwa";
import { storage } from "@/shared/lib/storage";

import { useUserStore } from "@/entities/user/model/store";

const YOUTUBE_EXTRACTION_PROMPT_DELAY_MS = 500;

export const useYoutubeExtractionPrompt = () => {
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const { user } = useUserStore();

  const checkShouldShowPrompt = () => {
    if (!user) return false;

    if (storage.getBooleanItem(STORAGE_KEYS.YOUTUBE_EXTRACTION_PROMPTED))
      return false;

    return true;
  };

  const markAsPrompted = () => {
    storage.setBooleanItem(STORAGE_KEYS.YOUTUBE_EXTRACTION_PROMPTED, true);
  };

  const hidePrompt = () => {
    setShouldShowPrompt(false);
  };

  useEffect(() => {
    if (!checkShouldShowPrompt()) return;

    const pwaPromptShown = storage.getBooleanItem(
      PWA_STORAGE_KEYS.FIRST_LOGIN_PROMPTED
    );
    const delay = pwaPromptShown ? YOUTUBE_EXTRACTION_PROMPT_DELAY_MS : 0;

    const timeoutId = setTimeout(() => {
      setShouldShowPrompt(true);
      markAsPrompted();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [user]);

  return {
    shouldShowPrompt,
    hidePrompt,
  };
};
