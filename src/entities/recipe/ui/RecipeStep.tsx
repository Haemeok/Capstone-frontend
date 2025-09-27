import { Image } from "@/shared/ui/image/Image";
import IngredientIcon from "@/shared/ui/IngredientIcon";

import { RecipeStep as RecipeStepType } from "@/entities/recipe/model/types";

type RecipeStepProps = {
  stepIndex: number;
  step: RecipeStepType;
  length: number;
};

const RecipeStep = ({ stepIndex, step, length }: RecipeStepProps) => {
  return (
    <div key={stepIndex} className="w-full h-full">
      <h3 className="mb-2 text-left text-lg font-bold">
        Step {stepIndex + 1}/{length}
      </h3>
      <div className="flex flex-wrap items-center gap-1">
        <IngredientIcon />
        {step.ingredients?.map((ingredient, index) => (
          <div
            key={`${index}-${ingredient.name}`}
            className="flex gap-2 rounded-xl border-1 border-slate-200 p-1 px-2"
          >
            <p className="text-mm text-left">{ingredient.name}</p>
            {ingredient.quantity && (
              <p className="text-mm text-left font-bold">
                {ingredient.quantity}
                {ingredient.unit}
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-left">{step.instruction}</p>
      <div className="w-full h-80">
        {step.stepImageUrl && (
          <Image
            src={step.stepImageUrl}
            alt={`Step ${stepIndex + 1}`}
            className="mt-2 w-full rounded-2xl h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default RecipeStep;
