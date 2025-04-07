import React, { useRef, useEffect, useState } from "react";
import PrevButton from "../Button/PrevButton";
import HeartButton from "../Button/HeartButton";
import ShareButton from "../Button/ShareButton";

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
  leftComponent,
  rightComponent,
  titleThreshold = 0.7,
  textColorThreshold = 0.5,
  shadowThreshold = 0.8,
}: TransformingNavbarProps) => {
  const [navOpacity, setNavOpacity] = useState(0);
  const [showTitle, setShowTitle] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const thresholds = Array.from({ length: 20 }, (_, i) => i / 20);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        const visibleRatio =
          1 - Math.max(0, Math.min(1, entry.intersectionRatio * 3.5));
        setNavOpacity(Math.max(0, Math.min(1, visibleRatio)));

        setShowTitle(visibleRatio > titleThreshold);

        if (headerRef.current) {
          headerRef.current.style.setProperty(
            "--nav-opacity",
            Math.max(0, Math.min(1, visibleRatio)).toString()
          );
        }
      },
      {
        threshold: thresholds,
        rootMargin: "-10% 0px 0px 0px",
      }
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, titleThreshold]);

  const textColor =
    navOpacity > textColorThreshold ? "text-black" : "text-white";

  const defaultRightComponent = (
    <div className="flex shrink-0">
      <HeartButton
        className={`${textColor} flex-shrink-0 transition-colors duration-300 hover:bg-gray-200/30 rounded-full`}
        ariaLabel="좋아요"
      />
      <ShareButton
        className={`p-2 ${textColor} flex-shrink-0 transition-colors duration-300 hover:bg-gray-200/30 rounded-full`}
        ariaLabel="공유하기"
      />
    </div>
  );

  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 h-16 px-4 flex items-center justify-between transition-all duration-200"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${navOpacity})`,
        boxShadow:
          navOpacity > shadowThreshold
            ? "0 2px 4px rgba(0, 0, 0, 0.1)"
            : "none",
      }}
    >
      <div className="flex items-center gap-2 min-w-0 max-w-full">
        <PrevButton className={`${textColor} shrink-0`} />

        <h1
          className={`font-bold truncate text-lg transform transition-all duration-300 ${textColor}`}
          style={{
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          {title}
        </h1>
      </div>
      {rightComponent || defaultRightComponent}
    </div>
  );
};

export default TransformingNavbar;
