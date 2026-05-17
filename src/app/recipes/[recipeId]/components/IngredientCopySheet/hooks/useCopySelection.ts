"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

const computeMissingIndices = (total: number, owned: Set<number>) => {
  const missing = new Set<number>();
  for (let i = 0; i < total; i++) {
    if (!owned.has(i)) missing.add(i);
  }
  return missing;
};

type UseCopySelectionParams = {
  isOpen: boolean;
  totalIngredients: number;
  ownedIndices: Set<number>;
};

/**
 * 복사 모드 셀렉션 상태 캡슐화.
 * - 시트가 열릴 때마다 미보유 재료로 초기 선택을 재계산한다.
 */
export const useCopySelection = ({
  isOpen,
  totalIngredients,
  ownedIndices,
}: UseCopySelectionParams) => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(() =>
    computeMissingIndices(totalIngredients, ownedIndices)
  );

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSelectedIndices(computeMissingIndices(totalIngredients, ownedIndices));
    }
  }

  const toggle = (index: number) => {
    triggerHaptic("Light");
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const selectAll = () => {
    triggerHaptic("Light");
    setSelectedIndices(
      new Set(Array.from({ length: totalIngredients }, (_, i) => i))
    );
  };

  const deselectAll = () => {
    triggerHaptic("Light");
    setSelectedIndices(new Set());
  };

  return { selectedIndices, toggle, selectAll, deselectAll };
};
