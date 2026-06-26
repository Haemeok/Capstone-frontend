"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { useLoginPromotionDict, useLoginPromotionLocale } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image";

import { useUserStore } from "@/entities/user/model/store";

const YouTubeIcon = (
  <svg
    role="img"
    aria-label="YouTube"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    preserveAspectRatio="xMidYMid"
    className="shrink-0 fill-red-500"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    <path d="M9.545 8.432v7.136L15.818 12z" className="fill-white" />
  </svg>
);

type LoginPromotionBadgeProps = {
  variant: "desktop" | "mobile" | "mobile-detailed";
  children: React.ReactNode;
  popupClassName?: string;
};

const LoginPromotionBadge = ({
  variant,
  children,
  popupClassName,
}: LoginPromotionBadgeProps) => {
  const { user, isAuthReady } = useUserStore();
  const [isDesktopBadgeClosed, setIsDesktopBadgeClosed] = useState(false);
  const t = useLoginPromotionDict();
  const locale = useLoginPromotionLocale();
  const wrapClass = locale === "ko" ? "break-keep" : "break-words";

  const renderBody = (text: string) => {
    const parts = text.split(t.highlight);
    if (parts.length < 2) return text;
    return (
      <>
        {parts[0]}
        <span className="text-olive-mint font-bold">{t.highlight}</span>
        {parts.slice(1).join(t.highlight)}
      </>
    );
  };

  if (user || !isAuthReady) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      {children}

      {variant === "desktop" && !isDesktopBadgeClosed && (
        <div
          className={cn(
            "animate-bounce-soft absolute top-12 right-0 z-[100] w-72 max-w-[calc(100vw-2rem)] transform rounded-lg border border-green-100 bg-white p-4 shadow-xl",
            popupClassName
          )}
        >
          <button
            onClick={() => setIsDesktopBadgeClosed(true)}
            className="hover:text-ink-sub absolute top-2 right-2 cursor-pointer text-gray-400 transition-colors"
            aria-label={t.closeAria}
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-1">
            <Image
              src={`${ICON_BASE_URL}ingredient_to_recipe.webp`}
              alt={t.imageAlt}
              wrapperClassName="w-16 h-16"
            />
            <p className={`text-ink pr-6 font-bold ${wrapClass}`}>
              {t.headline}
            </p>
          </div>
          <p className={`text-ink-sub mt-1 text-sm ${wrapClass}`}>
            {renderBody(t.body)}
          </p>
          <div className="mt-2 text-xs text-gray-400">{t.newUserBadge}</div>
          <div className="absolute -top-2 right-8 transform">
            <div className="h-0 w-0 border-r-8 border-b-8 border-l-8 border-transparent border-b-white"></div>
          </div>
        </div>
      )}

      {variant === "mobile" && (
        <div className="z-modal absolute -top-10 -right-2">
          <div className="bg-olive-mint flex animate-bounce items-center gap-1 rounded-lg p-2 text-xs font-bold text-white shadow-lg">
            {YouTubeIcon}
            <p className="whitespace-nowrap">{t.mobileBadge}</p>
          </div>
        </div>
      )}

      {variant === "mobile-detailed" && (
        <div className="absolute top-full right-0 z-[100] mt-2 w-64 max-w-[calc(100vw-2rem)]">
          <div className="rounded-lg border border-green-100 bg-white p-3 shadow-xl">
            <Image
              src={`${ICON_BASE_URL}ingredient_to_recipe.webp`}
              alt={t.imageAlt}
              wrapperClassName="w-4 h-4"
            />
            <p className={`text-ink text-sm font-bold ${wrapClass}`}>
              {t.headline}
            </p>
            <p className={`text-ink-sub mt-1 text-xs ${wrapClass}`}>
              {renderBody(t.bodyDetailed)}
            </p>
            <div className="mt-1 text-[10px] text-gray-400">
              {t.newUserBadge}
            </div>
            <div className="absolute right-8 bottom-full">
              <div className="h-0 w-0 border-r-6 border-b-6 border-l-6 border-transparent border-b-white"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPromotionBadge;
