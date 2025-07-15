import { RecipeStep as RecipeStepType } from "@/entities/recipe";

import RecipeStep from "./RecipeStep";
import Box from "@/shared/ui/Box";

type RecipeStepProps = {
  RecipeSteps: RecipeStepType[];
};

const RecipeStepList = ({ RecipeSteps }: RecipeStepProps) => {
  return (
    <Box className="flex flex-col gap-4">
      {RecipeSteps.map((step, stepIndex) => (
        <RecipeStep
          key={stepIndex}
          stepIndex={stepIndex}
          step={step}
          length={RecipeSteps.length}
        />
      ))}
    </Box>
  );
};

export default RecipeStepList;
