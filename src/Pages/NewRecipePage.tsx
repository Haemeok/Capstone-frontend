import React, { useRef } from "react";
import { useNavigate } from "react-router";
import { Upload as UploadIcon, Plus, X, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressButton from "@/components/ProgressButton";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";

import useCreateRecipeMutation from "@/hooks/useCreateRecipeMutation";
import { Ingredient, Recipe, RecipeStep } from "@/type/recipe";

const NewRecipePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createRecipe = useCreateRecipeMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<Recipe>({
    defaultValues: {
      title: "",
      imageURL: "",
      ingredients: [{ quantity: "", name: "", unit: "" }],
      cookingTime: undefined,
      servings: undefined,
      dishType: "",
      description: "",
      steps: [
        {
          ingredients: [{ quantity: "", name: "", unit: "" }],
          instruction: "",
          stepImageUrl: "",
          stepNumber: 0,
        },
      ],
    },
    mode: "onChange",
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setValue("imageURL", e.target.result as string, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValue("description", e.target.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const addIngredient = () => {
    const newId =
      ingredientFields.length > 0
        ? Math.max(...ingredientFields.map((f) => parseInt(f.id))) + 1
        : 1;
    appendIngredient({ id: newId, name: "", quantity: "", unit: "" });
  };

  const addStep = () => {
    const newId =
      stepFields.length > 0
        ? Math.max(...stepFields.map((f) => parseInt(f.id))) + 1
        : 1;
    appendStep({ id: newId, instruction: "", stepImageUrl: "", stepNumber: 0 });
  };

  const onSubmit: SubmitHandler<Recipe> = (data) => {
    console.log("제출 데이터:", data);

    const filteredData = {
      ...data,
      imageURL: "123",
      ingredients: data.ingredients.filter((i) => i.name.trim() !== ""),
      steps: data.steps.filter((s) => s.instruction.trim() !== ""),
    };

    console.log("정제된 제출 데이터:", filteredData);

    createRecipe.mutate(filteredData);

    navigate("/recipes");
  };

  const formValues = watch();

  const needSteps = [
    formValues.title.trim() !== "",
    formValues.imageURL !== "",
    formValues.description !== "",
    formValues.dishType !== "",
    formValues.cookingTime !== "",
    formValues.servings !== 0,
    formValues.ingredients.some((i: Ingredient) => i.name.trim() !== ""),
    formValues.steps.some((s: RecipeStep) => s.instruction.trim() !== ""),
  ];

  const completedSteps = needSteps.filter(Boolean).length;
  const totalSteps = needSteps.length;
  const progressPercentage = Math.floor((completedSteps / totalSteps) * 100);

  return (
    <div className="min-h-screen">
      <form id="recipe-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <div
            className="w-full h-[40vh] flex items-center justify-center cursor-pointer relative"
            onClick={() => fileInputRef.current?.click()}
          >
            {formValues.imageURL ? (
              <img
                src={formValues.imageURL}
                alt="Recipe thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <UploadIcon size={48} className="text-[#58C16A] mx-auto mb-3" />
                <p className="text-[#58C16A]">이미지를 업로드해주세요</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
          </div>

          <div className="flex flex-col justify-center absolute bottom-0 h-32 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center w-7/8 max-w-7/8 justify-between">
              <input
                type="text"
                className={` bg-transparent text-4xl pb-2 font-bold border-b text-white ${
                  errors.title ? "border-red-500" : "border-white/30"
                }  focus:outline-none focus:border-white`}
                placeholder="레시피 이름"
                {...register("title", {
                  required: "레시피 이름은 필수입니다",
                })}
              />
              <p className="text-white text-sm">{formValues.title.length}/20</p>
            </div>
            {errors.title && (
              <p className="text-red-300 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pt-6">
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <textarea
              className="w-full h-24 text-[#777777] focus:outline-none"
              placeholder="레시피에 대한 간단한 설명을 작성하세요. 어떤 특징이 있는지, 어떤 상황에서 먹기 좋은지 등을 알려주세요."
              onChange={handleDescriptionChange}
            />
          </div>

          <div className="flex justify-center gap-4 border-b border-[#00473c]/20 py-4 mb-4">
            <div className="flex flex-col flex-1">
              <div className="text-center flex gap-2 h-10 justify-center items-center">
                <p className="text-[#777777] mb-1">카테고리</p>
                <select
                  className={`w-20 bg-transparent border-1 border-gray-300 rounded-md ${
                    errors.dishType ? "border-red-500" : "border-[#00473c]/30"
                  } pb-1 text-center focus:outline-none`}
                  {...register("dishType", {
                    required: "카테고리를 선택해주세요",
                  })}
                >
                  <option value="" className="">
                    선택하기
                  </option>
                  <option value="korean" className="">
                    한식
                  </option>
                  <option value="western" className="">
                    양식
                  </option>
                  <option value="japanese" className="">
                    일식
                  </option>
                  <option value="chinese" className="">
                    중식
                  </option>
                  <option value="dessert" className="">
                    디저트
                  </option>
                </select>
              </div>
              {errors.dishType && (
                <p className="text-red-300 text-xs mt-1 text-center">
                  {errors.dishType.message}
                </p>
              )}
            </div>
            <div className="flex flex-col flex-1">
              <div className="text-center h-10 flex items-center justify-center gap-2">
                <p className="text-[#777777] mb-1">조리시간</p>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-20 bg-transparent border-b ${
                      errors.cookingTime
                        ? "border-red-500"
                        : "border-[#00473c]/30"
                    } pb-1 text-center focus:outline-none focus:border-[#00473c]`}
                    placeholder="30"
                    {...register("cookingTime", {
                      required: "조리 시간을 입력해주세요",
                      pattern: {
                        value: /^\d+$/,
                        message: "숫자만 입력 가능합니다",
                      },
                    })}
                  />
                  <span className="text-sm ml-1">분</span>
                </div>
              </div>
              {errors.cookingTime && (
                <p className="text-red-300 text-xs mt-1 text-center">
                  {errors.cookingTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center h-20 py-4">
              <h2 className="text-2xl font-semibold text-gray-700">재료</h2>
              <div className="flex flex-col">
                <div className="flex w-40 justify-center items-center gap-2 text-center h-full">
                  <select
                    className={`bg-transparent border-b ${
                      errors.servings ? "border-red-500" : "border-[#00473c]/30"
                    } pb-1 text-center focus:outline-none focus:border-[#00473c]`}
                    {...register("servings", {
                      required: "인분을 선택해주세요",
                      valueAsNumber: true,
                    })}
                  >
                    <option value="0" className="bg-[#f4f3e7]">
                      선택하기
                    </option>
                    <option value="1" className="bg-[#f4f3e7]">
                      1
                    </option>
                    <option value="2" className="bg-[#f4f3e7]">
                      2
                    </option>
                    <option value="3" className="bg-[#f4f3e7]">
                      3
                    </option>
                  </select>
                  <p className="text-[#777777] mb-1">인분</p>
                </div>
                {errors.servings && (
                  <p className="text-red-300 text-xs mt-1 text-center">
                    {errors.servings.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {ingredientFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3 p-3 border-b justify-between border-[#00473c]/10 bg-white rounded-lg shadow-sm"
                >
                  <div className="w-10 h-10 bg-[#58C16A]/10 rounded-lg flex items-center justify-center">
                    <ChefHat size={20} className="text-[#58C16A]" />
                  </div>

                  <div className="flex gap-2 flex-1 justify-between">
                    <input
                      type="text"
                      className={`bg-transparent w-20 ${
                        errors.ingredients?.[index]?.name
                          ? "border-red-500"
                          : "border-[#00473c]/10"
                      } focus:outline-none border-b`}
                      placeholder="재료명"
                      {...register(`ingredients.${index}.name`, {
                        required: index === 0 ? "재료명은 필수입니다" : false,
                      })}
                    />
                    <div className="flex gap-1">
                      <input
                        type="text"
                        className="w-16 bg-transparent border-b border-[#00473c]/10 text-center focus:outline-none focus:border-[#00473c]"
                        placeholder="수량"
                        {...register(`ingredients.${index}.quantity`)}
                      />
                      <input
                        type="text"
                        className="w-16 bg-transparent border-b border-[#00473c]/10 text-center focus:outline-none focus:border-[#00473c]"
                        placeholder="단위"
                        {...register(`ingredients.${index}.unit`)}
                      />
                    </div>
                    {errors.ingredients?.[index]?.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ingredients[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-[#777777] hover:text-red-500"
                      onClick={() =>
                        ingredientFields.length > 1 && removeIngredient(index)
                      }
                    >
                      <X size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2 flex items-center justify-center gap-1 border-dashed border-[#58C16A]/40 text-[#58C16A] hover:bg-[#58C16A]/5"
              onClick={addIngredient}
            >
              <Plus size={16} />
              재료 추가
            </Button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">조리 과정</h2>

            <div className="space-y-4">
              {stepFields.map((step, index) => (
                <div key={step.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#58C16A] rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 relative">
                    <textarea
                      className={`w-full bg-white p-3 rounded-lg ${
                        errors.steps?.[index]?.instruction
                          ? "border border-red-500"
                          : "border border-[#00473c]/20"
                      } focus:outline-none focus:border-[#00473c] shadow-sm min-h-[80px]`}
                      placeholder={`${index + 1}번째 과정을 설명해주세요`}
                      {...register(`steps.${index}.instruction`, {
                        required:
                          index === 0 ? "조리 과정 설명은 필수입니다" : false,
                      })}
                    />
                    {errors.steps?.[index]?.instruction && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.steps[index]?.instruction?.message}
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-[#777777] hover:text-red-500"
                      onClick={() => stepFields.length > 1 && removeStep(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 flex items-center justify-center gap-1 border-dashed border-[#58C16A]/40 text-[#58C16A] hover:bg-[#58C16A]/5"
                onClick={addStep}
              >
                <Plus size={16} />
                과정 추가
              </Button>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <ProgressButton
              progressPercentage={progressPercentage}
              isFormValid={isValid && isDirty}
              completedSteps={completedSteps}
              totalSteps={totalSteps}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewRecipePage;
