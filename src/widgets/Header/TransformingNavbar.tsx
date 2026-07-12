"use client";

import React, { useEffect, useState } from "react";

import { motion, useScroll, useTransform } from "motion/react";

import { useScrollContext } from "@/shared/lib/ScrollContext";
import PrevButton from "@/shared/ui/PrevButton";

type AnimationConfig = {
  titleThreshold: number;
  textColorThreshold: number;
  shadowThreshold: number;
};

type TransformingNavbarProps = {
  title: string;
  heroImageId: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  titleThreshold?: number;
  textColorThreshold?: number;
  shadowThreshold?: number;
};

const DEFAULT_CONFIG: AnimationConfig = {
  titleThreshold: 0.7,
  textColorThreshold: 0.5,
  shadowThreshold: 0.8,
} as const;

const TransformingNavbar = ({
  title,
  heroImageId,
  leftComponent = <PrevButton />,
  rightComponent,
  titleThreshold = DEFAULT_CONFIG.titleThreshold,
  textColorThreshold = DEFAULT_CONFIG.textColorThreshold,
  shadowThreshold = DEFAULT_CONFIG.shadowThreshold,
}: TransformingNavbarProps) => {
  const { motionRef } = useScrollContext();
  // 히어로 높이 측정 전에는 진행도가 0에 머물도록 사실상 무한 범위 사용
  const [scrollEnd, setScrollEnd] = useState<number | null>(null);

  useEffect(() => {
    const targetElement = document.getElementById(heroImageId);
    if (!targetElement) return;
    setScrollEnd(targetElement.offsetHeight * 0.8);
  }, [heroImageId]);

  const { scrollY } = useScroll({ container: motionRef });
  const progress = useTransform(
    scrollY,
    [0, scrollEnd ?? Number.MAX_SAFE_INTEGER],
    [0, 1]
  );

  const backdropOpacity = useTransform(progress, [0, 0.4], [1, 0]);
  const backgroundColor = useTransform(
    progress,
    [0.1, 0.6],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
  );
  const color = useTransform(
    progress,
    [textColorThreshold, Math.min(textColorThreshold + 0.4, 1)],
    ["rgb(255, 255, 255)", "rgb(0, 0, 0)"]
  );
  const boxShadow = useTransform(
    progress,
    [shadowThreshold, 1],
    ["0 2px 4px rgba(0, 0, 0, 0)", "0 2px 4px rgba(0, 0, 0, 0.1)"]
  );
  const titleOpacity = useTransform(progress, [titleThreshold, 1], [0, 1]);
  const titleY = useTransform(progress, [titleThreshold, 1], [-10, 0]);

  return (
    <motion.div
      className="z-header sticky-optimized fixed top-0 right-0 left-0 flex h-16 items-center justify-between px-4 md:pointer-events-none md:opacity-0"
      style={{ backgroundColor, color, boxShadow }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/60 to-transparent md:hidden"
        style={{ opacity: backdropOpacity }}
      />

      <div className="flex max-w-full min-w-0 items-center gap-2">
        {leftComponent}

        <motion.span
          className="truncate text-lg font-bold"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          {title}
        </motion.span>
      </div>

      {rightComponent}
    </motion.div>
  );
};

export default TransformingNavbar;
