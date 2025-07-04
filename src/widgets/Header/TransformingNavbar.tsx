import React, { useEffect, useRef } from "react";

import { gsap } from "gsap";

import PrevButton from "@/shared/ui/PrevButton";

type TransformingNavbarProps = {
  title: string;
  targetRef: React.RefObject<HTMLElement | null>;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  titleThreshold?: number;
  textColorThreshold?: number;
  shadowThreshold?: number;
};

const TransformingNavbar = ({
  title,
  targetRef,
  leftComponent = <PrevButton />,
  rightComponent,
  titleThreshold = 0.7,
  textColorThreshold = 0.5,
  shadowThreshold = 0.8,
}: TransformingNavbarProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!targetRef.current || !headerRef.current || !titleRef.current) {
      return;
    }

    const headerElement = headerRef.current;
    const titleElement = titleRef.current;

    const endTrigger = targetRef.current.offsetHeight * 0.8;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: targetRef.current,
        start: "top top",
        end: `+=${endTrigger}`,
        scrub: true,
      },
    });

    tl.fromTo(
      headerElement,
      { backgroundColor: "rgba(255, 255, 255, 0)" },
      { backgroundColor: "rgba(255, 255, 255, 1)" },
      0
    );

    const shadowStartTime = `${shadowThreshold * 100}%`;
    tl.fromTo(
      headerElement,
      { boxShadow: "none" },
      { boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" },
      shadowStartTime
    );

    const titleStartTime = `${titleThreshold * 100}%`;
    tl.fromTo(
      titleElement,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0 },
      titleStartTime
    );

    const textColorChangeTime = `${textColorThreshold * 100}%`;
    tl.fromTo(
      headerElement,
      { color: "white" },
      { color: "black" },
      textColorChangeTime
    );

    return () => {
      tl.kill();
    };
  }, [targetRef, titleThreshold, textColorThreshold, shadowThreshold]);

  return (
    <div
      ref={headerRef}
      className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between px-4"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0)",
        color: "white",
        boxShadow: "none",
      }}
    >
      <div className="flex max-w-full min-w-0 items-center gap-2">
        {React.cloneElement(leftComponent as React.ReactElement, {})}

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
