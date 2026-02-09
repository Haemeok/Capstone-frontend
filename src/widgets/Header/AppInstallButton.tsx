"use client";

import { Download } from "lucide-react";

import { useIsApp } from "@/shared/hooks/useIsApp";
import { triggerHaptic } from "@/shared/lib/bridge";
import {
  APP_STORE_URL,
  ANDROID_FORM_URL,
} from "@/shared/config/constants/appStore";

const getStoreUrl = () => {
  if (typeof window === "undefined") return APP_STORE_URL;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return APP_STORE_URL;
  return ANDROID_FORM_URL;
};

const AppInstallButton = () => {
  const isInApp = useIsApp();

  if (isInApp) return null;

  const handleClick = () => {
    triggerHaptic("Light");
    window.open(getStoreUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-olive-light/10 text-olive-dark flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-colors active:scale-[0.97]"
      aria-label="앱 설치하기"
    >
      <Download className="h-3.5 w-3.5" />
      <span>앱</span>
    </button>
  );
};

export default AppInstallButton;
