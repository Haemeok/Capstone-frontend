import React, { useRef, useEffect, useState } from 'react';
import PrevButton from '../Button/PrevButton';
import HeartButton from '../Button/HeartButton';
import ShareButton from '../Button/ShareButton';
import RecipeLikeButton from '../RecipeLikeButton';

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
        const currentOpacity = Math.max(0, Math.min(1, visibleRatio));

        setNavOpacity(Math.max(0, Math.min(1, visibleRatio)));
        setShowTitle(visibleRatio > titleThreshold);

        if (headerRef.current) {
          const currentTextColor =
            currentOpacity > textColorThreshold ? 'black' : 'white';
          console.log('currentTextColor', currentTextColor, currentOpacity);
          headerRef.current.style.setProperty(
            '--nav-opacity',
            currentOpacity.toString(),
          );
          headerRef.current.style.setProperty(
            '--nav-text-color',
            currentTextColor,
          );
        }
      },
      {
        threshold: thresholds,
        rootMargin: '-10% 0px 0px 0px',
      },
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, titleThreshold, textColorThreshold]);

  const textColor =
    navOpacity > textColorThreshold ? 'text-black' : 'text-white';

  return (
    <div
      ref={headerRef}
      className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between px-4 transition-all duration-200"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${navOpacity})`,
        boxShadow:
          navOpacity > shadowThreshold
            ? '0 2px 4px rgba(0, 0, 0, 0.1)'
            : 'none',
      }}
    >
      <div className="flex max-w-full min-w-0 items-center gap-2">
        <PrevButton className={`${textColor} shrink-0`} />

        <h1
          className={`transform truncate text-lg font-bold transition-all duration-300 ${textColor}`}
          style={{
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? 'translateY(0)' : 'translateY(-10px)',
          }}
        >
          {title}
        </h1>
      </div>
      {rightComponent}
    </div>
  );
};

export default TransformingNavbar;
