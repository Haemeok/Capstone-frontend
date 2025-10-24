import { useEffect, useRef } from "react";

import { gsap } from "@/shared/lib/gsap";
import { useScrollContext } from "@/shared/lib/ScrollContext";

type UseGridAnimationProps = {
  ingredients?: any[];
  error?: Error | null;
};

export const useGridAnimation = ({ ingredients, error }: UseGridAnimationProps) => {
  const gridItemsContainerRef = useRef<HTMLDivElement | null>(null);
  const gridAnimateTargetRef = useRef<HTMLDivElement | null>(null);
  const { motionRef } = useScrollContext();

  useEffect(() => {
    if (!ingredients || ingredients.length === 0 || error || !motionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
        if (gridAnimateTargetRef.current) {
          const newItems = Array.from(
            gridAnimateTargetRef.current.querySelectorAll<HTMLElement>(
              ':scope > *:not([data-gsap-animated="true"])'
            )
          );

          if (newItems.length > 0) {
            gsap.fromTo(
              newItems,
              { opacity: 0, y: 30, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: {
                  each: 0.08,
                  onStart: function () {},
                },
                ease: "power2.out",
                scrollTrigger: {
                  trigger: gridAnimateTargetRef.current,
                  scroller: motionRef.current,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
                onComplete: () => {
                  newItems.forEach((item) => {
                    item.setAttribute("data-gsap-animated", "true");
                  });
                },
              }
            );
          }
        }
      }, gridItemsContainerRef);

    return () => {
      ctx.revert();
    };
  }, [ingredients, error, motionRef]);

  return {
    gridItemsContainerRef,
    gridAnimateTargetRef,
  };
};