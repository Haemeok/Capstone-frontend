import { useFormContext } from "react-hook-form";

import { RecipeFormValues } from "../model/config";

const Description = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();

  return (
    <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
      <textarea
        id="description"
        aria-label="레시피 설명"
        aria-invalid={!!errors.description}
        aria-describedby={errors.description ? "description-error" : undefined}
        className="h-24 w-full resize-none text-gray-800 placeholder:text-[#777777] focus:outline-none"
        placeholder="레시피에 대한 간단한 설명을 작성하세요.&#10;어떤 특징이 있는지, 어떤 상황에서 먹기 좋은지 등을 알려주세요."
        {...register("description")}
      />
      {errors.description && (
        <p id="description-error" className="mt-1 text-xs text-red-500" role="alert">
          {errors.description.message}
        </p>
      )}
    </div>
  );
};

export default Description;
