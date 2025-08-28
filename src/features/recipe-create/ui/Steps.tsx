"use client";

import React, { useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

import { RecipeFormValues } from "../model/config";
import StepItem from "./StepItem";

const Steps = () => {
  const { control } = useFormContext<RecipeFormValues>();

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  const stepsValue = useWatch({
    control,
    name: "steps",
    defaultValue: [],
  });

  const addStep = () => {
    appendStep({
      stepNumber: stepsValue.length,
      instruction: "",
      image: null,
      ingredients: [],
    });
  };

  const ingredientUsageMap = useMemo(() => {
    const map = new Map<string, Set<number>>();
    stepsValue.forEach((step, index) => {
      (step.ingredients || []).forEach((ingredient) => {
        if (!map.has(ingredient.name)) {
          map.set(ingredient.name, new Set());
        }
        map.get(ingredient.name)!.add(index);
      });
    });
    return map;
  }, [stepsValue]);

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">조리 과정</h2>

      <div className="space-y-6">
        {stepFields.map((step, index) => {
          const usedElsewhereLookup = new Map<string, boolean>();
          ingredientUsageMap.forEach((indices, ingName) => {
            const isUsedElsewhere = Array.from(indices).some(
              (i) => i !== index
            );
            usedElsewhereLookup.set(ingName, isUsedElsewhere);
          });

          return (
            <StepItem
              key={step.id}
              index={index}
              removeStep={removeStep}
              isDeletable={stepFields.length > 1}
              usedElsewhereLookup={usedElsewhereLookup} // 4. 계산된 결과를 prop으로 전달
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
