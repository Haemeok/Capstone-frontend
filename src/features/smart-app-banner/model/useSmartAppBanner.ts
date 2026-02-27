"use client";

import { useCallback, useEffect, useState } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { useIsApp } from "@/shared/hooks/useIsApp";
import { storage } from "@/shared/lib/storage";

import { DISMISS_DURATION_MS, SHOW_DELAY_MS } from "./constants";

const isIOS = () => {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const useSmartAppBanner = () => {
  const isApp = useIsApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isApp) return;
    if (!isIOS()) return;

    const isDismissed = storage.getItemWithExpiry<boolean>(
      STORAGE_KEYS.SMART_APP_BANNER_DISMISSED
    );
    if (isDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isApp]);

  const dismiss = useCallback(() => {
    storage.setItemWithExpiry(
      STORAGE_KEYS.SMART_APP_BANNER_DISMISSED,
      true,
      DISMISS_DURATION_MS
    );
    setIsVisible(false);
  }, []);

  return { isVisible, dismiss };
};
