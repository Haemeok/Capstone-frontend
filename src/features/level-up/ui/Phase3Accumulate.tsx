"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/shared/lib/gsap";
import SavingSection from "@/shared/ui/SavingSection";
import CountUp from "@/shared/ui/shadcn/CountUp";
import { formatNumber } from "@/shared/lib/format";
import {
  Confetti,
  ConfettiButton,
  type ConfettiRef,
} from "@/shared/ui/shadcn/confetti";
import type { LevelUpData } from "../model/types";

type Phase3AccumulateProps = {
  data: LevelUpData;
};

const Phase3Accumulate = ({ data }: Phase3AccumulateProps) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<ConfettiRef>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!progressBarRef.current) return;

      gsap.fromTo(
        progressBarRef.current,
        {
          width: "0%",
        },
        {
          width: `${data.percentageToNext}%`,
          duration: 1.5,
          ease: "power2.out",
          onComplete: () => {
            if (data.isLevelUp) {
              setShowLevelUp(true);
            }
          },
        }
      );
    });

    return () => ctx.revert();
  }, [data.percentageToNext, data.isLevelUp]);

  useEffect(() => {
    if (showLevelUp) {
      confettiRef.current?.fire({
        particleCount: 100,
        spread: 50,
        origin: { y: 0.9 },
      });
    }
  }, [showLevelUp]);

  return (
    <>
      <Confetti
        ref={confettiRef}
        className="pointer-events-none fixed z-9999 h-full w-full"
        manualstart={true}
      />
      <div className="flex h-[500px] flex-col px-6 py-4">
        <div className="mb-6 text-center">
          <p className="mb-2 text-sm text-gray-500">이번 달 누적 절약 금액</p>
          <div className="flex items-baseline justify-center gap-1">
            <CountUp
              from={data.previousTotal}
              to={data.newTotal}
              duration={0.2}
              separator=","
              direction="up"
              className="text-olive-mint text-5xl font-bold"
            />
            <span className="text-olive-mint text-4xl font-bold">원</span>
          </div>
        </div>

        <div className="mb-6 px-0 pb-2">
          <div className="relative h-5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              ref={progressBarRef}
              className="bg-olive-mint absolute inset-y-0 left-0 rounded-full"
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.6) 8px, transparent 8px, transparent 16px)",
                }}
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
            <span>현재 단계 {formatNumber(data.currentBracket.min, "원")}</span>
            {data.nextBracket ? (
              <span>다음 단계 {formatNumber(data.nextBracket.min, "원")}</span>
            ) : (
              <span>최고 단계 달성!</span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          {showLevelUp && data.nextBracket ? (
            <>
              <div className="mb-4">
                <p className="text-olive-mint text-center text-2xl font-bold">
                  🎉 레벨 업!
                </p>
                <p className="mt-1 text-center text-sm text-gray-600">
                  다음 목표를 향해 달려가세요!
                </p>
              </div>
              <div className="h-44">
                <SavingSection
                  imageUrl={data.nextBracket.image}
                  altText={data.nextBracket.name}
                />
              </div>
              <p className="mt-2 text-center text-lg font-bold text-gray-800">
                {data.nextBracket.name}
              </p>
              <p className="mt-1 text-center text-sm text-gray-500">
                {formatNumber(data.nextBracket.min, "원")} 정도 금액이에요!
              </p>
            </>
          ) : (
            <>
              <p className="text-center text-sm text-gray-600">
                현재 단계는...
              </p>
              <div className="h-54">
                <SavingSection
                  imageUrl={data.currentBracket.image}
                  altText={data.currentBracket.name}
                />
              </div>
              <p className="mt-2 text-center text-lg font-bold text-gray-800">
                {data.currentBracket.name}
              </p>
              <p className="mt-1 text-center text-sm text-gray-500">
                {formatNumber(data.currentBracket.min, "원")} 정도 금액이에요!
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Phase3Accumulate;
