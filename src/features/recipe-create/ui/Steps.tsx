"use client";

import React, { useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

import { RecipeFormValues } from "../model/config";
import StepItem from "./StepItem";
import { FIELD_LABELS } from "../model/constants";

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
      <h2 className="text-xl font-bold text-gray-800">{FIELD_LABELS.steps}</h2>

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
              usedElsewhereLookup={usedElsewhereLookup}
            />
          );
        })}
        <button
          type="button"
          className="border-olive-light group text-olive-medium hover:bg-olive-light/15 mt-3 flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg border-2 border-dashed py-2 transition-all duration-300"
          onClick={addStep}
        >
          <Plus
            size={16}
            className="transition-transform group-hover:scale-105"
          />
          <span className="transition-transform group-hover:scale-105">
            과정 추가
          </span>
        </button>
      </div>
    </div>
  );
};

export default Steps;
