"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { useT } from "@/shared/i18n";

import type { SheetComponents } from "./sheet-components";
import { SubmitButton } from "./SubmitButton";

type MissingFormViewProps = SheetComponents & {
  missingName: string;
  memo: string;
  isSubmitting: boolean;
  isDisabled: boolean;
  onNameChange: (value: string) => void;
  onMemoChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export const MissingFormView = ({
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
}: MissingFormViewProps) => {
  const t = useT();

  return (
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
            aria-label={t.common.actions.back}
          >
            <ArrowLeft className="text-ink-sub h-5 w-5" />
          </button>
          <Title className="text-ink text-xl font-bold">
            {t.ingredientSheet.missingTitle}
          </Title>
        </div>
        <Description className="text-ink-muted mt-1 text-sm">
          {t.ingredientSheet.missingDescription}
        </Description>
      </Header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-2">
        <input
          type="text"
          value={missingName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t.ingredientSheet.missingNamePlaceholder}
          className="focus:border-olive-light text-ink w-full rounded-xl border-2 border-gray-200 p-4 transition-colors placeholder:text-gray-400 focus:ring-0 focus:outline-none"
        />

        <div className="mt-3">
          <textarea
            value={memo}
            onChange={(e) => onMemoChange(e.target.value)}
            placeholder={t.ingredientSheet.missingMemoPlaceholder}
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
