"use client";

import Link from "next/link";

import useScrollAnimate from "@/shared/hooks/useScrollAnimate";
import { Button } from "@/shared/ui/shadcn/button";

type FabButtonProps = {
  to: string;
  text: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  animated?: boolean;
};

export const FabButton = ({
  to,
  text,
  triggerRef,
  animated = true,
}: FabButtonProps) => {
  const { targetRef } = useScrollAnimate<HTMLAnchorElement>({
    triggerRef: animated ? triggerRef : undefined,
    start: "top bottom-=100px",
    toggleActions: "play none none reset",
    yOffset: 10,
    duration: 0.2,
    delay: 0,
  });

  return (
    <>
      <div className="z-header sticky-optimized fixed right-0 bottom-28 left-0 flex justify-center">
        <div className="flex w-full max-w-4xl justify-center px-4 md:px-6">
          <Button
            asChild
            className="bg-olive-light rounded-full p-4 text-white shadow-lg"
          >
            <Link
              href={to}
              prefetch={false}
              ref={targetRef}
              aria-label={text}
              style={{ opacity: 0 }}
            >
              {text}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};
