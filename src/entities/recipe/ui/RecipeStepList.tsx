"use client";

import { RecipeStep as RecipeStepType } from "@/entities/recipe";

import RecipeStep from "./RecipeStep";

type RecipeStepProps = {
  RecipeSteps: RecipeStepType[];
};

const RecipeStepList = ({ RecipeSteps }: RecipeStepProps) => {
  return (
    <article className="mt-4 flex flex-col gap-4">
      {RecipeSteps.map((step, stepIndex) => (
        <RecipeStep
          key={stepIndex}
          stepIndex={stepIndex}
          step={step}
          length={RecipeSteps.length}
          isFirstStep={stepIndex === 0}
        />
      ))}
    </article>
  );
};

export default RecipeStepList;
