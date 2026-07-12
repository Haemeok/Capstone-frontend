"use client";

import { useCallback, useEffect, useRef } from "react";

import { animate, inView } from "motion";

import { useScrollContext } from "@/shared/lib/ScrollContext";

// gsap power3.out 대응 베지어
const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

type MarginValue = `${number}${"px" | "%"}`;
type Margin =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

type UseScrollAnimateOptions = {
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** IntersectionObserver rootMargin. 기본값은 gsap "top 85%" 대응 */
  margin?: Margin;
  /** 트리거가 뷰포트 아래로 다시 벗어나면 숨김 상태로 리셋 (gsap toggleActions reset 대응) */
  resetOnLeaveBack?: boolean;
  delay?: number;
  yOffset?: number;
  duration?: number;
};

const useScrollAnimate = <T extends HTMLElement>(
  options?: UseScrollAnimateOptions
) => {
  const targetRef = useRef<T>(null);
  const { motionRef } = useScrollContext();

  const {
    triggerRef,
    margin = "0px 0px -15% 0px",
    resetOnLeaveBack = false,
    delay = 0.3,
    yOffset = 5,
    duration = 0.7,
  } = options ?? {};

  const playAnimation = useCallback(() => {
    if (!targetRef.current) return;

    animate(
      targetRef.current,
      { opacity: 1, y: 0 },
      { duration, delay, ease: EASE_OUT_CUBIC }
    );
  }, [duration, delay]);

  useEffect(() => {
    const targetElement = targetRef.current;
    const scroller = motionRef.current;
    if (!targetElement || !scroller) return;

    const triggerElement = triggerRef?.current || targetElement;

    const hide = () => {
      targetElement.style.opacity = "0";
      targetElement.style.transform = `translateY(${yOffset}px)`;
    };

    hide();

    const stop = inView(
      triggerElement,
      () => {
        animate(
          targetElement,
          { opacity: 1, y: 0 },
          { duration, delay, ease: EASE_OUT_CUBIC }
        );

        return (leaveEntry) => {
          if (!resetOnLeaveBack) return;
          const rootBottom =
            leaveEntry.rootBounds?.bottom ?? window.innerHeight;
          if (leaveEntry.boundingClientRect.top >= rootBottom) hide();
        };
      },
      { root: scroller, margin }
    );

    return () => stop();
  }, [
    triggerRef,
    margin,
    resetOnLeaveBack,
    delay,
    yOffset,
    duration,
    motionRef,
  ]);

  return { targetRef, playAnimation };
};

export default useScrollAnimate;
