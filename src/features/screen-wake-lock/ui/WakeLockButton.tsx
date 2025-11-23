"use client";

import { Lightbulb, LightbulbOff } from "lucide-react";

import { useWakeLock } from "@/shared/hooks/useWakeLock";
import { useToastStore } from "@/widgets/Toast";
import { cn } from "@/shared/lib/utils";

const WakeLockButton = () => {
  const { isActive, isSupported, toggle } = useWakeLock();
  const { addToast } = useToastStore();

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    await toggle();

    if (!isActive) {
      addToast({
        message: "화면 보호기가 켜졌어요. 편하게 요리하세요",
        variant: "success",
        position: "bottom",
      });
    } else {
      addToast({
        message: "화면 보호기가 꺼졌어요",
        variant: "success",
        position: "bottom",
      });
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-colors duration-300",
        isActive
          ? "bg-olive-light shadow-olive-light/30 text-white"
          : "bg-gray-100 text-gray-600"
      )}
      aria-label={isActive ? "화면 보호기 끄기" : "화면 보호기 켜기"}
    >
      {isActive ? (
        <Lightbulb size={20} className="drop-shadow-sm" />
      ) : (
        <LightbulbOff size={20} />
      )}
    </button>
  );
};

export default WakeLockButton;
