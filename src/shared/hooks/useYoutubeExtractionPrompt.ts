"use client";

import { useEffect, useState } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
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

    const timeoutId = setTimeout(() => {
      setShouldShowPrompt(true);
      markAsPrompted();
    }, YOUTUBE_EXTRACTION_PROMPT_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [user]);

  return {
    shouldShowPrompt,
    hidePrompt,
  };
};
