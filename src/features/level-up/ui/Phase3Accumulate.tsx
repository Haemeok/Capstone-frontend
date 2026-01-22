"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/shared/lib/gsap";
import { useUserStore } from "@/entities/user";
import SavingSection from "@/shared/ui/SavingSection";
import CountUp from "@/shared/ui/shadcn/CountUp";
import { Button } from "@/shared/ui/shadcn/button";
import { formatNumber } from "@/shared/lib/format";
import { Confetti, type ConfettiRef } from "@/shared/ui/shadcn/confetti";
import type { LevelUpData } from "../model/types";

type Phase3AccumulateProps = {
  data: LevelUpData;
  onClose: () => void;
};

const Phase3Accumulate = ({ data, onClose }: Phase3AccumulateProps) => {
  const { user } = useUserStore();
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
      <div className="flex flex-col px-5 pb-6 pt-2">
        {/* 금액 표시 - 토스 스타일 큰 숫자 */}
        <div className="mb-5 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <CountUp
              from={data.previousTotal}
              to={data.newTotal}
              duration={0.2}
              separator=","
              direction="up"
              className="text-olive-mint text-[40px] font-extrabold tracking-tight"
            />
            <span className="text-olive-mint text-2xl font-bold">원</span>
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className="mb-5">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              ref={progressBarRef}
              className="bg-olive-mint absolute inset-y-0 left-0 rounded-full"
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>{formatNumber(data.currentBracket.min, "원")}</span>
            {data.nextBracket ? (
              <span>{formatNumber(data.nextBracket.min, "원")}</span>
            ) : (
              <span className="text-olive-mint font-medium">최고 단계!</span>
            )}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex flex-col items-center">
          {showLevelUp && (
            <p className="text-olive-mint mb-4 text-center text-2xl font-extrabold">
              {data.nextBracket ? "🎉 레벨 업!" : "👑 최고 단계 달성!"}
            </p>
          )}

          <SavingSection
            imageUrl={data.currentBracket.image}
            altText={data.currentBracket.name}
          />

          <p className="text-center text-lg font-semibold text-gray-900">
            {data.currentBracket.name}
          </p>
          <p className="mt-0.5 text-center text-sm text-gray-500">
            {showLevelUp
              ? `${formatNumber(data.currentBracket.min, "원")} 이상 달성!`
              : `${formatNumber(data.currentBracket.min, "원")} 절약 중`}
          </p>
        </div>

        {/* CTA 버튼 - 에어비엔비 스타일 */}
        <div className="mt-6">
          <Link href={`/users/${user?.id}?tab=calendar`} prefetch={false}>
            <Button
              onClick={onClose}
              className="bg-olive-mint hover:bg-olive-dark h-14 w-full rounded-xl text-base font-semibold text-white"
            >
              이번 달 기록 확인하기
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Phase3Accumulate;
