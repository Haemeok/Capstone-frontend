"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/shared/lib/gsap";
import { formatNumber } from "@/shared/lib/format";

type Phase2AbsorbProps = {
  amount: number;
  onComplete: () => void;
};

const Phase2Absorb = ({ amount, onComplete }: Phase2AbsorbProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const targetBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!amountRef.current || !targetBarRef.current || !particleRef.current)
        return;

      const tl = gsap.timeline({
        onComplete,
      });

      tl.to(amountRef.current, {
        scale: 0.3,
        duration: 0.3,
        ease: "power2.in",
      })

        .to(
          particleRef.current,
          {
            opacity: 1,
            duration: 0.2,
          },
          "-=0.1"
        )
        .to(
          [amountRef.current, particleRef.current],
          {
            x: () => {
              if (!targetBarRef.current) return 0;
              const targetRect = targetBarRef.current.getBoundingClientRect();
              const amountRect = amountRef.current?.getBoundingClientRect();
              if (!amountRect) return 0;
              return (
                targetRect.left +
                targetRect.width / 2 -
                (amountRect.left + amountRect.width / 2)
              );
            },
            y: () => {
              if (!targetBarRef.current) return 0;
              const targetRect = targetBarRef.current.getBoundingClientRect();
              const amountRect = amountRef.current?.getBoundingClientRect();
              if (!amountRect) return 0;
              return (
                targetRect.top +
                targetRect.height / 2 -
                (amountRect.top + amountRect.height / 2)
              );
            },
            duration: 0.6,
            ease: "power2.inOut",
          },
          "-=0.1"
        )

        .to(
          [amountRef.current, particleRef.current],
          {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          },
          "-=0.1"
        );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col px-5 pb-4 pt-2"
    >
      {/* 금액 표시 */}
      <div className="mb-5 text-center">
        <div className="relative flex items-baseline justify-center gap-1">
          <div
            ref={amountRef}
            className="text-olive-mint flex items-baseline gap-1"
          >
            <span className="text-3xl font-bold">+</span>
            <span className="text-[36px] font-extrabold tracking-tight">
              {formatNumber(amount, "원")}
            </span>
          </div>
          <div
            ref={particleRef}
            className="absolute inset-0 flex items-center justify-center opacity-0"
          >
            <div className="bg-olive-mint h-16 w-16 rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="mb-5">
        <div
          ref={targetBarRef}
          className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100"
        >
          <div className="bg-olive-mint/30 absolute inset-0 w-1/3 rounded-full" />
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">
          이번 달 누적 바에 흡수 중...
        </p>
      </div>
    </div>
  );
};

export default Phase2Absorb;
