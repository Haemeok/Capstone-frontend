"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

import { TimerRoot, TimerDisplay, useTimer } from "@/shared/ui/shadcn/timer";
import { cn } from "@/shared/lib/utils";

type StepTimerProps = {
  targetSeconds: number;
};

const StepTimer = ({ targetSeconds }: StepTimerProps) => {
  const [isRunning, setIsRunning] = useState(false);

  const { formattedTime, elapsedTime, reset, start, stop } = useTimer({
    loading: isRunning,
    resetOnLoadingChange: false,
    format: "MM:SS",
  });

  const isOvertime = elapsedTime > targetSeconds;

  const handlePlayPause = () => {
    if (isRunning) {
      stop();
      setIsRunning(false);
    } else {
      start();
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    reset();
    setIsRunning(false);
  };

  const formatTargetTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      <TimerRoot
        variant={isOvertime ? "destructive" : "default"}
        size="sm"
        loading={isRunning}
        className={cn("gap-1 md:text-sm", isOvertime && "animate-shake")}
      >
        <TimerDisplay
          size="sm"
          time={formattedTime.display}
          className="md:text-sm"
        />
        <span className="text-[10px] opacity-60 md:text-xs">
          / {formatTargetTime(targetSeconds)}
        </span>
      </TimerRoot>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePlayPause}
          className={cn(
            "flex cursor-pointer items-center justify-center rounded-full transition-all",
            "h-6 w-6 md:h-9 md:w-9",
            isOvertime
              ? "bg-red-100 text-red-600"
              : "bg-olive-light/10 text-olive-dark"
          )}
          aria-label={isRunning ? "일시정지" : "시작"}
        >
          {isRunning ? (
            <Pause size={12} className="md:h-5 md:w-5" />
          ) : (
            <Play size={12} className="md:h-5 md:w-5" />
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className={cn(
            "flex cursor-pointer items-center justify-center rounded-full transition-all",
            "h-6 w-6 md:h-9 md:w-9",
            isOvertime
              ? "bg-red-100 text-red-600"
              : "bg-olive-light/10 text-olive-dark"
          )}
          aria-label="초기화"
        >
          <RotateCcw size={12} className="md:h-5 md:w-5" />
        </button>
      </div>
    </div>
  );
};

export default StepTimer;
