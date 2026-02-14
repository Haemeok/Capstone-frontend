"use client";

import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { triggerHaptic } from "@/shared/lib/bridge";
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

const AUTO_CLOSE_DELAY_MS = 3500;

const REPORT_CATEGORIES: ReportCategory[] = [
  {
    value: "WRONG_QUANTITY",
    label: "⚖️ 양이 틀려요",
    description: "재료의 양이나 단위가 잘못됐어요",
  },
  {
    value: "WRONG_NAME",
    label: "✏️ 이름이 틀려요",
    description: "재료 이름이 잘못됐어요",
  },
  {
    value: "NOT_EXIST",
    label: "🚫 필요 없는 재료예요",
    description: "레시피에 없어도 되는 재료예요",
  },
  {
    value: "MISSING",
    label: "➕ 빠진 재료가 있어요",
    description: "레시피에 있어야 할 재료가 없어요",
  },
  {
    value: "ETC",
    label: "💬 기타 문제가 있어요",
    description: "품절, 링크 오류 등 다른 문제가 있어요",
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedReason, setSelectedReason] =
    useState<IngredientReportReason | null>(null);
  const [memo, setMemo] = useState("");
  const [missingIngredientName, setMissingIngredientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectReason = (reason: IngredientReportReason) => {
    triggerHaptic("Light");
    setSelectedReason(reason);

    if (reason === "MISSING") {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if (!selectedReason) return;

    const ingredientName =
      selectedReason === "MISSING"
        ? missingIngredientName.trim()
        : ingredient?.name;

    if (!ingredientName) return;

    setIsSubmitting(true);

    try {
      await reportIngredient(recipeId, {
        ingredientName,
        reason: selectedReason,
        memo: memo.trim() || undefined,
      });

      triggerHaptic("Success");
      setShowSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setShowSuccess(false);
        setSelectedReason(null);
        setMemo("");
        setMissingIngredientName("");
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
      setMissingIngredientName("");
      setShowSuccess(false);
    }
    onOpenChange(open);
  };

  return (
    <Container open={isOpen} onOpenChange={handleOpenChange}>
      <Content className="border-0 bg-white shadow-xl">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <ReportSuccessView key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex max-h-[70vh] flex-col"
            >
              <Header>
                <Title className="text-xl font-bold text-gray-900">
                  재료 오류 신고
                </Title>
                <Description className="mt-1 text-base text-gray-600">
                  {ingredient?.name && (
                    <span className="font-semibold text-gray-800">
                      &apos;{ingredient.name}&apos;
                    </span>
                  )}{" "}
                  재료에 문제가 있나요?
                </Description>
              </Header>

              <div
                ref={scrollRef}
                className="min-h-0 flex-1 overflow-y-auto px-6 pb-2"
              >
                <div className="space-y-2">
                  {REPORT_CATEGORIES.map((category) => (
                    <ReportCategoryButton
                      key={category.value}
                      category={category}
                      isSelected={selectedReason === category.value}
                      onSelect={() => handleSelectReason(category.value)}
                    />
                  ))}
                </div>

                {selectedReason === "MISSING" && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={missingIngredientName}
                      onChange={(e) => setMissingIngredientName(e.target.value)}
                      placeholder="빠진 재료 이름을 입력해주세요"
                      className="w-full rounded-xl border border-gray-200 p-4 text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light transition-colors"
                    />
                  </div>
                )}

                <div className="mt-3">
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="예: 계란 3개 → 계란 4개"
                    className="h-20 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light"
                  />
                </div>
              </div>

              <div className="shrink-0 px-6 pb-6 pt-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !selectedReason ||
                    isSubmitting ||
                    (selectedReason === "MISSING" &&
                      !missingIngredientName.trim())
                  }
                  className={cn(
                    "h-12 w-full cursor-pointer rounded-2xl text-base font-bold transition-all",
                    selectedReason &&
                      !isSubmitting &&
                      (selectedReason !== "MISSING" ||
                        missingIngredientName.trim())
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
