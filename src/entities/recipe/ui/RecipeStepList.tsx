import { RecipeStep as RecipeStepType } from "@/entities/recipe";

import RecipeStep from "./RecipeStep";

type RecipeStepProps = {
  RecipeSteps: RecipeStepType[];
};

const RecipeStepList = ({ RecipeSteps }: RecipeStepProps) => {
  return (
    <div className="flex flex-col gap-4">
      {RecipeSteps.map((step, stepIndex) => (
        <RecipeStep
          key={stepIndex}
          stepIndex={stepIndex}
          step={step}
          length={RecipeSteps.length}
        />
      ))}
    </div>
  );
};

export default RecipeStepList;
