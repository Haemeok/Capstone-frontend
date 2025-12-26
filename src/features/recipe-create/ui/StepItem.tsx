"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { X } from "lucide-react";

import { ImageUploader } from "@/shared/ui/image/ImageUploader";

import { Checkbox } from "@/shared/ui/shadcn/checkbox";
import { Label } from "@/shared/ui/shadcn/label";

import { IngredientPayload } from "@/entities/ingredient";

import { RecipeFormValues } from "../model/config";
import { cn } from "@/lib/utils";

type StepItemProps = {
  index: number;
  removeStep: (index: number) => void;
  isDeletable: boolean;
  usedElsewhereLookup: Map<string, boolean>;
};

const StepItem = ({
  index,
  removeStep,
  isDeletable,
  usedElsewhereLookup,
}: StepItemProps) => {
  const {
    control,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();

  const mainIngredients = useWatch({
    control,
    name: "ingredients",
    defaultValue: [],
  });
  const stepIngredients = useWatch({
    control,
    name: `steps.${index}.ingredients`,
    defaultValue: [],
  });

  const usedIngredientNamesInThisStep = stepIngredients.map((i) => i.name);

  const handleStepIngredientToggle = (
    ingredient: IngredientPayload,
    isChecked: boolean
  ) => {
    const currentStepIngredients = watch(`steps.${index}.ingredients`) || [];
    let updatedIngredients;

    if (isChecked) {
      if (!currentStepIngredients.some((i) => i.name === ingredient.name)) {
        updatedIngredients = [
          ...currentStepIngredients,
          {
            name: ingredient.name,
            quantity: ingredient.quantity ?? "",
            unit: ingredient.unit,
          },
        ];
      } else {
        updatedIngredients = currentStepIngredients;
      }
    } else {
      updatedIngredients = currentStepIngredients.filter(
        (i) => i.name !== ingredient.name
      );
    }

    setValue(`steps.${index}.ingredients`, updatedIngredients, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="relative flex items-start gap-4 rounded-lg p-4 shadow-sm">
      <div className="bg-olive-light mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
        {index + 1}
      </div>
      <div className="mt-6 flex-1">
        <ImageUploader
          fieldName={`steps.${index}.image`}
          className="h-64 w-64"
        />

        <div className="mt-4 border-t pt-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            이 단계에서 사용할 재료:
          </h4>
          {mainIngredients.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {mainIngredients.map((ingredient) => {
                const isUsedInThisStep = usedIngredientNamesInThisStep.includes(
                  ingredient.name
                );

                const isUsedElsewhere =
                  usedElsewhereLookup.get(ingredient.name) ?? false;

                return (
                  <div
                    key={ingredient.name}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`step-${index}-ing-${ingredient.name}`}
                      checked={isUsedInThisStep}
                      onCheckedChange={(checked) => {
                        handleStepIngredientToggle(ingredient, !!checked);
                      }}
                      disabled={isUsedElsewhere}
                      className={cn(!isUsedElsewhere && "cursor-pointer")}
                    />
                    <Label
                      htmlFor={`step-${index}-ing-${ingredient.name}`}
                      className={`text-sm ${isUsedElsewhere && !isUsedInThisStep ? "text-gray-400 line-through" : "cursor-pointer text-gray-800 hover:text-gray-900"}`}
                    >
                      {ingredient.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              먼저 메인 재료 목록에 재료를 추가해주세요.
            </p>
          )}
        </div>
        <textarea
          id={`step-instruction-${index}`}
          aria-label={`${index + 1}번째 조리 과정`}
          aria-required={index === 0}
          aria-invalid={!!errors.steps?.[index]?.instruction}
          aria-describedby={
            errors.steps?.[index]?.instruction
              ? `step-instruction-error-${index}`
              : undefined
          }
          className={`mt-2 w-full rounded-md border border-gray-300 p-3 ${
            errors.steps?.[index]?.instruction ? "border-red-500" : ""
          } focus:border-olive-light min-h-[100px] resize-none focus:border-2 focus:outline-none`}
          placeholder={`${index + 1}번째 과정을 설명해주세요.`}
          {...register(`steps.${index}.instruction`, {
            required: index === 0 ? "조리 과정 설명은 필수입니다" : false,
          })}
        />
        {errors.steps?.[index]?.instruction && (
          <p
            id={`step-instruction-error-${index}`}
            className="mt-1 text-xs text-red-500"
            role="alert"
          >
            {errors.steps?.[index]?.instruction?.message ?? ""}
          </p>
        )}
      </div>
      <div className="absolute top-2 right-2">
        <button
          type="button"
          aria-label={`${index + 1}번째 단계 삭제`}
          className="cursor-pointer text-gray-500 hover:bg-red-100 hover:text-red-600"
          onClick={() => removeStep(index)}
          disabled={!isDeletable}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default StepItem;
