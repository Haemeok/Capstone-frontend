"use client";

import React from "react";
import { FieldValues,useFormContext, useWatch } from "react-hook-form";

import { z } from "zod";

import { isKeyOf } from "@/shared/lib/typeguards";
import ProgressButton from "@/shared/ui/ProgressButton";

type FormProgressButtonProps = {
  isLoading: boolean;
  schema: z.ZodObject<any>;
  onClick?: () => void;
};

export const FormProgressButton = <T extends FieldValues>({
  schema,
  isLoading,
  onClick,
}: FormProgressButtonProps) => {
  const { control, formState } = useFormContext<T>();
  const { isValid, isDirty } = formState;

  const formValues = useWatch({ control });

  const fieldsSchema = schema.shape as Record<string, z.ZodTypeAny>;
  const fieldNames = Object.keys(fieldsSchema);

  const completedSteps = fieldNames.filter((key) => {
    const fieldSchema = fieldsSchema[key];
    let value: unknown = undefined;
    if (isKeyOf(formValues, key)) {
      value = formValues[key];
    }
    return fieldSchema.safeParse(value).success;
  }).length;

  console.log(fieldsSchema, completedSteps, formValues);

  const totalSteps = fieldNames.length;
  const progressPercentage =
    totalSteps > 0 ? Math.floor((completedSteps / totalSteps) * 100) : 0;

  return (
    <ProgressButton
      progressPercentage={progressPercentage}
      isFormValid={isValid && isDirty}
      isLoading={isLoading}
      onClick={onClick}
    />
  );
};
