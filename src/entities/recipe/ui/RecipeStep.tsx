import { useMemo } from "react";

import { Image } from "@/shared/ui/image/Image";
import IngredientIcon from "@/shared/ui/IngredientIcon";
import { extractTimeFromText } from "@/shared/lib/extractTimeFromText";
import { extractCookingTerms } from "@/shared/lib/extractCookingTerms";

import { RecipeStep as RecipeStepType } from "@/entities/recipe/model/types";
import { StepTimer } from "@/features/step-timer";
import { WakeLockButton } from "@/features/screen-wake-lock";

type RecipeStepProps = {
  stepIndex: number;
  step: RecipeStepType;
  length: number;
  isFirstStep?: boolean;
};

const RecipeStep = ({ stepIndex, step, length, isFirstStep = false }: RecipeStepProps) => {
  const { terms: cookingTerms, cleanedText } = useMemo(
    () => extractCookingTerms(step.instruction),
    [step.instruction]
  );
  const timeInSeconds = extractTimeFromText(cleanedText);

  return (
    <div
      key={stepIndex}
      className="w-full h-full pb-4 border-b border-slate-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-left text-lg font-bold">
            Step {stepIndex + 1}/{length}
          </h3>
          {isFirstStep && (
            <div className="md:hidden">
              <WakeLockButton />
            </div>
          )}
        </div>
        {timeInSeconds && <StepTimer targetSeconds={timeInSeconds} />}
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <IngredientIcon />
        {step.ingredients?.map((ingredient, index) => (
          <div
            key={`${index}-${ingredient.name}`}
            className="flex gap-2 rounded-xl border-1 border-slate-200 p-1 px-2"
          >
            <p className="text-mm text-left">{ingredient.name}</p>
            {ingredient.quantity && (
              <p className="text-mm text-left font-bold text-olive-light">
                {ingredient.quantity}
                {ingredient.quantity === "약간" ? "" : ingredient.unit}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
        <div className="md:flex-1">
          <p className="whitespace-pre-wrap text-left">{cleanedText}</p>
          {cookingTerms.length > 0 && (
            <div className="mt-3 space-y-2">
              {cookingTerms.map((term, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-gray-50 p-3 text-sm"
                >
                  <span className="font-semibold">📖 {term.term}</span>{" "}
                  <span className="text-gray-600">{term.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {step.stepImageUrl && (
          <Image
            src={step.stepImageUrl}
            alt={`Step ${stepIndex + 1}`}
            wrapperClassName="mx-auto w-full max-w-[300px] rounded-2xl md:mx-0 md:w-[300px] shrink-0"
            fit="cover"
          />
        )}
      </div>
    </div>
  );
};

export default RecipeStep;
