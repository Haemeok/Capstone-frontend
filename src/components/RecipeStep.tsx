import { RecipeStep as RecipeStepType } from '@/type/recipe';
import IngredientIcon from './Icon/IngredientIcon';
import SuspenseImage from './Image/SuspenseImage';

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
      <div className="flex items-center gap-2">
        <IngredientIcon />
        {step.ingredients?.map((ingredient, index) => (
          <div
            key={`${index}-${ingredient.name}`}
            className="flex gap-2 rounded-2xl border-2 p-1"
          >
            <p className="text-left">{ingredient.name}</p>
            {ingredient.quantity && (
              <p className="text-left font-semibold">{ingredient.quantity}</p>
            )}
          </div>
        ))}
      </div>
      <p className="text-left">{step.instruction}</p>
      <SuspenseImage
        src={step.stepImageUrl}
        alt={`Step ${stepIndex + 1}`}
        className="w-full rounded-2xl"
      />
    </div>
  );
};

export default RecipeStep;
