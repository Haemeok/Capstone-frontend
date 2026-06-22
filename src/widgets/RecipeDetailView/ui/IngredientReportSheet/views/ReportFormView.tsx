"use client";

import { useRef } from "react";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { format, useT } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { IngredientReportReason } from "@/entities/recipe/model/api";

import { ReportCategoryButton } from "../../ReportCategoryButton";
import type { ReportReasonValue } from "../constants";
import type { SheetComponents } from "./sheet-components";
import { SubmitButton } from "./SubmitButton";

type ReportFormViewProps = SheetComponents & {
  ingredientName: string;
  categories: { value: ReportReasonValue }[];
  selectedReason: IngredientReportReason | null;
  memo: string;
  isSubmitting: boolean;
  isDisabled: boolean;
  onSelectReason: (reason: IngredientReportReason) => void;
  onMemoChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export const ReportFormView = ({
  ingredientName,
  categories,
  selectedReason,
  memo,
  isSubmitting,
  isDisabled,
  onSelectReason,
  onMemoChange,
  onBack,
  onSubmit,
  Header,
  Title,
  Description,
}: ReportFormViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useT();

  return (
    <motion.div
      key="report"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex max-h-[70vh] flex-col"
    >
      <Header>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100"
            aria-label={t.common.actions.back}
          >
            <ArrowLeft className="text-ink-sub h-5 w-5" />
          </button>
          <Title className="text-ink text-xl font-bold">
            {format(t.ingredientSheet.reportFormTitle, {
              name: ingredientName,
            })}
          </Title>
        </div>
        <Description className="text-ink-muted mt-1 text-sm">
          {t.ingredientSheet.reportFormDescription}
        </Description>
      </Header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-6 pb-2">
        <div className="space-y-2">
          {categories.map((category) => (
            <ReportCategoryButton
              key={category.value}
              category={{
                value: category.value,
                label: t.ingredientSheet.reasons[category.value].label,
                description:
                  t.ingredientSheet.reasons[category.value].description,
              }}
              isSelected={selectedReason === category.value}
              onSelect={() => {
                triggerHaptic("Light");
                onSelectReason(category.value);
              }}
            />
          ))}
        </div>

        <div className="mt-3">
          <textarea
            value={memo}
            onChange={(e) => onMemoChange(e.target.value)}
            placeholder={t.ingredientSheet.reportMemoPlaceholder}
            className="focus:border-olive-light focus:ring-olive-light text-ink h-20 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm placeholder:text-gray-400 focus:ring-1 focus:outline-none"
          />
        </div>
      </div>

      <SubmitButton
        isDisabled={isDisabled}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    </motion.div>
  );
};
