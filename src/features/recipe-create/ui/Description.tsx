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
        className="h-24 w-full resize-none text-[#777777] focus:outline-none"
        placeholder="레시피에 대한 간단한 설명을 작성하세요. 어떤 특징이 있는지, 어떤 상황에서 먹기 좋은지 등을 알려주세요."
        {...register("description", {
          required: "레시피 설명을 입력해주세요.",
        })}
      />
      {errors.description && (
        <p className="mt-1 text-xs text-red-500">
          {errors.description.message}
        </p>
      )}
    </div>
  );
};

export default Description;
