"use client";

import { CircularProgress } from "./CircularProgress";

const AnimatedStatusText = () => (
  <p className="text-[15px] font-semibold text-white drop-shadow-md">
    레시피 추출 중
    <span className="ml-1 inline-flex w-6">
      <span className="animate-[bounce_1s_0ms_infinite]">.</span>
      <span className="animate-[bounce_1s_150ms_infinite]">.</span>
      <span className="animate-[bounce_1s_300ms_infinite]">.</span>
    </span>
  </p>
);

type PendingStateProps = {
  progress: number;
};

export const PendingState = ({ progress }: PendingStateProps) => (
  <>
    <AnimatedStatusText />
    <div className="relative h-20 w-20">
      <CircularProgress
        value={Math.round(progress)}
        size={80}
        strokeWidth={6}
      />
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white drop-shadow-md">
        {Math.round(progress)}%
      </span>
    </div>
  </>
);
