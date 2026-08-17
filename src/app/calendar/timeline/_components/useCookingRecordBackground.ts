"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { CookingRecordBackground } from "./cookingRecordUi.types";

const DEFAULT_BACKGROUND: CookingRecordBackground = { kind: "dot" };

export const useCookingRecordBackground = ({
  monthKey,
  onApplied,
}: {
  monthKey: string;
  onApplied: () => void;
}) => {
  const [backgrounds, setBackgrounds] = useState<
    Record<string, CookingRecordBackground>
  >({});
  const [isOpen, setIsOpen] = useState(false);
  const appliedBackground = backgrounds[monthKey] ?? DEFAULT_BACKGROUND;
  const [pendingBackground, setPendingBackground] =
    useState<CookingRecordBackground>(DEFAULT_BACKGROUND);

  const open = () => {
    setPendingBackground(appliedBackground);
    setIsOpen(true);
  };

  const apply = () => {
    setBackgrounds((current) => ({
      ...current,
      [monthKey]: pendingBackground,
    }));
    setIsOpen(false);
    triggerHaptic("Success");
    onApplied();
  };

  const selectCustomImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingBackground({ kind: "custom", imageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return {
    appliedBackground,
    pendingBackground,
    isOpen,
    open,
    setIsOpen,
    setPendingBackground,
    selectCustomImage,
    apply,
  };
};
