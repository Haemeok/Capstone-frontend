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
    value: "ETC",
    label: "💬 기타 문제가 있어요",
    description: "품절, 링크 오류 등 다른 문제가 있어요",
  },
];

const RETURN_TO_LIST_DELAY_MS = 2000;

type Phase = "list" | "report" | "missing" | "success";

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
  const [missingName, setMissingName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSelectedReason(null);
    setMemo("");
    setMissingName("");
  };

  const resetAll = () => {
    setPhase("list");
    setSelectedIngredientName("");
    resetForm();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetAll();
    onOpenChange(open);
  };

  const handleIngredientSelect = (name: string) => {
    triggerHaptic("Light");
    setSelectedIngredientName(name);
    setPhase("report");
  };

  const handleMissingSelect = () => {
    triggerHaptic("Light");
    setPhase("missing");
  };

  const handleBackToList = () => {
    triggerHaptic("Light");
    resetForm();
    setPhase("list");
  };

  const handleSubmit = async () => {
    const isMissing = phase === "missing";
    const reason = isMissing ? "MISSING" : selectedReason;
    const ingredientName = isMissing
      ? missingName.trim()
      : selectedIngredientName;

    if (!reason || !ingredientName) return;

    setIsSubmitting(true);

    try {
      await reportIngredient(recipe.id, {
        ingredientName,
        reason,
        memo: memo.trim() || undefined,
      });

      triggerHaptic("Success");
      setPhase("success");

      setTimeout(() => {
        if (isMissing) {
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

  const isReportDisabled = !selectedReason || isSubmitting;
  const isMissingDisabled = !missingName.trim() || isSubmitting;

  return (
    <Container open={isOpen} onOpenChange={handleOpenChange}>
      <Content className="border-0 bg-white shadow-xl">
        <AnimatePresence mode="wait">
          {phase === "list" && (
            <ListPhase
              recipe={recipe}
              servingRatio={servingRatio}
              onIngredientSelect={handleIngredientSelect}
              onMissingSelect={handleMissingSelect}
              Header={Header}
              Title={Title}
              Description={Description}
            />
          )}

          {phase === "report" && (
            <ReportPhase
              ingredientName={selectedIngredientName}
              categories={REPORT_CATEGORIES}
              selectedReason={selectedReason}
              memo={memo}
              isSubmitting={isSubmitting}
              isDisabled={isReportDisabled}
              scrollRef={scrollRef}
              onSelectReason={(reason) => {
                triggerHaptic("Light");
                setSelectedReason(reason);
              }}
              onMemoChange={setMemo}
              onBack={handleBackToList}
              onSubmit={handleSubmit}
              Header={Header}
              Title={Title}
              Description={Description}
            />
          )}

          {phase === "missing" && (
            <MissingPhase
              missingName={missingName}
              memo={memo}
              isSubmitting={isSubmitting}
              isDisabled={isMissingDisabled}
              onNameChange={setMissingName}
              onMemoChange={setMemo}
              onBack={handleBackToList}
              onSubmit={handleSubmit}
              Header={Header}
              Title={Title}
              Description={Description}
            />
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

// --- Phase Components ---

type SheetComponents = {
  Header: ReturnType<typeof useResponsiveSheet>["Header"];
  Title: ReturnType<typeof useResponsiveSheet>["Title"];
  Description: ReturnType<typeof useResponsiveSheet>["Description"];
};

type ListPhaseProps = SheetComponents & {
  recipe: Recipe | StaticRecipe;
  servingRatio: number;
  onIngredientSelect: (name: string) => void;
  onMissingSelect: () => void;
};

const ListPhase = ({
  recipe,
  servingRatio,
  onIngredientSelect,
  onMissingSelect,
  Header,
  Title,
  Description,
}: ListPhaseProps) => (
  <motion.div
    key="list"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex max-h-[70vh] flex-col"
  >
    <Header>
      <Title className="text-xl font-bold text-gray-900">재료 오류 제보</Title>
      <Description className="mt-1 text-sm text-gray-500">
        문제가 있는 재료를 선택해주세요
      </Description>
    </Header>

    <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-2 pb-6">
      <button
        type="button"
        onClick={onMissingSelect}
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
              onClick={() => onIngredientSelect(ingredient.name)}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-left transition-all hover:border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">
                  {ingredient.name}
                </span>
                <span className="text-sm text-gray-400">{amount}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </button>
          );
        })}
      </div>
    </div>
  </motion.div>
);

type ReportPhaseProps = SheetComponents & {
  ingredientName: string;
  categories: ReportCategory[];
  selectedReason: IngredientReportReason | null;
  memo: string;
  isSubmitting: boolean;
  isDisabled: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onSelectReason: (reason: IngredientReportReason) => void;
  onMemoChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
};

const ReportPhase = ({
  ingredientName,
  categories,
  selectedReason,
  memo,
  isSubmitting,
  isDisabled,
  scrollRef,
  onSelectReason,
  onMemoChange,
  onBack,
  onSubmit,
  Header,
  Title,
  Description,
}: ReportPhaseProps) => (
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
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <Title className="text-xl font-bold text-gray-900">
          &apos;{ingredientName}&apos; 제보하기
        </Title>
      </div>
      <Description className="mt-1 text-sm text-gray-500">
        어떤 문제가 있나요?
      </Description>
    </Header>

    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto px-6 pb-2"
    >
      <div className="space-y-2">
        {categories.map((category) => (
          <ReportCategoryButton
            key={category.value}
            category={category}
            isSelected={selectedReason === category.value}
            onSelect={() => onSelectReason(category.value)}
          />
        ))}
      </div>

      <div className="mt-3">
        <textarea
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          placeholder="예: 계란 3개 → 계란 4개"
          className="h-20 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light"
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

type MissingPhaseProps = SheetComponents & {
  missingName: string;
  memo: string;
  isSubmitting: boolean;
  isDisabled: boolean;
  onNameChange: (value: string) => void;
  onMemoChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
};

const MissingPhase = ({
  missingName,
  memo,
  isSubmitting,
  isDisabled,
  onNameChange,
  onMemoChange,
  onBack,
  onSubmit,
  Header,
  Title,
  Description,
}: MissingPhaseProps) => (
  <motion.div
    key="missing"
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
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <Title className="text-xl font-bold text-gray-900">
          빠진 재료 제보하기
        </Title>
      </div>
      <Description className="mt-1 text-sm text-gray-500">
        빠진 재료를 알려주세요
      </Description>
    </Header>

    <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-2">
      <input
        type="text"
        value={missingName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="빠진 재료 이름을 입력해주세요"
        className="w-full rounded-xl border-2 border-gray-200 p-4 text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-0 transition-colors"
      />

      <div className="mt-3">
        <textarea
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          placeholder="추가 설명 (선택)"
          className="h-20 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light"
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

type SubmitButtonProps = {
  isDisabled: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
};

const SubmitButton = ({
  isDisabled,
  isSubmitting,
  onSubmit,
}: SubmitButtonProps) => (
  <div className="shrink-0 px-6 pb-6 pt-3">
    <button
      type="button"
      onClick={onSubmit}
      disabled={isDisabled}
      className={
        isDisabled
          ? "h-12 w-full cursor-not-allowed rounded-2xl bg-gray-100 text-base font-bold text-gray-400 transition-all"
          : "h-12 w-full cursor-pointer rounded-2xl bg-olive-light text-base font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
      }
    >
      {isSubmitting ? "신고 중..." : "신고하기"}
    </button>
  </div>
);
