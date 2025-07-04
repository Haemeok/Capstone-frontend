import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

import { DISH_TYPES } from "@/shared/config/constants/recipe";
import { cn } from "@/shared/lib/utils";
import ProgressButton from "@/shared/ui/ProgressButton";

import { IngredientPayload } from "@/entities/ingredient";
import { useRecipeDetailQuery } from "@/entities/recipe";

import {
  RecipeFormValues,
  useCreateRecipeWithUpload,
} from "@/features/recipe-create";
import CookingToolsInput from "@/features/recipe-create/ui/CookingToolsInput";
import Description from "@/features/recipe-create/ui/Description";
import IngredientSection from "@/features/recipe-create/ui/IngredientSection";
import RecipeTitleWithImage from "@/features/recipe-create/ui/RecipeTitleWithImage";
import Steps from "@/features/recipe-create/ui/Steps";
import TagSection from "@/features/recipe-create/ui/TagSection";

import { useToastStore } from "@/widgets/Toast";

const UpdateRecipePage = () => {
  const router = useRouter();
  const { recipeId } = useParams();

  const {
    mutate: createRecipeWithUpload,
    isUploading,
    isLoading: isCreatingRecipe,
    error: recipeCreationError,
  } = useCreateRecipeWithUpload(Number(recipeId));

  const { recipeData: recipe } = useRecipeDetailQuery(Number(recipeId));
  const ingredientIds = recipe.ingredients.map((ingredient) => ingredient.id);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [stepImagePreviewUrls, setStepImagePreviewUrls] = useState<
    (string | null)[]
  >([]);

  const { addToast } = useToastStore();

  useEffect(() => {
    setImagePreviewUrl(recipe.imageUrl);
    setStepImagePreviewUrls([...recipe.steps.map((step) => step.stepImageUrl)]);
  }, [recipe]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<RecipeFormValues>({
    defaultValues: {
      title: recipe.title,
      imageFile: null,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      dishType: recipe.dishType,
      imageKey: recipe.imageKey,
      description: recipe.description,
      steps: recipe.steps,
      cookingTools: recipe.cookingTools,
      tagNames: recipe.tagNames,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const currentRHFImageKey = watch("imageKey");
    let newImageKeyToSet = recipe.imageKey;

    if (imagePreviewUrl === null) {
      newImageKeyToSet = null;
    } else if (imagePreviewUrl !== recipe.imageUrl) {
      newImageKeyToSet = undefined;
    }

    if (currentRHFImageKey !== newImageKeyToSet) {
      setValue("imageKey", newImageKeyToSet, { shouldDirty: true });
    }
  }, [imagePreviewUrl, recipe.imageKey, setValue, watch]);

  const watchedFormSteps = watch("steps");

  useEffect(() => {
    let RHF_stepsArrayChanged = false;

    const newRHFStepsPayload = watchedFormSteps.map((formStep, index) => {
      const newStepData = { ...formStep };
      const initialStepDetails = recipe.steps[index];

      const currentStepPreviewUrl = stepImagePreviewUrls[index];
      const currentFormStepKey = formStep.imageKey;

      let newStepImageKey: string | null | undefined =
        initialStepDetails?.stepImageKey ?? null;

      if (currentStepPreviewUrl === null) {
        newStepImageKey = null;
      } else if (currentStepPreviewUrl !== initialStepDetails?.stepImageUrl) {
        newStepImageKey = undefined;
      }

      if (currentFormStepKey !== newStepImageKey) {
        newStepData.imageKey = newStepImageKey;
        RHF_stepsArrayChanged = true;
      }
      return newStepData;
    });

    if (RHF_stepsArrayChanged) {
      setValue("steps", newRHFStepsPayload, { shouldDirty: true });
    }
  }, [stepImagePreviewUrls, recipe.steps, setValue, watchedFormSteps]);

  const onSubmit: SubmitHandler<RecipeFormValues> = (formData) => {
    console.log("폼 데이터:", formData);

    createRecipeWithUpload(formData, {
      onSuccess: (createdData) => {
        console.log("레시피 생성 성공:", createdData);
        addToast({
          message: "레시피가 성공적으로 수정되었습니다!",
          variant: "success",
          position: "bottom",
        });
        reset();
        setImagePreviewUrl(null);
        setStepImagePreviewUrls([]);
        router.push("/search");
      },
      onError: (error) => {
        console.error("레시피 생성 실패:", error);
        addToast({
          message: `레시피 등록 중 오류가 발생했습니다: ${error.message}`,
          variant: "error",
          position: "bottom",
        });
      },
    });
  };

  const handleMainIngredientRemoved = (ingredientName: string) => {
    const currentSteps = watch("steps");
    const updatedSteps = currentSteps.map((step) => {
      const newStepIngredients = (step.ingredients || []).filter(
        (ing) => ing.name !== ingredientName
      );
      return {
        ...step,
        ingredients: newStepIngredients,
      };
    });
    setValue("steps", updatedSteps, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const formValues = watch();

  const needSteps = [
    formValues.title.trim() !== "",
    formValues.imageFile !== null || imagePreviewUrl !== null,
    formValues.description.trim() !== "",
    formValues.dishType.trim() !== "",
    (parseInt(String(formValues.cookingTime), 10) || 0) > 0,
    (parseInt(String(formValues.servings), 10) || 0) > 0,
    formValues.ingredients.some(
      (i: IngredientPayload) =>
        i.name?.trim() !== "" && i.quantity?.toString().trim() !== ""
    ),
    formValues.steps.some((s) => s.instruction?.trim() !== ""),
  ];

  const completedSteps = needSteps.filter(Boolean).length;
  const totalSteps = needSteps.length;
  const progressPercentage =
    totalSteps > 0 ? Math.floor((completedSteps / totalSteps) * 100) : 0;

  const isLoading = isUploading || isCreatingRecipe;
  const submitError = recipeCreationError;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <form id="recipe-form" onSubmit={handleSubmit(onSubmit)}>
        <RecipeTitleWithImage
          isUpdate={true}
          imagePreviewUrl={imagePreviewUrl}
          errors={errors}
          register={register}
          watch={watch}
          currentTitle={formValues.title}
          setImagePreviewUrl={setImagePreviewUrl}
        />

        <div className="mx-auto max-w-3xl px-4 pt-6">
          <Description register={register} errors={errors} />

          <div className="flex items-center justify-center gap-x-8 gap-y-6 border-b border-gray-200">
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="dishType"
                className="text-sm font-medium text-gray-700"
              >
                카테고리
              </label>
              <select
                id="dishType"
                className={cn(
                  `w-28 rounded-lg border bg-gray-50 px-3 py-1.5 text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none`,
                  errors.dishType ? "border-red-500" : "border-gray-300"
                )}
                {...register("dishType", {
                  required: "카테고리를 선택해주세요",
                })}
                defaultValue=""
              >
                <option value="" disabled>
                  선택
                </option>
                {DISH_TYPES.map((dishType) => (
                  <option key={dishType} value={dishType}>
                    {dishType}
                  </option>
                ))}
              </select>
              {errors.dishType && (
                <p className="mt-1 text-center text-xs text-red-500">
                  {errors.dishType.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="cookingTime"
                className="text-sm font-medium text-gray-700"
              >
                조리시간 (분)
              </label>
              <input
                id="cookingTime"
                type="number"
                className={cn(
                  `w-20 rounded-lg border bg-gray-50 px-3 py-1.5 text-center text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none`,
                  errors.cookingTime ? "border-red-500" : "border-gray-300"
                )}
                placeholder="숫자"
                min="0"
                {...register("cookingTime", {
                  required: "조리 시간을 입력해주세요",
                  valueAsNumber: true,
                  min: { value: 1, message: "1분 이상 입력해주세요." },
                })}
              />
              {errors.cookingTime && (
                <p className="mt-1 text-center text-xs text-red-500">
                  {errors.cookingTime.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="servings"
                className="text-sm font-medium text-gray-700"
              >
                인분
              </label>
              <input
                id="servings"
                type="number"
                className={cn(
                  "w-20 rounded-lg border bg-gray-50 px-3 py-1.5 text-center text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                  errors.servings
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300"
                )}
                {...register("servings", {
                  required: "인분을 선택해주세요",
                  valueAsNumber: true,
                  validate: (value) =>
                    Number(value) > 0 || "1인분 이상 선택해주세요.",
                })}
                min="1"
                placeholder="숫자"
                defaultValue={1}
              />
              {errors.servings && (
                <p className="mt-1 text-center text-xs text-red-500">
                  {errors.servings.message}
                </p>
              )}
            </div>
          </div>

          <IngredientSection
            control={control}
            errors={errors}
            register={register}
            onRemoveIngredientCallback={handleMainIngredientRemoved}
            ingredientIds={ingredientIds}
          />
          <Steps
            watch={watch}
            register={register}
            errors={errors}
            setValue={setValue}
            control={control}
            stepImagePreviewUrls={stepImagePreviewUrls}
            setStepImagePreviewUrls={setStepImagePreviewUrls}
          />
          <CookingToolsInput watch={watch} setValue={setValue} />
          <TagSection
            watch={watch}
            setValue={setValue}
            tagNames={formValues.tagNames}
          />
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            {submitError && (
              <p className="text-sm text-red-600">
                오류: {submitError.message}
              </p>
            )}
            <ProgressButton
              progressPercentage={progressPercentage}
              isFormValid={isValid}
              isLoading={isLoading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateRecipePage;
