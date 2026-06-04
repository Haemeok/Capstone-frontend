import type { StaticRecipe } from "@/entities/recipe/model/types";

type RecipeStepsBoxProps = {
  recipe: StaticRecipe | null | undefined;
};

export const RecipeStepsBox = ({ recipe }: RecipeStepsBoxProps) => {
  if (!recipe?.steps?.length) return null;

  return (
    <aside className="my-8 rounded-2xl border border-gray-200 px-6 py-5">
      <h3 className="text-sm font-bold tracking-wide text-gray-700">
        만드는 법
      </h3>
      <ol className="mt-3 space-y-3 text-[15px] leading-relaxed text-gray-800">
        {recipe.steps.map((step, i) => (
          <li key={step.stepNumber ?? i} className="flex gap-3">
            <span className="text-olive-dark mt-0.5 inline-block w-5 shrink-0 text-sm font-semibold">
              {step.stepNumber ?? i + 1}
            </span>
            <span>{step.instruction}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
};
