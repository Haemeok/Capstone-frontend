"use client";

import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const { targetRef } = useScrollAnimate<HTMLButtonElement>({
    triggerRef: animated ? triggerRef : undefined,
    start: "top bottom-=100px",
    toggleActions: "play none none reset",
    yOffset: 10,
    duration: 0.2,
    delay: 0,
  });

  return (
    <>
      <div className="fixed bottom-20 z-50 flex w-full justify-center">
        <Button
          ref={targetRef}
          className="bg-olive-light rounded-full p-4 text-white shadow-lg"
          onClick={() => router.push(to)}
        >
          {text}
        </Button>
      </div>
    </>
  );
};
