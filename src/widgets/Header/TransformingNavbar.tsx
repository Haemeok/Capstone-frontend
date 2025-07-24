"use client";

import React, { useEffect, useRef } from "react";

import { gsap } from "gsap";

import { useScrollContext } from "@/shared/lib/ScrollContext";
import PrevButton from "@/shared/ui/PrevButton";

type AnimationConfig = {
  titleThreshold: number;
  textColorThreshold: number;
  shadowThreshold: number;
};

type TransformingNavbarProps = {
  title: string;
  targetRef: React.RefObject<HTMLElement | null>;
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
  targetRef,
  leftComponent = <PrevButton />,
  rightComponent,
  titleThreshold = DEFAULT_CONFIG.titleThreshold,
  textColorThreshold = DEFAULT_CONFIG.textColorThreshold,
  shadowThreshold = DEFAULT_CONFIG.shadowThreshold,
}: TransformingNavbarProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { motionRef } = useScrollContext();

  useEffect(() => {
    if (
      !targetRef.current ||
      !headerRef.current ||
      !titleRef.current ||
      !motionRef.current
    ) {
      return;
    }

    const headerElement = headerRef.current;
    const titleElement = titleRef.current;
    const endTrigger = targetRef.current.offsetHeight * 0.8;

    const animationConfig = {
      title: {
        threshold: titleThreshold,
        from: { opacity: 0, y: -10 },
        to: { opacity: 1, y: 0 },
      },
      background: {
        from: { backgroundColor: "rgba(255, 255, 255, 0)" },
        to: { backgroundColor: "rgba(255, 255, 255, 1)" },
      },
      shadow: {
        threshold: shadowThreshold,
        from: { boxShadow: "none" },
        to: { boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" },
      },
      textColor: {
        threshold: textColorThreshold,
        from: { color: "white" },
        to: { color: "black" },
      },
    } as const;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: targetRef.current,
        scroller: motionRef.current,
        start: "top top",
        end: `+=${endTrigger}`,
        scrub: true,
      },
    });

    tl.fromTo(
      headerElement,
      animationConfig.background.from,
      animationConfig.background.to,
      0
    );

    tl.fromTo(
      headerElement,
      animationConfig.shadow.from,
      animationConfig.shadow.to,
      `${animationConfig.shadow.threshold * 100}%`
    );

    tl.fromTo(
      titleElement,
      animationConfig.title.from,
      animationConfig.title.to,
      `${animationConfig.title.threshold * 100}%`
    );

    tl.fromTo(
      headerElement,
      animationConfig.textColor.from,
      animationConfig.textColor.to,
      `${animationConfig.textColor.threshold * 100}%`
    );

    return () => {
      tl.kill();
    };
  }, [
    targetRef,
    titleThreshold,
    textColorThreshold,
    shadowThreshold,
    motionRef,
  ]);

  return (
    <div
      ref={headerRef}
      className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between px-4"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0)",
        color: "black",
        boxShadow: "none",
      }}
    >
      <div className="flex max-w-full min-w-0 items-center gap-2">
        {leftComponent}

        <h1
          ref={titleRef}
          className="truncate text-lg font-bold"
          style={{ opacity: 0, transform: "translateY(-10px)" }}
        >
          {title}
        </h1>
      </div>

      {rightComponent}
    </div>
  );
};

export default TransformingNavbar;
