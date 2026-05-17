"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

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
}: MissingFormViewProps) => (
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
