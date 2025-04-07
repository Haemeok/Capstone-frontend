import React from "react";
import { RecipeStep } from "@/type/recipe";
type SlideShowContentProps = {
  step: RecipeStep;
  totalSteps: number;
};

const SlideShowContent = ({ step, totalSteps }: SlideShowContentProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="relative h-3/5">
        <img
          src={step.stepImageUrl}
          alt={`Step ${step.stepNumber}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 h-full">
        {step.ingredients && step.ingredients.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
            {step.ingredients.map((ingredient) => (
              <span
                key={ingredient.id}
                className="bg-muted px-2 py-1 rounded text-xs"
              >
                {ingredient.name}
              </span>
            ))}
          </div>
        )}
        {step.instruction && (
          <h2 className="text-2xl font-bold mb-4">{step.instruction}</h2>
        )}
        <div className="prose prose-sm max-w-none">
          {typeof step.instruction === "string" ? (
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
