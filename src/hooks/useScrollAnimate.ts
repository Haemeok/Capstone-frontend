// src/hooks/useScrollAnimate.ts
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface UseScrollAnimateOptions {
  triggerRef?: React.RefObject<HTMLElement | null>;
  start?: string;
  toggleActions?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  ease?: string;
}

const useScrollAnimate = <T extends HTMLElement>(
  options?: UseScrollAnimateOptions,
) => {
  const targetRef = useRef<T>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const currentTriggerElement =
      options?.triggerRef?.current || targetRef.current;

    if (targetRef.current && currentTriggerElement) {
      animation.current = gsap.timeline({
        scrollTrigger: {
          trigger: currentTriggerElement,
          start: options?.start || 'top 85%',
          toggleActions: options?.toggleActions || 'restart none none none',
        },
      });

      animation.current.fromTo(
        targetRef.current,
        { opacity: 0, y: options?.yOffset ?? 5 },
        {
          opacity: 1,
          y: 0,
          duration: options?.duration ?? 0.7,
          ease: options?.ease ?? 'power3.out',
          delay: options?.delay ?? 0.3,
        },
      );
    }

    return () => {
      if (animation.current) {
        animation.current.kill();
      }
    };
  }, [
    options?.triggerRef,
    options?.start,
    options?.toggleActions,
    options?.delay,
    options?.yOffset,
  ]);

  return { targetRef };
};

export default useScrollAnimate;
