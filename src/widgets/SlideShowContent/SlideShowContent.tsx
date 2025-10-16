import React from "react";
import { Image } from "@/shared/ui/image/Image";

import { RecipeStep } from "@/entities/recipe";

type SlideShowContentProps = {
  step: RecipeStep;
};

const SlideShowContent = ({ step }: SlideShowContentProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 max-h-[60vh]">
        <Image
          src={step.stepImageUrl}
          alt={`Step ${step.stepNumber}`}
          fit="cover"
        />
      </div>

      <div className="flex-shrink-0 p-6 bg-white">
        {step.ingredients && step.ingredients.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center space-x-2 text-sm">
            {step.ingredients.map((ingredient) => (
              <span
                key={ingredient.name}
                className="flex items-center justify-center rounded-2xl bg-olive-mint/80 px-2 py-1 text-sm text-white backdrop-blur-sm"
              >
                <p className="text-sm">{ingredient.name}</p>
                <p className="ml-1 text-sm font-bold">
                  {ingredient.quantity}
                  {ingredient.unit}
                </p>
              </span>
            ))}
          </div>
        )}
        {step.instruction && (
          <p className="mb-4 text-base font-bold text-dark">
            {step.instruction}
          </p>
        )}
      </div>
    </div>
  );
};

export default SlideShowContent;
