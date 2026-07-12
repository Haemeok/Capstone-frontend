import { useEffect, useRef } from "react";

import { animate, inView, stagger } from "motion";

import { useScrollContext } from "@/shared/lib/ScrollContext";

// gsap power2.out 대응 베지어
const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

type UseGridAnimationProps = {
  ingredients?: unknown[];
  error?: Error | null;
};

export const useGridAnimation = ({
  ingredients,
  error,
}: UseGridAnimationProps) => {
  const gridItemsContainerRef = useRef<HTMLDivElement | null>(null);
  const gridAnimateTargetRef = useRef<HTMLDivElement | null>(null);
  const { motionRef } = useScrollContext();

  useEffect(() => {
    const target = gridAnimateTargetRef.current;

    if (
      !ingredients ||
      ingredients.length === 0 ||
      error ||
      !motionRef.current ||
      !target
    ) {
      return;
    }

    const newItems = Array.from(
      target.querySelectorAll<HTMLElement>(
        ':scope > *:not([data-grid-animated="true"])'
      )
    );

    if (newItems.length === 0) return;

    for (const item of newItems) {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px) scale(0.98)";
    }

    const stop = inView(
      target,
      () => {
        animate(
          newItems,
          { opacity: 1, y: 0, scale: 1 },
          { duration: 0.5, delay: stagger(0.08), ease: EASE_OUT_QUAD }
        ).then(() => {
          newItems.forEach((item) => {
            item.setAttribute("data-grid-animated", "true");
          });
        });
      },
      { root: motionRef.current, margin: "0px 0px -15% 0px" }
    );

    return () => stop();
  }, [ingredients, error, motionRef]);

  return {
    gridItemsContainerRef,
    gridAnimateTargetRef,
  };
};
