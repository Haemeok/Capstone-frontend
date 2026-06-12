"use client";

import { useState } from "react";

import type { IngredientReportReason } from "@/entities/recipe/model/api";

export const useReportForm = () => {
  const [selectedReason, setSelectedReason] =
    useState<IngredientReportReason | null>(null);
  const [memo, setMemo] = useState("");
  const [missingName, setMissingName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSelectedReason(null);
    setMemo("");
    setMissingName("");
  };

  const isReportDisabled = !selectedReason || isSubmitting;
  const isMissingDisabled = !missingName.trim() || isSubmitting;

  return {
    selectedReason,
    setSelectedReason,
    memo,
    setMemo,
    missingName,
    setMissingName,
    isSubmitting,
    setIsSubmitting,
    resetForm,
    isReportDisabled,
    isMissingDisabled,
  };
};
