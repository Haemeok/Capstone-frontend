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
};

export const FormProgressButton = <T extends FieldValues>({
  schema,
  isLoading,
  onClick,
  text,
}: FormProgressButtonProps) => {
  const { formState } = useFormContext<T>();
  const { isValid, isDirty } = formState;

  const { progressPercentage } = useFormProgress<T>(schema);

  return (
    <ProgressButton
      progressPercentage={progressPercentage}
      isFormValid={isValid && isDirty}
      isLoading={isLoading}
      onClick={onClick}
      text={text}
    />
  );
};
