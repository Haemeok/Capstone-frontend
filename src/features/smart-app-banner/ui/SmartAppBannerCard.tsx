"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { X } from "lucide-react";

import { APP_STORE_URL } from "@/shared/config/constants/appStore";
import { useSmartAppBannerDict, useSmartAppBannerLocale } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

type SmartAppBannerCardProps = {
  onDismiss: () => void;
};

export const SmartAppBannerCard = ({ onDismiss }: SmartAppBannerCardProps) => {
  const t = useSmartAppBannerDict();
  const locale = useSmartAppBannerLocale();

  const handleCtaClick = () => {
    triggerHaptic("Light");
    sendGAEvent("event", "app_open_click", { locale });
    window.open(APP_STORE_URL, "_blank", "noopener,noreferrer");
  };

  const handleDismiss = () => {
    triggerHaptic("Light");
    onDismiss();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 pb-2">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-lg">
        <img
          src="/favicon-96x96.png"
          alt="Recipio"
          className="h-10 w-10 shrink-0 rounded-xl"
          width={40}
          height={40}
        />

        <p className="text-ink-sub min-w-0 flex-1 text-sm font-medium text-pretty break-keep">
          {t.message}
        </p>

        <button
          onClick={handleCtaClick}
          className="bg-olive-light shrink-0 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all active:scale-[0.97]"
        >
          {t.cta}
        </button>

        <button
          onClick={handleDismiss}
          className="hover:text-ink-sub shrink-0 p-1 text-gray-400 transition-colors"
          aria-label={t.dismissAria}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
