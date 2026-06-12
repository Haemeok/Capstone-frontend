"use client";

import { motion } from "framer-motion";
import { ClipboardList, Copy } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import type { CopyMode } from "../types";

type ModeToggleProps = {
  mode: CopyMode;
  onChange: (mode: CopyMode) => void;
};

export const ModeToggle = ({ mode, onChange }: ModeToggleProps) => {
  const handleSelect = (next: CopyMode) => {
    triggerHaptic("Light");
    onChange(next);
  };

  return (
    <div className="relative flex flex-1 gap-1 rounded-full bg-gray-100 p-1">
      <motion.div
        className="bg-olive-light absolute inset-y-1 w-[calc(50%-4px)] rounded-full shadow-sm"
        animate={{ left: mode === "copy" ? 4 : "50%" }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
      <button
        type="button"
        onClick={() => handleSelect("copy")}
        className={cn(
          "relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors",
          mode === "copy" ? "text-white" : "text-ink-muted"
        )}
      >
        <Copy className="h-4 w-4" />
        장보기 복사
      </button>
      <button
        type="button"
        onClick={() => handleSelect("checklist")}
        className={cn(
          "relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors",
          mode === "checklist" ? "text-white" : "text-ink-muted"
        )}
      >
        <ClipboardList className="h-4 w-4" />
        체크리스트
      </button>
    </div>
  );
};
