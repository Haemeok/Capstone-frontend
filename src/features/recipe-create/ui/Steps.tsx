"use client";

import React, { useState } from "react";
import {
  Control,
  useFieldArray,
  useFormContext,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { UseFormRegister } from "react-hook-form";
import { FieldErrors } from "react-hook-form";

import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

import { RecipeFormValues } from "../model/config";
import StepItem from "./StepItem";

const Steps = () => {
  const { control, watch, setValue, register } =
    useFormContext<RecipeFormValues>();

  const [stepImagePreviewUrls, setStepImagePreviewUrls] = useState<
    (string | null)[]
  >([]);

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  const addStep = () => {
    const currentSteps = watch("steps");
    const nextStepNumber = currentSteps.length;
    appendStep({
      stepNumber: nextStepNumber,
      instruction: "",
      imageFile: null,
      ingredients: [],
      imageKey: null,
    });
  };

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">조리 과정</h2>

      <div className="space-y-6">
        {stepFields.map((step, index) => {
          const mainIngredients = watch("ingredients");
          return (
            <StepItem
              key={step.id}
              stepId={step.id}
              index={index}
              stepFields={stepFields}
              removeStep={removeStep}
              mainIngredients={mainIngredients}
              stepImagePreviewUrls={stepImagePreviewUrls}
              setStepImagePreviewUrls={setStepImagePreviewUrls}
            />
          );
        })}
        <Button
          type="button"
          variant="outline"
          className="border-olive-light text-olive-medium mt-3 flex w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed py-2"
          onClick={addStep}
        >
          <Plus size={16} />
          과정 추가
        </Button>
      </div>
    </div>
  );
};

export default Steps;
