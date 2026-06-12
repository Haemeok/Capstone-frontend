"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { Phase } from "../constants";

type UsePhaseManagerOptions = {
  onResetForm: () => void;
};

export const usePhaseManager = ({ onResetForm }: UsePhaseManagerOptions) => {
  const [phase, setPhase] = useState<Phase>("list");
  const [selectedIngredientName, setSelectedIngredientName] = useState("");

  const resetAll = () => {
    setPhase("list");
    setSelectedIngredientName("");
    onResetForm();
  };

  const goToReport = (name: string) => {
    triggerHaptic("Light");
    setSelectedIngredientName(name);
    setPhase("report");
  };

  const goToMissing = () => {
    triggerHaptic("Light");
    setPhase("missing");
  };

  const goBackToList = () => {
    triggerHaptic("Light");
    onResetForm();
    setPhase("list");
  };

  return {
    phase,
    setPhase,
    selectedIngredientName,
    resetAll,
    goToReport,
    goToMissing,
    goBackToList,
  };
};
