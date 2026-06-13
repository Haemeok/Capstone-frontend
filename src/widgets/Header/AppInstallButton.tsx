"use client";

import { Download } from "lucide-react";

import {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/shared/config/constants/appStore";
import { useIsApp } from "@/shared/hooks/useIsApp";
import { useChromeDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

const getStoreUrl = () => {
  if (typeof window === "undefined") return APP_STORE_URL;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return APP_STORE_URL;
  return PLAY_STORE_URL;
};

const AppInstallButton = () => {
  const isInApp = useIsApp();
  const t = useChromeDict();

  if (isInApp) return null;

  const handleClick = () => {
    triggerHaptic("Light");
    window.open(getStoreUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="text-olive-light flex items-center gap-1 py-1 text-xs font-semibold transition-colors active:scale-[0.97]"
      aria-label={t.installAria}
    >
      <Download className="h-3.5 w-3.5" />
      <span>{t.install}</span>
    </button>
  );
};

export default AppInstallButton;
