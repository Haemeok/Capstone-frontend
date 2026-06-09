"use client";

import {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/shared/config/constants/appStore";
import { useIsApp } from "@/shared/hooks/useIsApp";
import { triggerHaptic } from "@/shared/lib/bridge";

type StoreBadgesProps = {
  showAndroidNote?: boolean;
  className?: string;
};

export const StoreBadges = ({ className }: StoreBadgesProps) => {
  const isInApp = useIsApp();

  if (isInApp) return null;

  const handleClick = () => {
    triggerHaptic("Light");
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ""}`}>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <img
            src="/Download_on_the_App_Store_Badge_KR.svg"
            alt="App Store에서 다운로드"
            className="h-14"
          />
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <img
            src="/googlePlay_Badge_Web_color_ko.png"
            alt="Google Play에서 다운로드"
            className="h-14"
          />
        </a>
      </div>
    </div>
  );
};
