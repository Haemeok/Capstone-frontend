import React from "react";
import { Image } from "@/shared/ui/image/Image";

import { RecipeStep } from "@/entities/recipe";

type SlideShowContentProps = {
  step: RecipeStep;
};

const SlideShowContent = ({ step }: SlideShowContentProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="relative w-full">
        <Image
          src={step.stepImageUrl}
          alt={`Step ${step.stepNumber}`}
          fit="cover"
        />
      </div>

      <div className="flex-shrink-0 bg-white p-6">
        {step.ingredients && step.ingredients.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center space-x-2 text-sm">
            {step.ingredients.map((ingredient) => (
              <span
                key={ingredient.name}
                className="bg-olive-light/80 flex items-center justify-center rounded-2xl px-2 py-1 text-sm text-white backdrop-blur-sm"
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
          <p className="text-dark mb-4 text-base font-bold whitespace-pre-wrap">
            {step.instruction}
          </p>
        )}
      </div>
    </div>
  );
};

export default SlideShowContent;
