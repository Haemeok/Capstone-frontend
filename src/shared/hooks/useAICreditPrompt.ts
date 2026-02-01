"use client";

import { useEffect, useState } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { storage } from "@/shared/lib/storage";

import { useUserStore } from "@/entities/user/model/store";

const AI_CREDIT_PROMPT_DELAY = 500;

export const useAICreditPrompt = () => {
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const { user } = useUserStore();

  const checkShouldShowPrompt = () => {
    if (!user) return false;

    if (storage.getBooleanItem(STORAGE_KEYS.AI_CREDIT_PROMPTED)) return false;

    return true;
  };

  const markAsPrompted = () => {
    storage.setBooleanItem(STORAGE_KEYS.AI_CREDIT_PROMPTED, true);
  };

  const hidePrompt = () => {
    setShouldShowPrompt(false);
  };

  useEffect(() => {
    if (!checkShouldShowPrompt()) return;

    const timeoutId = setTimeout(() => {
      setShouldShowPrompt(true);
      markAsPrompted();
    }, AI_CREDIT_PROMPT_DELAY);

    return () => clearTimeout(timeoutId);
  }, [user]);

  return {
    shouldShowPrompt,
    hidePrompt,
  };
};
