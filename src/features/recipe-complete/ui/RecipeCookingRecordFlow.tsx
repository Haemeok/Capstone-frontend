"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import type { RecipeCookingRecordFlowProps } from "./recipeCookingRecord.types";
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
  onSkip,
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

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setPhase("reward");
      setErrorMessage(undefined);
    }
  };

  const runAction = async (
    action: () => Promise<void>,
    handleSuccess: () => void
  ) => {
    setIsSubmitting(true);
    setErrorMessage(undefined);
    try {
      await action();
      triggerHaptic("Success");
      handleSuccess();
    } catch {
      setErrorMessage(copy.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container open={isOpen} onOpenChange={handleOpenChange}>
      <Content
        closeLabel={copy.close}
        className="flex max-h-[80dvh] flex-col overflow-hidden border-0 bg-white shadow-xl sm:max-w-md"
      >
        <motion.div
          layout
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="kb-pb flex min-h-0 flex-1 flex-col"
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
                  onSubmit={(draft) =>
                    void runAction(
                      () => onSubmit(draft),
                      () => setPhase("success")
                    )
                  }
                  onSkip={() =>
                    void runAction(onSkip, () => handleOpenChange(false))
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
                  onClose={() => handleOpenChange(false)}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Content>
    </Container>
  );
};
