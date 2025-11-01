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
      <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center">
        <div className="w-full max-w-4xl px-4 md:px-6 flex justify-center">
          <Button asChild className="bg-olive-light rounded-full p-4 text-white shadow-lg">
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
