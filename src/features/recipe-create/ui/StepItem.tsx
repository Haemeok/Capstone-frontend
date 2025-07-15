"use client";

import React, { useEffect } from "react";
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useWatch,
} from "react-hook-form";
import Image from "next/image";

import { UploadIcon, X } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";
import { Label } from "@/shared/ui/shadcn/label";

import { IngredientPayload } from "@/entities/ingredient";

import { RecipeFormValues } from "../model/types";

type StepItemProps = {
  control: Control<RecipeFormValues>;
  register: UseFormRegister<RecipeFormValues>;
  index: number;
  stepId: string;
  errors: FieldErrors<RecipeFormValues>;
  watch: UseFormWatch<RecipeFormValues>;
  setValue: UseFormSetValue<RecipeFormValues>;
  stepImagePreviewUrls: (string | null)[];
  setStepImagePreviewUrls: React.Dispatch<
    React.SetStateAction<(string | null)[]>
  >;
  stepFields: FieldArrayWithId<RecipeFormValues, "steps", "id">[];
  removeStep: (index: number) => void;
  mainIngredients: IngredientPayload[];
};

const StepItem = ({
  control,
  register,
  index,
  stepId,
  errors,
  watch,
  setValue,
  stepImagePreviewUrls,
  setStepImagePreviewUrls,
  stepFields,
  removeStep,
  mainIngredients,
}: StepItemProps) => {
  const stepImageFileValue = useWatch({
    control,
    name: `steps.${index}.imageFile`,
  });

  useEffect(() => {
    const fileList = stepImageFileValue as FileList;
    const actualFile = fileList?.[0];

    const currentPreviewUrl = stepImagePreviewUrls[index] ?? null;

    if (actualFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviewUrl = reader.result as string;
        if (currentPreviewUrl !== newPreviewUrl) {
          setStepImagePreviewUrls((prevUrls) => {
            const newUrls = [...prevUrls];
            newUrls[index] = newPreviewUrl;
            return newUrls;
          });
        }
      };
      reader.readAsDataURL(actualFile);
    }
  }, [
    stepImageFileValue,
    index,
    setStepImagePreviewUrls,
    stepImagePreviewUrls,
  ]);

  const removeStepImage = () => {
    setValue(`steps.${index}.imageFile`, null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setStepImagePreviewUrls((prevUrls) => {
      const newUrls = [...prevUrls];
      newUrls[index] = null;
      return newUrls;
    });
  };

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
          { name: ingredient.name, quantity: "", unit: ingredient.unit },
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

  const usedIngredientNamesInThisStep = (
    watch(`steps.${index}.ingredients`) || []
  ).map((i) => i.name);

  return (
    <div
      key={stepId}
      className="relative flex items-start gap-4 rounded-lg p-4 shadow-sm"
    >
      <div className="bg-olive-light flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-semibold text-white">
        {index + 1}
      </div>
      <div className="flex-1">
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700">
            과정 이미지 (선택)
          </label>
          <div className="mt-1 flex items-center gap-3">
            <div
              className="flex h-24 w-24 cursor-pointer items-center relative justify-center rounded border border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:bg-gray-100"
              onClick={() =>
                document.getElementById(`step-image-input-${index}`)?.click()
              }
            >
              {stepImagePreviewUrls[index] ? (
                <Image
                  src={stepImagePreviewUrls[index]!}
                  alt={`Step ${index + 1} preview`}
                  className="h-full w-full object-cover"
                  fill
                />
              ) : (
                <UploadIcon size={24} />
              )}
            </div>
            <input
              type="file"
              id={`step-image-input-${index}`}
              className="hidden"
              accept="image/*"
              {...register(`steps.${index}.imageFile`)}
            />
            {stepImagePreviewUrls[index] && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeStepImage}
              >
                삭제
              </Button>
            )}
          </div>
          {errors.steps?.[index]?.imageFile && (
            <p className="mt-1 text-xs text-red-500">
              {String(errors.steps[index]?.imageFile?.message) ||
                "이미지 처리 중 오류"}
            </p>
          )}
        </div>

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
                const isUsedElsewhere = watch("steps").some(
                  (s, stepIdx) =>
                    index !== stepIdx &&
                    (s.ingredients || []).some(
                      (i) => i.name === ingredient.name
                    )
                );

                return (
                  <div
                    key={ingredient.name}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`step-${index}-ing-${ingredient.name}`}
                      checked={isUsedInThisStep}
                      onCheckedChange={(checked) => {
                        handleStepIngredientToggle(ingredient, !!checked);
                      }}
                      disabled={isUsedElsewhere}
                    />
                    <Label
                      htmlFor={`step-${index}-ing-${ingredient.name}`}
                      className={`text-sm ${isUsedElsewhere && !isUsedInThisStep ? "text-gray-400 line-through" : "text-gray-800"}`}
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
          className={`mt-2 w-full rounded-md border border-gray-300 p-3 ${
            errors.steps?.[index]?.instruction ? "border-red-500" : ""
          } focus:border-olive-light min-h-[100px] resize-none focus:outline-none`}
          placeholder={`${index + 1}번째 과정을 설명해주세요`}
          {...register(`steps.${index}.instruction`, {
            required: index === 0 ? "조리 과정 설명은 필수입니다" : false,
          })}
        />
        {errors.steps?.[index]?.instruction && (
          <p className="mt-1 text-xs text-red-500">
            {errors.steps?.[index]?.instruction?.message ?? ""}
          </p>
        )}
      </div>
      <div className="absolute top-2 right-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:bg-red-100 hover:text-red-600"
          onClick={() => stepFields.length > 1 && removeStep(index)}
          disabled={stepFields.length <= 1}
        >
          <X size={18} />
        </Button>
      </div>
    </div>
  );
};

export default StepItem;
