"use client";

import { ReactNode } from "react";

import { IngredientItem } from "@/entities/ingredient";
import { RecipeStep as RecipeStepType } from "@/entities/recipe";

import RecipeStep from "./RecipeStep";

type RecipeStepProps = {
  RecipeSteps: RecipeStepType[];
  recipeIngredients?: Omit<IngredientItem, "inFridge">[];
  firstStepHeaderExtra?: ReactNode;
};

const RecipeStepList = ({
  RecipeSteps,
  recipeIngredients,
  firstStepHeaderExtra,
}: RecipeStepProps) => {
  return (
    <article className="mt-4 flex flex-col gap-4">
      {RecipeSteps.map((step, stepIndex) => (
        <RecipeStep
          key={stepIndex}
          stepIndex={stepIndex}
          step={step}
          length={RecipeSteps.length}
          isFirstStep={stepIndex === 0}
          recipeIngredients={recipeIngredients}
          headerExtra={stepIndex === 0 ? firstStepHeaderExtra : undefined}
        />
      ))}
    </article>
  );
};

export default RecipeStepList;
