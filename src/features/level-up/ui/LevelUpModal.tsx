"use client";

import { useState, useEffect, useMemo } from "react";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { PRICE_BRACKETS } from "@/shared/config/constants/recipe";
import { useRecipeHistoryQuery } from "@/widgets/CalendarTabContent/hooks";
import type { LevelUpPhase, LevelUpData } from "../model/types";
import Phase1Acquired from "./Phase1Acquired";
import Phase2Absorb from "./Phase2Absorb";
import Phase3Accumulate from "./Phase3Accumulate";

type LevelUpModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  acquiredAmount?: number;
};

const calculateLevelUpData = (
  monthlyTotal: number,
  acquired: number
): LevelUpData => {
  const previousTotal = Math.max(0, monthlyTotal - acquired);
  const newTotal = monthlyTotal;

  const currentBracket =
    PRICE_BRACKETS.find((b) => newTotal >= b.min) ||
    PRICE_BRACKETS[PRICE_BRACKETS.length - 1];

  const previousBracket =
    PRICE_BRACKETS.find((b) => previousTotal >= b.min) ||
    PRICE_BRACKETS[PRICE_BRACKETS.length - 1];

  const currentIndex = PRICE_BRACKETS.indexOf(currentBracket);

  const nextBracket =
    currentIndex > 0 ? PRICE_BRACKETS[currentIndex - 1] : undefined;

  const isLevelUp = previousBracket !== currentBracket;

  if (!nextBracket) {
    return {
      acquired,
      previousTotal,
      newTotal,
      currentBracket,
      nextBracket: undefined,
      percentageToNext: 100,
      isLevelUp,
    };
  }

  const range = Math.max(1, nextBracket.min - currentBracket.min);
  const progress = Math.max(0, newTotal - currentBracket.min);
  const percentage = Math.min(100, Math.floor((progress / range) * 100));

  return {
    acquired,
    previousTotal,
    newTotal,
    currentBracket,
    nextBracket,
    percentageToNext: percentage,
    isLevelUp,
  };
};

const LevelUpModal = ({
  isOpen,
  onOpenChange,
  acquiredAmount,
}: LevelUpModalProps) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { Container, Content, Header, Title } = useResponsiveSheet();

  const { monthlyTotalSavings } = useRecipeHistoryQuery({ year, month });

  const levelUpData = useMemo(() => {
    return calculateLevelUpData(monthlyTotalSavings || 0, acquiredAmount || 0);
  }, [monthlyTotalSavings, acquiredAmount]);

  const [currentPhase, setCurrentPhase] = useState<LevelUpPhase>("acquired");

  useEffect(() => {
    if (isOpen) {
      setCurrentPhase("acquired");
    }
  }, [isOpen]);

  const handlePhase1Complete = () => {
    setTimeout(() => {
      setCurrentPhase("absorb");
    }, 1800);
  };

  const handlePhase2Complete = () => {
    setCurrentPhase("accumulate");
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

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content className="max-w-md">
        <Header>
          <Title className="text-center">{getPhaseTitle()}</Title>
        </Header>

        {currentPhase === "acquired" && (
          <Phase1Acquired
            amount={levelUpData.acquired}
            onComplete={handlePhase1Complete}
          />
        )}

        {currentPhase === "absorb" && (
          <Phase2Absorb
            amount={levelUpData.acquired}
            onComplete={handlePhase2Complete}
          />
        )}

        {currentPhase === "accumulate" && (
          <Phase3Accumulate
            data={levelUpData}
            onClose={() => onOpenChange(false)}
          />
        )}
      </Content>
    </Container>
  );
};

export default LevelUpModal;
