"use client";

import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Plus } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import {
  IngredientReportReason,
  reportIngredient,
} from "@/entities/recipe/model/api";
import { Recipe, StaticRecipe } from "@/entities/recipe/model/types";

import {
  type ReportCategory,
  ReportCategoryButton,
} from "./ReportCategoryButton";
import { ReportSuccessView } from "./ReportSuccessView";

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

const RETURN_TO_LIST_DELAY_MS = 2000;

type Phase = "list" | "form" | "success";

type IngredientReportSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | StaticRecipe;
  servingRatio: number;
};

export const IngredientReportSheet = ({
  isOpen,
  onOpenChange,
  recipe,
  servingRatio,
}: IngredientReportSheetProps) => {
  const { Container, Content, Header, Title, Description } =
    useResponsiveSheet();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("list");
  const [selectedIngredientName, setSelectedIngredientName] = useState("");
  const [selectedReason, setSelectedReason] =
    useState<IngredientReportReason | null>(null);
  const [memo, setMemo] = useState("");
  const [missingIngredientName, setMissingIngredientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMissingDirect, setIsMissingDirect] = useState(false);

  const resetForm = () => {
    setSelectedReason(null);
    setMemo("");
    setMissingIngredientName("");
  };

  const resetAll = () => {
    setPhase("list");
    setSelectedIngredientName("");
    setIsMissingDirect(false);
    resetForm();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetAll();
    onOpenChange(open);
  };

  const handleIngredientSelect = (name: string) => {
    triggerHaptic("Light");
    setSelectedIngredientName(name);
    setIsMissingDirect(false);
    setPhase("form");
  };

  const handleMissingDirect = () => {
    triggerHaptic("Light");
    setSelectedIngredientName("");
    setSelectedReason("MISSING");
    setIsMissingDirect(true);
    setPhase("form");
  };

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
        : selectedIngredientName;

    if (!ingredientName) return;

    setIsSubmitting(true);

    try {
      await reportIngredient(recipe.id, {
        ingredientName,
        reason: selectedReason,
        memo: memo.trim() || undefined,
      });

      triggerHaptic("Success");
      setPhase("success");

      setTimeout(() => {
        if (isMissingDirect) {
          handleOpenChange(false);
        } else {
          resetForm();
          setPhase("list");
        }
      }, RETURN_TO_LIST_DELAY_MS);
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToList = () => {
    triggerHaptic("Light");
    setIsMissingDirect(false);
    resetForm();
    setPhase("list");
  };

  const isSubmitDisabled =
    !selectedReason ||
    isSubmitting ||
    (selectedReason === "MISSING" && !missingIngredientName.trim());

  return (
    <Container open={isOpen} onOpenChange={handleOpenChange}>
      <Content className="border-0 bg-white shadow-xl">
        <AnimatePresence mode="wait">
          {phase === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex max-h-[70vh] flex-col"
            >
              <Header>
                <Title className="text-xl font-bold text-gray-900">
                  재료 오류 제보
                </Title>
                <Description className="mt-1 text-sm text-gray-500">
                  문제가 있는 재료를 선택해주세요
                </Description>
              </Header>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                <button
                  type="button"
                  onClick={handleMissingDirect}
                  className="mb-3 flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-left transition-all hover:border-olive-light hover:bg-olive-light/5"
                >
                  <Plus className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    빠진 재료가 있나요?
                  </span>
                </button>

                <div className="space-y-1.5">
                  {recipe.ingredients.map((ingredient, index) => {
                    const converted = convertIngredientQuantity(
                      ingredient.quantity,
                      ingredient.unit,
                      servingRatio
                    );
                    const amount =
                      converted.quantity !== "약간"
                        ? `${converted.quantity}${converted.unit}`
                        : "약간";

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          handleIngredientSelect(ingredient.name)
                        }
                        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-left transition-all hover:border-gray-200 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">
                            {ingredient.name}
                          </span>
                          <span className="text-sm text-gray-400">
                            {amount}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {phase === "form" && (
            <motion.div
              key="form"
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
                    onClick={handleBackToList}
                    className="cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100"
                    aria-label="뒤로 가기"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <Title className="text-xl font-bold text-gray-900">
                    {isMissingDirect
                      ? "빠진 재료 제보하기"
                      : <>&apos;{selectedIngredientName}&apos; 제보하기</>}
                  </Title>
                </div>
                <Description className="mt-1 text-sm text-gray-500">
                  {isMissingDirect
                    ? "빠진 재료를 알려주세요"
                    : "어떤 문제가 있나요?"}
                </Description>
              </Header>

              <div
                ref={scrollRef}
                className="min-h-0 flex-1 overflow-y-auto px-6 pb-2"
              >
                {!isMissingDirect && (
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
                )}

                {selectedReason === "MISSING" && (
                  <div className={isMissingDirect ? "" : "mt-3"}>
                    <input
                      type="text"
                      value={missingIngredientName}
                      onChange={(e) => setMissingIngredientName(e.target.value)}
                      placeholder="빠진 재료 이름을 입력해주세요"
                      className="w-full rounded-xl border-2 border-gray-200 p-4 text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-0 transition-colors"
                    />
                  </div>
                )}

                <div className="mt-3">
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder={isMissingDirect ? "추가 설명 (선택)" : "예: 계란 3개 → 계란 4개"}
                    className="h-20 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light"
                  />
                </div>
              </div>

              <div className="shrink-0 px-6 pb-6 pt-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                  className={
                    isSubmitDisabled
                      ? "h-12 w-full cursor-not-allowed rounded-2xl bg-gray-100 text-base font-bold text-gray-400 transition-all"
                      : "h-12 w-full cursor-pointer rounded-2xl bg-olive-light text-base font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
                  }
                >
                  {isSubmitting ? "신고 중..." : "신고하기"}
                </button>
              </div>
            </motion.div>
          )}

          {phase === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReportSuccessView />
            </motion.div>
          )}
        </AnimatePresence>
      </Content>
    </Container>
  );
};
