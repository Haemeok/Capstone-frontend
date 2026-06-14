"use client";

import { useEffect } from "react";

import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import useScrollAnimate from "@/shared/hooks/useScrollAnimate";
import { format, plural, useUserPagesDict } from "@/shared/i18n";
import { Image } from "@/shared/ui/image/Image";

import { motivationalMessage } from "../lib/motivationalMessage";
import { getFlameLevel } from "../lib/streakCalculator";

type StreakInfoBannerProps = {
  streakCount: number;
};

export const StreakInfoBanner = ({ streakCount }: StreakInfoBannerProps) => {
  const t = useUserPagesDict();
  const { targetRef, playAnimation } = useScrollAnimate<HTMLDivElement>();
  const config = getFlameLevel(streakCount);
  const message = motivationalMessage(streakCount, t.calendar.streakMessages);
  const dayLabel = format(plural(streakCount, t.calendar.streakDays), {
    n: streakCount,
  });

  useEffect(() => {
    playAnimation();
  }, [playAnimation]);

  return (
    <div
      ref={targetRef}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5"
      style={{ opacity: 0 }}
    >
      <div className="flex w-full items-center gap-3">
        <Image
          src={`${ICON_BASE_URL}streak_fire.webp`}
          alt={t.calendar.streakAlt}
          wrapperClassName="w-12 h-12"
          lazy={false}
          imgClassName={config.flameColor}
        />
        <div className="flex w-full flex-col gap-1">
          <p className="text-2xl font-bold">
            <span className={config.flameColor}>{dayLabel}</span>
          </p>
          <p className="text-ink-sub text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};
