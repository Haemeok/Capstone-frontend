import React from 'react';
import { RecipeStep } from '@/type/recipe';
import SuspenseImage from './Image/SuspenseImage';
type SlideShowContentProps = {
  step: RecipeStep;
  totalSteps: number;
};

const SlideShowContent = ({ step, totalSteps }: SlideShowContentProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-3/5">
        <SuspenseImage
          src={step.stepImageUrl}
          alt={`Step ${step.stepNumber}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="h-full p-6">
        {step.ingredients && step.ingredients.length > 0 && (
          <div className="text-muted-foreground mb-3 flex flex-wrap items-center space-x-2 text-sm">
            {step.ingredients.map((ingredient) => (
              <span
                key={ingredient.name}
                className="flex items-center justify-center rounded-2xl border-1 border-gray-200 px-2 py-1 text-sm"
              >
                <p className="text-sm">{ingredient.name}</p>
                <p className="ml-1 text-sm font-semibold">
                  {ingredient.quantity}
                  {ingredient.unit}
                </p>
              </span>
            ))}
          </div>
        )}
        {step.instruction && (
          <p className="mb-4 text-base font-semibold">{step.instruction}</p>
        )}
      </div>
    </div>
  );
};

export default SlideShowContent;
