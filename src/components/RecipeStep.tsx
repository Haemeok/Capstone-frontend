import { RecipeStep as RecipeStepType } from '@/type/recipe';
import IngredientIcon from './Icon/IngredientIcon';

interface RecipeStepProps {
  stepIndex: number;
  step: RecipeStepType;
  length: number;
}
const RecipeStep = ({ stepIndex, step, length }: RecipeStepProps) => {
  return (
    <div key={stepIndex}>
      <h3 className="mb-2 text-left text-lg font-semibold">
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
              <p className="text-mm text-left font-semibold">
                {ingredient.quantity}
                {ingredient.unit}
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-left">{step.instruction}</p>
      {step.stepImageUrl && (
        <img
          src={step.stepImageUrl}
          alt={`Step ${stepIndex + 1}`}
          className="mt-2 w-full rounded-2xl"
        />
      )}
    </div>
  );
};

export default RecipeStep;
