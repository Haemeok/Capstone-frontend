"use client";

import React from "react";
import { FieldValues, useFormContext } from "react-hook-form";

import { z } from "zod";

import ProgressButton from "@/shared/ui/ProgressButton";
import { useFormProgress } from "@/shared/lib/hooks/useFormProgress";

type FormProgressButtonProps = {
  isLoading: boolean;
  schema: z.ZodObject<any>;
  onClick?: () => void;
  text: string;
  fieldLabels?: Record<string, string>;
};

export const FormProgressButton = <T extends FieldValues>({
  schema,
  isLoading,
  onClick,
  text,
  fieldLabels,
}: FormProgressButtonProps) => {
  const { formState } = useFormContext<T>();
  const { isValid } = formState;

  const { progressPercentage, missingFieldLabels } = useFormProgress<T>(
    schema,
    { fieldLabels }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {missingFieldLabels.length > 0 && (
        <p className="rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-600">
          다음 항목을 입력해주세요:{" "}
          <span className="font-semibold">{missingFieldLabels.join(", ")}</span>
        </p>
      )}
      <ProgressButton
        progressPercentage={progressPercentage}
        isFormValid={isValid}
        isLoading={isLoading}
        onClick={onClick}
        text={text}
      />
    </div>
  );
};
