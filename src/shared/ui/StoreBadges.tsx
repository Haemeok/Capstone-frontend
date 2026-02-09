"use client";

import { motion } from "motion/react";

import { useIsApp } from "@/shared/hooks/useIsApp";
import { triggerHaptic } from "@/shared/lib/bridge";
import {
  APP_STORE_URL,
  ANDROID_FORM_URL,
} from "@/shared/config/constants/appStore";

type StoreBadgesProps = {
  showAndroidNote?: boolean;
  className?: string;
};

export const StoreBadges = ({
  showAndroidNote = false,
  className,
}: StoreBadgesProps) => {
  const isInApp = useIsApp();

  if (isInApp) return null;

  const handleClick = () => {
    triggerHaptic("Light");
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ""}`}>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <motion.a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src="/Download_on_the_App_Store_Badge_KR.svg"
            alt="App Store에서 다운로드"
            className="h-11"
          />
        </motion.a>
        <motion.a
          href={ANDROID_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src="/googlePlay_Badge_Web_color_ko.png"
            alt="Google Play에서 다운로드"
            className="h-11"
          />
        </motion.a>
      </div>
      {showAndroidNote && (
        <p className="text-xs text-gray-400">
          * Android는 이메일로 설치 링크를 보내드립니다
        </p>
      )}
    </div>
  );
};
