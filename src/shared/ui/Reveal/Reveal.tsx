"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { useScrollContext } from "@/shared/lib/ScrollContext";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export const Reveal = ({ children, className, delayMs = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const { motionRef } = useScrollContext();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setIsRevealed(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { root: motionRef.current, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [motionRef]);

  return (
    <div
      ref={ref}
      data-revealed={isRevealed}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={className ? `reveal ${className}` : "reveal"}
    >
      {children}
    </div>
  );
};
