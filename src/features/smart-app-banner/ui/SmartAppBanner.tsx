"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { APP_STORE_URL } from "@/shared/config/constants/appStore";
import { triggerHaptic } from "@/shared/lib/bridge";

import { useSmartAppBanner } from "../model/useSmartAppBanner";

export const SmartAppBanner = () => {
  const { isVisible, dismiss } = useSmartAppBanner();

  const handleCtaClick = () => {
    triggerHaptic("Light");
    window.open(APP_STORE_URL, "_blank", "noopener,noreferrer");
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
          className="fixed bottom-[77px] left-0 right-0 z-toast md:hidden sticky-optimized"
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

              <p className="min-w-0 text-pretty break-keep flex-1 text-sm font-medium text-gray-700">
                앱에서 더 편하게 사용해보세요
              </p>

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
