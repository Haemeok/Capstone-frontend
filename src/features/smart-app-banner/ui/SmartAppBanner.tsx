"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  ANDROID_FORM_URL,
  APP_STORE_URL,
} from "@/shared/config/constants/appStore";
import { triggerHaptic } from "@/shared/lib/bridge";

import { useSmartAppBanner } from "../model/useSmartAppBanner";

const getStoreUrl = () => {
  if (typeof window === "undefined") return APP_STORE_URL;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return APP_STORE_URL;
  return ANDROID_FORM_URL;
};

export const SmartAppBanner = () => {
  const { isVisible, dismiss } = useSmartAppBanner();

  const handleCtaClick = () => {
    triggerHaptic("Light");
    window.open(getStoreUrl(), "_blank", "noopener,noreferrer");
  };

  const handleDismiss = () => {
    triggerHaptic("Light");
    dismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-[77px] left-0 right-0 z-sticky md:hidden sticky-optimized"
        >
          <div className="mx-auto w-full max-w-4xl px-3 pb-2">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-lg">
              <img
                src="/favicon-96x96.png"
                alt="Recipio"
                className="h-10 w-10 shrink-0 rounded-xl"
                width={40}
                height={40}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight text-gray-900">
                  이 레시피를 폰에 저장해두고
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  장볼 때 꺼내보세요
                </p>
              </div>

              <button
                onClick={handleCtaClick}
                className="shrink-0 rounded-xl bg-olive-light px-4 py-2 text-sm font-bold text-white transition-all active:scale-[0.97]"
              >
                앱에서 열기
              </button>

              <button
                onClick={handleDismiss}
                className="shrink-0 p-1 text-gray-400 transition-colors hover:text-gray-600"
                aria-label="배너 닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
