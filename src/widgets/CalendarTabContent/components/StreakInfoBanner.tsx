import useScrollAnimate from "@/shared/hooks/useScrollAnimate";
import { getFlameLevel } from "../lib/streakCalculator";
import { Fire } from "./fire";
import { useEffect } from "react";

type StreakInfoBannerProps = {
  streakCount: number;
};

const getMotivationalMessage = (streakCount: number): string => {
  if (streakCount === 0) return "오늘부터 직접 요리하며 식비를 절약해보세요!";
  if (streakCount === 1) return "좋은 시작이에요! 계속 이어가봐요";
  if (streakCount < 4) return `${streakCount}일 연속 식비를 절약중이에요`;
  if (streakCount < 7)
    return `${streakCount}일 연속 배달 시키지 않고 직접 해먹고 있어요`;
  if (streakCount < 10) return `대단해요! ${streakCount}일째 요리하고 계시네요`;
  if (streakCount < 20)
    return `정말 멋져요! ${streakCount}일 연속 도전 중이에요`;
  return `놀라워요! ${streakCount}일째 꾸준히 요리하고 계시네요`;
};

export const StreakInfoBanner = ({ streakCount }: StreakInfoBannerProps) => {
  const { targetRef, playAnimation } = useScrollAnimate<HTMLDivElement>();
  const config = getFlameLevel(streakCount);
  const message = getMotivationalMessage(streakCount);

  useEffect(() => {
    playAnimation();
  }, [playAnimation]);

  return (
    <div
      ref={targetRef}
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4"
      style={{ opacity: 0 }}
    >
      <div className="flex w-full items-center gap-3">
        <Fire width={48} height={48} className={config.flameColor} />
        <div className="flex w-full flex-col gap-1">
          <p className="text-3xl font-bold">
            <span className={config.flameColor}>{streakCount}일</span>
          </p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};
