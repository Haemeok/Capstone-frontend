import { RecipeStep as RecipeStepType } from "@/type/recipe";
import IngredientIcon from "./Icon/IngredientIcon";

interface RecipeStepProps {
  stepIndex: number;
  step: RecipeStepType;
  length: number;
}
const RecipeStep = ({ stepIndex, step, length }: RecipeStepProps) => {
  return (
    <div key={stepIndex}>
      <h3 className="text-lg font-semibold mb-2 text-left">
        Step {stepIndex + 1}/{length}
      </h3>
      <div className="flex gap-2 items-center">
        <IngredientIcon />
        {step.ingredients?.map((ingredient, index) => (
          <div
            key={`${index}-${ingredient.name}`}
            className="flex gap-2 border-2 rounded-2xl p-1"
          >
            <p className="text-left ">{ingredient.name}</p>
            {ingredient.quantity && (
              <p className="text-left font-semibold">{ingredient.quantity}</p>
            )}
          </div>
        ))}
      </div>
      <ul className="flex gap-2">
        {step.cookingTools?.map((cookingTool, cookingToolIndex) => (
          <li key={cookingToolIndex}>{cookingTool}</li>
        ))}
      </ul>
      <p className="text-left">{step.instruction}</p>
    </div>
  );
};

export default RecipeStep;
