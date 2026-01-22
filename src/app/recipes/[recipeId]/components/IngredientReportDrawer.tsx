"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { cn } from "@/shared/lib/utils";

import { IngredientItem } from "@/entities/ingredient";
import {
  IngredientReportReason,
  reportIngredient,
} from "@/entities/recipe/model/api";

import {
  type ReportCategory,
  ReportCategoryButton,
} from "./ReportCategoryButton";
import { ReportSuccessView } from "./ReportSuccessView";

const AUTO_CLOSE_DELAY_MS = 2000;

const REPORT_CATEGORIES: ReportCategory[] = [
  {
    value: "WRONG_QUANTITY",
    label: "양이 틀려요",
    description: "재료의 양이나 단위가 잘못되었어요",
  },
  {
    value: "WRONG_NAME",
    label: "이름이 틀려요",
    description: "재료 이름이 잘못되었어요",
  },
  {
    value: "MISSING_INGREDIENT",
    label: "없는 재료예요",
    description: "레시피에 없어도 되는 재료예요",
  },
];

type IngredientReportDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: IngredientItem | null;
  recipeId: string;
  onSuccess: () => void;
};

export const IngredientReportDrawer = ({
  isOpen,
  onOpenChange,
  ingredient,
  recipeId,
  onSuccess,
}: IngredientReportDrawerProps) => {
  const { Container, Content, Header, Title, Description } =
    useResponsiveSheet();

  const [selectedReason, setSelectedReason] =
    useState<IngredientReportReason | null>(null);
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason || !ingredient) return;

    setIsSubmitting(true);

    try {
      await reportIngredient(recipeId, ingredient.id, {
        reason: selectedReason,
        memo: memo.trim() || undefined,
      });

      setShowSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setShowSuccess(false);
        setSelectedReason(null);
        setMemo("");
        onSuccess();
      }, AUTO_CLOSE_DELAY_MS);
    } catch {
      // Error handling can be improved with toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedReason(null);
      setMemo("");
      setShowSuccess(false);
    }
    onOpenChange(open);
  };

  return (
    <Container open={isOpen} onOpenChange={handleOpenChange}>
      <Content className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <ReportSuccessView key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Header>
                <Title className="text-xl font-bold text-gray-900">
                  재료 오류 신고
                </Title>
                <Description className="text-gray-500">
                  {ingredient?.name && (
                    <span className="font-medium text-gray-700">
                      &apos;{ingredient.name}&apos;
                    </span>
                  )}{" "}
                  재료에 오류가 있나요?
                </Description>
              </Header>

              <div className="px-6 pb-8">
                <div className="space-y-3">
                  {REPORT_CATEGORIES.map((category) => (
                    <ReportCategoryButton
                      key={category.value}
                      category={category}
                      isSelected={selectedReason === category.value}
                      onSelect={() => setSelectedReason(category.value)}
                    />
                  ))}
                </div>

                <div className="mt-4">
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="예: 계란 3개 → 계란 4개"
                    className="h-24 w-full resize-none rounded-lg border border-gray-200 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selectedReason || isSubmitting}
                  className={cn(
                    "mt-4 h-14 w-full cursor-pointer rounded-2xl text-lg font-bold transition-all",
                    selectedReason && !isSubmitting
                      ? "bg-olive-light text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
                      : "cursor-not-allowed bg-gray-100 text-gray-400"
                  )}
                >
                  {isSubmitting ? "신고 중..." : "신고하기"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Content>
    </Container>
  );
};
