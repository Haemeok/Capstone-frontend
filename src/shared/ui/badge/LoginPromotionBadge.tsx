"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { useUserStore } from "@/entities/user";
import { Image } from "../image";
import { ICON_BASE_URL } from "@/shared/config/constants/recipe";

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
  const { user } = useUserStore();
  const [isDesktopBadgeClosed, setIsDesktopBadgeClosed] = useState(false);

  if (user) {
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
            className="absolute top-2 right-2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-1">
            <Image
              src={`${ICON_BASE_URL}ingredient_to_recipe.webp`}
              alt="재료만 골라주세요, 레시피는 맡기세요"
              wrapperClassName="w-16 h-16"
            />
            <p className="pr-6 font-bold break-keep text-gray-800">
              재료만 골라주세요, 레시피는 맡기세요
            </p>
          </div>
          <p className="mt-1 text-sm break-keep text-gray-600">
            냉장고 속 재료부터 파인다이닝까지, 지금 가입하면{" "}
            <span className="text-olive-mint font-bold">매일 1회 무료</span>로
            만들어 드려요.
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
          <div className="bg-olive-mint flex animate-bounce items-center gap-1 rounded-lg p-2 text-xs font-bold whitespace-nowrap text-white shadow-lg">
            <Image
              src={`${ICON_BASE_URL}ai_chef.webp`}
              alt="AI 셰프"
              wrapperClassName="w-5 h-5"
            />
            <p> AI 셰프가 매일 무료!</p>
          </div>
        </div>
      )}

      {variant === "mobile-detailed" && (
        <div className="absolute top-full right-0 z-[100] mt-2 w-64 max-w-[calc(100vw-2rem)]">
          <div className="rounded-lg border border-green-100 bg-white p-3 shadow-xl">
            <Image
              src={`${ICON_BASE_URL}ingredient_to_recipe.webp`}
              alt="재료만 골라주세요, 레시피는 맡기세요"
              wrapperClassName="w-4 h-4"
            />
            <p className="text-sm font-bold break-keep text-gray-800">
              재료만 골라주세요, 레시피는 맡기세요
            </p>
            <p className="mt-1 text-xs break-keep text-gray-600">
              냉장고 속 재료부터 파인다이닝까지, 가입하고{" "}
              <span className="text-olive-mint font-bold">매일 1회 무료</span>로
              받아보세요.
            </p>
            <div className="mt-1 text-[10px] text-gray-400">
              신규 가입자 한정 혜택
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
