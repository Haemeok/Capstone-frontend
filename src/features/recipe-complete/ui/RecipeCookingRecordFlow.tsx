"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import type {
  RecipeCookingRecordFlowProps,
  RecipeCookingRecordFormDraft,
} from "./recipeCookingRecord.types";
import { RecipeCookingRecordForm } from "./RecipeCookingRecordForm";
import {
  RecipeCookingRecordRewardPhase,
  RecipeCookingRecordSuccessPhase,
} from "./RecipeCookingRecordPhaseViews";

type Phase = "reward" | "form" | "success";

export const RecipeCookingRecordFlow = ({
  isOpen,
  saveAmount,
  recipeId,
  recipeTitle,
  recipeImageUrl,
  copy,
  onOpenChange,
  onSubmit,
}: RecipeCookingRecordFlowProps) => {
  const { Container, Content, Title, Description } = useResponsiveSheet();
  const [phase, setPhase] = useState<Phase>("reward");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!isOpen || phase !== "reward") return;
    const timer = window.setTimeout(() => setPhase("form"), 1800);
    return () => window.clearTimeout(timer);
  }, [isOpen, phase]);

  const submit = async (draft: RecipeCookingRecordFormDraft) => {
    setIsSubmitting(true);
    setErrorMessage(undefined);
    try {
      await onSubmit(draft);
      triggerHaptic("Success");
      setPhase("success");
    } catch {
      setErrorMessage(copy.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setPhase("reward");
      setErrorMessage(undefined);
    }
  };

  const close = () => {
    triggerHaptic("Light");
    handleOpenChange(false);
  };

  return (
    <Container open={isOpen} onOpenChange={handleOpenChange}>
      <Content className="flex max-h-[80dvh] flex-col overflow-hidden border-0 bg-white shadow-xl sm:max-w-md [&>[data-slot=dialog-close]]:hidden">
        <button
          type="button"
          aria-label={copy.close}
          onClick={close}
          className="absolute top-3 right-3 z-10 flex size-11 cursor-pointer items-center justify-center rounded-xl"
        >
          <X className="size-5" />
        </button>
        <motion.div
          layout
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={phase}
              className="flex min-h-0 flex-1 flex-col"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {phase === "reward" ? (
                <RecipeCookingRecordRewardPhase
                  saveAmount={saveAmount}
                  copy={copy}
                  title={<Title className="text-xl">{copy.rewardTitle}</Title>}
                  description={
                    <Description className="mt-8 font-semibold">
                      {copy.rewardKicker}
                    </Description>
                  }
                />
              ) : null}
              {phase === "form" ? (
                <RecipeCookingRecordForm
                  recipeId={recipeId}
                  recipeTitle={recipeTitle}
                  recipeImageUrl={recipeImageUrl}
                  copy={copy}
                  isSubmitting={isSubmitting}
                  errorMessage={errorMessage}
                  onSubmit={(draft) => void submit(draft)}
                  onSkip={() =>
                    void submit({ recipeId, review: "", isPublic: true })
                  }
                />
              ) : null}
              {phase === "success" ? (
                <RecipeCookingRecordSuccessPhase
                  copy={copy}
                  title={
                    <Title className="text-[23px]">{copy.successTitle}</Title>
                  }
                  description={
                    <Description className="mt-2 leading-6">
                      {copy.successDescription}
                    </Description>
                  }
                  onClose={close}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Content>
    </Container>
  );
};
