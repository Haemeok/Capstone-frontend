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
  const { control, getValues } = useFormContext<T>();
  const watchedValues = useWatch({ control });
  // useWatch가 초기 렌더링 시 빈 객체를 반환하거나 undefined 값을 포함할 수 있음
  // getValues()를 기본으로 하고, watchedValues에서 undefined가 아닌 값만 덮어씀
  const definedWatchedValues = Object.fromEntries(
    Object.entries(watchedValues).filter(([_, v]) => v !== undefined)
  );
  const formValues = { ...getValues(), ...definedWatchedValues };

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
