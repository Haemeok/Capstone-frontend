import { useEffect, useRef } from "react";

const MOBILE_BREAKPOINT = 768;

export const useAutoScrollOnMobile = (
  shouldScroll: boolean,
  delay: number = 300
) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldScroll) return;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    if (!isMobile) return;

    const timer = setTimeout(() => {
      targetRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [shouldScroll, delay]);

  return targetRef;
};
