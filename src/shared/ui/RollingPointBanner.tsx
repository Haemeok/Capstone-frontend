"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import useScrollAnimate from "@/shared/hooks/useScrollAnimate";

import { cn } from "@/lib/utils";

type RollingMessage = {
  prefix: string;
  pointText: string;
  suffix: string;
  textClassName?: string;
};

type RollingPointBannerProps = {
  messages: RollingMessage[];
  intervalMs?: number;
  containerClassName?: string;
};

const DEFAULT_INTERVAL_MS = 4500;
const SLIDE_DURATION_S = 0.9;
const SLIDE_Y_OFFSET = 10;
const SLIDE_EASE = [0.22, 1, 0.36, 1] as const;

const RollingPointBanner = ({
  messages,
  intervalMs = DEFAULT_INTERVAL_MS,
  containerClassName,
}: RollingPointBannerProps) => {
  const { targetRef } = useScrollAnimate<HTMLDivElement>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [messages.length, intervalMs]);

  const safeIndex = messages.length > 0 ? currentIndex % messages.length : 0;
  const currentMessage = messages[safeIndex];
  if (!currentMessage) return null;

  return (
    <div
      ref={targetRef}
      className={cn(
        "relative flex h-6 justify-center overflow-hidden text-sm font-bold text-gray-400 opacity-0",
        containerClassName
      )}
    >
      <AnimatePresence>
        <motion.div
          key={safeIndex}
          initial={{ y: SLIDE_Y_OFFSET, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -SLIDE_Y_OFFSET, opacity: 0 }}
          transition={{ duration: SLIDE_DURATION_S, ease: SLIDE_EASE }}
          className="absolute inset-0 flex items-center justify-center gap-1"
        >
          <span>{currentMessage.prefix}</span>
          <span
            className={cn(
              "text-olive-mint mx-1 font-bold",
              currentMessage.textClassName
            )}
          >
            {currentMessage.pointText}
          </span>
          <span>{currentMessage.suffix}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RollingPointBanner;
