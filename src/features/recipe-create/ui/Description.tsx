import { useFormContext } from "react-hook-form";

import { useRecipeFormDict } from "@/shared/i18n";

import { RecipeFormValues } from "../model/config";

const Description = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();
  const { ui } = useRecipeFormDict();

  return (
    <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
      <textarea
        id="description"
        aria-label={ui.descriptionLabel}
        aria-invalid={!!errors.description}
        aria-describedby={errors.description ? "description-error" : undefined}
        className="text-ink placeholder:text-ink-muted h-24 w-full resize-none focus:outline-none"
        placeholder={ui.descriptionPlaceholder}
        {...register("description")}
      />
      {errors.description && (
        <p
          id="description-error"
          className="mt-1 text-xs text-red-500"
          role="alert"
        >
          {errors.description.message}
        </p>
      )}
    </div>
  );
};

export default Description;
