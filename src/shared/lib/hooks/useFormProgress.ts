import { FieldValues, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { isKeyOf } from "@/shared/lib/typeguards";

type UseFormProgressOptions = {
  fieldLabels?: Record<string, string>;
};

export const useFormProgress = <T extends FieldValues>(
  schema: z.ZodObject<any>,
  options?: UseFormProgressOptions
) => {
  const { control } = useFormContext<T>();
  const formValues = useWatch({ control });

  const fieldsSchema = schema.shape;
  const fieldNames = Object.keys(fieldsSchema);

  const invalidFields = fieldNames.filter((key) => {
    const fieldSchema = fieldsSchema[key];
    let value: unknown = undefined;

    if (isKeyOf(formValues, key)) {
      value = formValues[key];
    }

    return !fieldSchema.safeParse(value).success;
  });

  const totalSteps = fieldNames.length;
  const completedSteps = totalSteps - invalidFields.length;

  const progressPercentage =
    totalSteps > 0 ? Math.floor((completedSteps / totalSteps) * 100) : 0;

  const missingFieldLabels = invalidFields
    .map((key) => (options?.fieldLabels?.[key] || key))
    .filter(Boolean);

  return {
    progressPercentage,
    missingFieldLabels,
    isComplete: invalidFields.length === 0,
    completedSteps,
    totalSteps,
  };
};
