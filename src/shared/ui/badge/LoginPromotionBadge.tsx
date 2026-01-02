"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { useUserStore } from "@/entities/user";

type LoginPromotionBadgeProps = {
  variant: "desktop" | "mobile" | "mobile-detailed";
  children: React.ReactNode;
};

const LoginPromotionBadge = ({
  variant,
  children,
}: LoginPromotionBadgeProps) => {
  const { user } = useUserStore();
  const [isDesktopBadgeClosed, setIsDesktopBadgeClosed] = useState(false);

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      {children}

      {variant === "desktop" && !isDesktopBadgeClosed && (
        <div className="animate-bounce-soft absolute top-12 right-0 z-[100] w-64 max-w-[calc(100vw-2rem)] transform rounded-lg border border-green-100 bg-white p-4 shadow-xl">
          <button
            onClick={() => setIsDesktopBadgeClosed(true)}
            className="absolute top-2 right-2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
          <p className="pr-6 font-bold text-gray-800">
            📸 사진 없는 레시피는 그만!
          </p>
          <p className="mt-1 text-sm text-gray-600">
            지금 가입하면{" "}
            <span className="text-olive-mint font-bold">
              매일 1회 AI 생성권
            </span>
            을 무료로 드려요.
          </p>
          <div className="mt-2 text-xs text-gray-400">
            신규 가입자 한정 혜택
          </div>
          <div className="absolute -top-2 right-8 transform">
            <div className="h-0 w-0 border-r-8 border-b-8 border-l-8 border-transparent border-b-white"></div>
          </div>
        </div>
      )}

      {variant === "mobile" && (
        <div className="z-modal absolute -top-10 -right-2">
          <div className="bg-olive-mint animate-bounce rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap text-white shadow-lg">
            🎁 매일 1회 무료!
            <div className="absolute top-full right-4">
              <div className="border-t-olive-mint h-0 w-0 border-t-4 border-r-4 border-l-4 border-transparent"></div>
            </div>
          </div>
        </div>
      )}

      {variant === "mobile-detailed" && (
        <div className="absolute right-0 top-full z-[100] mt-2 w-64 max-w-[calc(100vw-2rem)]">
          <div className="rounded-lg border border-green-100 bg-white p-3 shadow-xl">
            <p className="text-sm font-bold text-gray-800">
              📸 사진 없는 레시피는 그만!
            </p>
            <p className="mt-1 text-xs text-gray-600">
              지금 가입하면{" "}
              <span className="text-olive-mint font-bold">
                매일 1회 AI 생성권
              </span>
              을 무료로 드려요.
            </p>
            <div className="mt-1 text-[10px] text-gray-400">
              신규 가입자 한정 혜택
            </div>
            <div className="absolute bottom-full right-8">
              <div className="h-0 w-0 border-b-6 border-r-6 border-l-6 border-transparent border-b-white"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPromotionBadge;
