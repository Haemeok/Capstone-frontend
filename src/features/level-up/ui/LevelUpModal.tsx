"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";
import { PRICE_BRACKETS } from "@/shared/config/constants/recipe";
import type { LevelUpPhase, LevelUpData } from "../model/types";
import Phase1Acquired from "./Phase1Acquired";
import Phase2Absorb from "./Phase2Absorb";
import Phase3Accumulate from "./Phase3Accumulate";

type LevelUpModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  acquiredAmount?: number; // 실제 획득 금액 (옵셔널)
};

const LevelUpModal = ({
  isOpen,
  onOpenChange,
  acquiredAmount,
}: LevelUpModalProps) => {
  // Phase 2, 3은 하드코딩 데이터 사용 (나중에 API 연동)
  const HARDCODED_DATA: LevelUpData = {
    acquired: acquiredAmount || 4082, // 실제 획득 금액 또는 기본값
    previousTotal: 84000,
    newTotal: 88082,
    currentBracket: PRICE_BRACKETS.find((b) => b.min === 10000)!,
    nextBracket: PRICE_BRACKETS.find((b) => b.min === 20000),
    percentageToNext: 80,
    isLevelUp: false,
  };
  const [currentPhase, setCurrentPhase] = useState<LevelUpPhase>("acquired");

  useEffect(() => {
    // 모달이 열릴 때마다 Phase 1부터 시작
    if (isOpen) {
      setCurrentPhase("acquired");
    }
  }, [isOpen]);

  const handlePhase1Complete = () => {
    // ⏸️ 자동 전환 비활성화 (수동 테스트용)
    // setTimeout(() => {
    //   setCurrentPhase("absorb");
    // }, 1800);
  };

  const handlePhase2Complete = () => {
    // ⏸️ 자동 전환 비활성화 (수동 테스트용)
    // setCurrentPhase("accumulate");
  };

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case "acquired":
        return "절약 달성!";
      case "absorb":
        return "누적 중...";
      case "accumulate":
        return "이번 달 레시피오 절약";
      default:
        return "";
    }
  };

  // 🎮 수동 제어 버튼 핸들러
  const handleManualNext = () => {
    if (currentPhase === "acquired") {
      setCurrentPhase("absorb");
    } else if (currentPhase === "absorb") {
      setCurrentPhase("accumulate");
    }
  };

  const handleManualPrev = () => {
    if (currentPhase === "accumulate") {
      setCurrentPhase("absorb");
    } else if (currentPhase === "absorb") {
      setCurrentPhase("acquired");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{getPhaseTitle()}</DialogTitle>
        </DialogHeader>

        {currentPhase === "acquired" && (
          <Phase1Acquired
            amount={HARDCODED_DATA.acquired}
            onComplete={handlePhase1Complete}
          />
        )}

        {currentPhase === "absorb" && (
          <Phase2Absorb
            amount={HARDCODED_DATA.acquired}
            onComplete={handlePhase2Complete}
          />
        )}

        {currentPhase === "accumulate" && (
          <Phase3Accumulate data={HARDCODED_DATA} />
        )}

        {/* 🎮 수동 제어 버튼 (테스트용) */}
        <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-4">
          <button
            onClick={handleManualPrev}
            disabled={currentPhase === "acquired"}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-30"
          >
            ← 이전 단계
          </button>
          <span className="text-xs text-gray-500">
            {currentPhase === "acquired" && "Phase 1/3"}
            {currentPhase === "absorb" && "Phase 2/3"}
            {currentPhase === "accumulate" && "Phase 3/3"}
          </span>
          <button
            onClick={handleManualNext}
            disabled={currentPhase === "accumulate"}
            className="rounded-lg bg-olive-mint px-4 py-2 text-sm font-medium text-white disabled:opacity-30"
          >
            다음 단계 →
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LevelUpModal;
