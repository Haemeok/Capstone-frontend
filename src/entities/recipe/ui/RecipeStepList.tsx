"use client";

import { Fragment, type ReactNode } from "react";

import { IngredientItem } from "@/entities/ingredient";
import { RecipeStep as RecipeStepType } from "@/entities/recipe/model/types";

import RecipeStep from "./RecipeStep";

const MIN_STEPS_FOR_MID_SLOT = 5;

type RecipeStepProps = {
  RecipeSteps: RecipeStepType[];
  recipeIngredients?: Omit<IngredientItem, "inFridge">[];
  midSlot?: ReactNode;
};

const RecipeStepList = ({
  RecipeSteps,
  recipeIngredients,
  midSlot,
}: RecipeStepProps) => {
  const midIndex =
    midSlot && RecipeSteps.length >= MIN_STEPS_FOR_MID_SLOT
      ? Math.floor(RecipeSteps.length / 2)
      : -1;

  return (
    <article className="mt-4 flex flex-col gap-4">
      {RecipeSteps.map((step, stepIndex) => (
        <Fragment key={stepIndex}>
          {stepIndex === midIndex && midSlot}
          <RecipeStep
            stepIndex={stepIndex}
            step={step}
            length={RecipeSteps.length}
            isFirstStep={stepIndex === 0}
            recipeIngredients={recipeIngredients}
          />
        </Fragment>
      ))}
    </article>
  );
};

export default RecipeStepList;
