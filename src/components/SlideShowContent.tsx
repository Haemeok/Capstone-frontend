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
          <div className="text-muted-foreground mb-3 flex items-center space-x-2 text-sm">
            {step.ingredients.map((ingredient) => (
              <span
                key={ingredient.name}
                className="bg-muted rounded px-2 py-1 text-xs"
              >
                {ingredient.name}
              </span>
            ))}
          </div>
        )}
        {step.instruction && (
          <h2 className="mb-4 text-2xl font-bold">{step.instruction}</h2>
        )}
        <div className="prose prose-sm max-w-none">
          {typeof step.instruction === 'string' ? (
            <p>{step.instruction}</p>
          ) : (
            step.instruction
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideShowContent;
