"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { IngredientItem } from "@/entities/ingredient";

type IngredientReportIconProps = {
  ingredient: IngredientItem;
  onReport: (ingredient: IngredientItem) => void;
  className?: string;
};

export const IngredientReportIcon = ({
  ingredient,
  onReport,
  className,
}: IngredientReportIconProps) => {
  return (
    <motion.button
      type="button"
      onClick={() => onReport(ingredient)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-amber-50",
        className
      )}
      aria-label={`${ingredient.name} 오류 신고`}
    >
      <AlertTriangle className="h-4 w-4 text-amber-500" />
    </motion.button>
  );
};
