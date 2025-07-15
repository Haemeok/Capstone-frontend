"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

import useScrollAnimate from "@/shared/hooks/useScrollAnimate";
import { Button } from "@/shared/ui/shadcn/button";

type CookButtonProps = {
  recipeId: number;
};

export const CookButton = ({ recipeId }: CookButtonProps) => {
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);

  const { targetRef: cookButtonRef } = useScrollAnimate<HTMLButtonElement>({
    triggerRef: observerRef,
    start: "top bottom-=100px",
    toggleActions: "play none none reset",
    yOffset: 10,
    duration: 0.2,
    delay: 0,
  });

  return (
    <>
      <div ref={observerRef} className="h-1 w-full" />
      <div className="fixed bottom-20 z-50 flex w-full justify-center">
        <Button
          ref={cookButtonRef}
          className="bg-olive-light rounded-full p-4 text-white shadow-lg"
          onClick={() => router.push(`/recipes/${recipeId}/slideShow`)}
        >
          요리하기
        </Button>
      </div>
    </>
  );
};
