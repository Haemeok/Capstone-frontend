"use client";

import { AnimatePresence, motion } from "framer-motion";

import type { Locale } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import { reportIngredient } from "@/entities/recipe/model/api";
import type { Recipe, StaticRecipe } from "@/entities/recipe/model/types";

import { ReportSuccessView } from "../ReportSuccessView";
import { REPORT_CATEGORIES, RETURN_TO_LIST_DELAY_MS } from "./constants";
import { usePhaseManager } from "./hooks/usePhaseManager";
import { useReportForm } from "./hooks/useReportForm";
import { MissingFormView } from "./views/MissingFormView";
import { ReportFormView } from "./views/ReportFormView";
import { ReportListView } from "./views/ReportListView";

type IngredientReportSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | StaticRecipe;
  servingRatio: number;
  locale: Locale;
};

export const IngredientReportSheet = ({
  isOpen,
  onOpenChange,
  recipe,
  servingRatio,
  locale,
}: IngredientReportSheetProps) => {
  const { Container, Content, Header, Title, Description } =
    useResponsiveSheet();

  const form = useReportForm();
  const phaseManager = usePhaseManager({ onResetForm: form.resetForm });

  const handleOpenChange = (open: boolean) => {
    if (!open) phaseManager.resetAll();
    onOpenChange(open);
  };

  const handleSubmit = async () => {
    const isMissing = phaseManager.phase === "missing";
    const reason = isMissing ? "MISSING" : form.selectedReason;
    const ingredientName = isMissing
      ? form.missingName.trim()
      : phaseManager.selectedIngredientName;

    if (!reason || !ingredientName) return;

    form.setIsSubmitting(true);

    try {
      await reportIngredient(recipe.id, {
        ingredientName,
        reason,
        memo: form.memo.trim() || undefined,
      });

      triggerHaptic("Success");
      phaseManager.setPhase("success");

      setTimeout(() => {
        if (isMissing) {
          handleOpenChange(false);
        } else {
          form.resetForm();
          phaseManager.setPhase("list");
        }
      }, RETURN_TO_LIST_DELAY_MS);
    } catch {
      // Error handling
    } finally {
      form.setIsSubmitting(false);
    }
  };

  return (
    <Container open={isOpen} onOpenChange={handleOpenChange}>
      <Content className="border-0 bg-white shadow-xl">
        <AnimatePresence mode="wait">
          {phaseManager.phase === "list" && (
            <ReportListView
              recipe={recipe}
              servingRatio={servingRatio}
              locale={locale}
              onIngredientSelect={phaseManager.goToReport}
              onMissingSelect={phaseManager.goToMissing}
              Header={Header}
              Title={Title}
              Description={Description}
            />
          )}

          {phaseManager.phase === "report" && (
            <ReportFormView
              ingredientName={phaseManager.selectedIngredientName}
              categories={REPORT_CATEGORIES}
              selectedReason={form.selectedReason}
              memo={form.memo}
              isSubmitting={form.isSubmitting}
              isDisabled={form.isReportDisabled}
              onSelectReason={form.setSelectedReason}
              onMemoChange={form.setMemo}
              onBack={phaseManager.goBackToList}
              onSubmit={handleSubmit}
              Header={Header}
              Title={Title}
              Description={Description}
            />
          )}

          {phaseManager.phase === "missing" && (
            <MissingFormView
              missingName={form.missingName}
              memo={form.memo}
              isSubmitting={form.isSubmitting}
              isDisabled={form.isMissingDisabled}
              onNameChange={form.setMissingName}
              onMemoChange={form.setMemo}
              onBack={phaseManager.goBackToList}
              onSubmit={handleSubmit}
              Header={Header}
              Title={Title}
              Description={Description}
            />
          )}

          {phaseManager.phase === "success" && (
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
