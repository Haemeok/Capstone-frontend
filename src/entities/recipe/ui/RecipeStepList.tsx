"use client";

import { IngredientItem } from "@/entities/ingredient";
import { RecipeStep as RecipeStepType } from "@/entities/recipe";

import RecipeStep from "./RecipeStep";

type RecipeStepProps = {
  RecipeSteps: RecipeStepType[];
  recipeIngredients?: Omit<IngredientItem, "inFridge">[];
};

const RecipeStepList = ({
  RecipeSteps,
  recipeIngredients,
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
        />
      ))}
    </article>
  );
};

export default RecipeStepList;
