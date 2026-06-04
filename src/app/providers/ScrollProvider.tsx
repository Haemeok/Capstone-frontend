"use client";

import { type ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { ScrollContext } from "@/shared/lib/ScrollContext";

const SCROLL_SAVE_DEBOUNCE_MS = 150;

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const motionRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const scrollSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollLockRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  const scrollClass = "h-[100dvh] md:h-[calc(100dvh-64px)] md:mt-16";

  // sticky 헤더 내 input 타이핑 시 브라우저 scrollIntoView 방지
  useEffect(() => {
    const scrollContainer = motionRef.current;
    if (!scrollContainer) return;

    const handleInput = (e: Event) => {
      const target = e.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        if (scrollLockRef.current === null) {
          scrollLockRef.current = scrollContainer.scrollTop;
        }
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          if (scrollLockRef.current !== null) {
            scrollContainer.scrollTop = scrollLockRef.current;
          }
          scrollLockRef.current = null;
        });
      }
    };

    scrollContainer.addEventListener("input", handleInput, { capture: true });
    return () =>
      scrollContainer.removeEventListener("input", handleInput, {
        capture: true,
      });
  }, []);

  useEffect(() => {
    const scrollContainer = motionRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (scrollSaveTimerRef.current) {
        clearTimeout(scrollSaveTimerRef.current);
      }

      scrollSaveTimerRef.current = setTimeout(() => {
        sessionStorage.setItem(
          `scroll_position_${pathname}`,
          String(scrollContainer.scrollTop)
        );
      }, SCROLL_SAVE_DEBOUNCE_MS);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (scrollSaveTimerRef.current) {
        clearTimeout(scrollSaveTimerRef.current);
      }
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const scrollContainer = motionRef.current;
    if (!scrollContainer) return;

    const savedScrollY = sessionStorage.getItem(`scroll_position_${pathname}`);
    scrollContainer.scrollTo(0, savedScrollY ? parseInt(savedScrollY, 10) : 0);
  }, [pathname]);

  return (
    <ScrollContext.Provider value={{ motionRef }}>
      <div
        ref={motionRef}
        className={`flex w-full scroll-pt-20 flex-col overflow-y-auto ${scrollClass}`}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
};
