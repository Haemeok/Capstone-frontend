"use client";

import { useId, useState } from "react";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import { toCookingRecordOffsetDateTime } from "../model/cookedAt";
import { useCreateManualCookingRecord } from "../model/hooks";
import type {
  ManualCookingRecordDrawerProps,
  ManualCookingRecordFormValues,
} from "./manualCookingRecord.types";
import { ManualCookingRecordForm } from "./ManualCookingRecordForm";
import { ManualCookingRecordSubmitFooter } from "./ManualCookingRecordSubmitFooter";

export const ManualCookingRecordDrawer = ({
  isOpen,
  copy,
  onOpenChange,
}: ManualCookingRecordDrawerProps) => {
  const { Container, Content, Title, Description } = useResponsiveSheet();
  const formId = useId();
  const mutation = useCreateManualCookingRecord();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setIsSuccess(false);
      setSubmitError(undefined);
      mutation.reset?.();
    }
  };

  const handleSubmit = async ({
    title,
    cookedDate,
    review,
    imageFile,
  }: ManualCookingRecordFormValues) => {
    setSubmitError(undefined);
    try {
      await mutation.createRecord({
        sourceType: "MANUAL",
        recordTitle: title.trim(),
        ...(review.trim() ? { recordMemo: review.trim() } : {}),
        cookedAt: toCookingRecordOffsetDateTime(cookedDate),
        images: [{ file: imageFile, purpose: "ORIGINAL" }],
      });
      triggerHaptic("Success");
      setIsSuccess(true);
    } catch {
      setSubmitError(copy.submitError);
    }
  };

  return (
    <Container open={isOpen} onOpenChange={handleOpenChange}>
      <Content className="flex max-h-[92dvh] flex-col overflow-hidden border-0 bg-white shadow-xl sm:max-w-md [&>[data-slot=dialog-close]]:hidden">
        {isOpen && !isSuccess ? (
          <button
            type="button"
            aria-label={copy.closeLabel}
            onClick={() => handleOpenChange(false)}
            className="absolute top-3 right-3 z-10 flex size-11 cursor-pointer items-center justify-center rounded-xl"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        ) : null}

        <motion.div
          layout
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="kb-pb flex min-h-0 flex-1 flex-col"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="px-6 pt-5 pb-6 text-center"
              >
                <Title className="text-[23px]">{copy.successTitle}</Title>
                <Description className="mt-2 leading-6">
                  {copy.successDescription}
                </Description>
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="text-ink focus-visible:outline-ink mt-8 h-12 w-full cursor-pointer rounded-xl bg-gray-100 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-gray-200"
                >
                  {copy.successClose}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex min-h-0 flex-1 flex-col pt-8"
              >
                <div
                  data-testid="manual-cooking-record-scroll"
                  className="min-h-0 flex-1 overflow-y-auto"
                >
                  <div className="px-5 pb-4">
                    <Title className="text-[23px]">{copy.title}</Title>
                    <Description className="text-ink-sub mt-1.5 leading-6">
                      {copy.description}
                    </Description>
                  </div>
                  <ManualCookingRecordForm
                    formId={formId}
                    copy={copy}
                    isDisabled={mutation.isPending}
                    submitError={submitError}
                    onSubmit={(values) => void handleSubmit(values)}
                  />
                </div>
                <ManualCookingRecordSubmitFooter
                  formId={formId}
                  copy={copy}
                  isPending={mutation.isPending}
                  isImageProcessing={mutation.isImageProcessing}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Content>
    </Container>
  );
};
