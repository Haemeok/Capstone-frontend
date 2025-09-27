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
    <div className="flex w-[87.5%] items-center justify-between">
      <input
        type="text"
        className={`border-b bg-transparent pb-2 text-4xl font-bold text-white ${errors.title ? "border-red-500" : "border-white/30"} focus:border-white focus:outline-none`}
        placeholder="레시피 이름"
        maxLength={TITLE.MAX}
        {...register("title")}
      />
      <p className="text-sm text-white">
        {title?.length ?? 0}/{TITLE.MAX}
      </p>
      {errors.title && (
        <p className="mt-1 text-xs text-red-300">
          {String(errors.title.message)}
        </p>
      )}
    </div>
  );
};
