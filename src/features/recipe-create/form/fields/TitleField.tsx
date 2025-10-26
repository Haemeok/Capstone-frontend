import { useFormContext, useWatch } from "react-hook-form";

import { RecipeFormValues } from "../../model/config";
import { TITLE } from "../../model/constants";

export const TitleField = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();
  const title = useWatch({ control, name: "title" });

  return (
    <div className="flex w-full flex-col gap-1 ">
      <input
        type="text"
        maxLength={TITLE.MAX}
        aria-label="레시피 이름"
        aria-required="true"
        aria-invalid={!!errors.title}
        aria-describedby={errors.title ? "title-error" : undefined}
        className={`w-full border-b bg-transparent pb-2 text-4xl font-bold text-white ${errors.title ? "border-red-500" : "border-white/30"} focus:border-white focus:outline-none`}
        placeholder="레시피 이름"
        {...register("title")}
      />
      <div className="flex items-center justify-between">
        {errors.title ? (
          <p id="title-error" className="text-xs text-red-300" role="alert">
            {String(errors.title.message)}
          </p>
        ) : (
          <div />
        )}
        <p className="text-sm text-white/70">
          {title?.length ?? 0}/{TITLE.MAX}
        </p>
      </div>
    </div>
  );
};
