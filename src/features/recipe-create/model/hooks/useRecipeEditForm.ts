import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCreateRecipeWithUpload } from "@/features/recipe-create";
import { useToastStore } from "@/widgets/Toast";
import { useRecipeDetailQuery } from "@/entities/recipe";
import { recipeFormSchema, RecipeFormValues } from "../config";

export const useRecipeEditForm = (recipeId: number) => {
  const router = useRouter();
  const { addToast } = useToastStore();
  const {
    mutate: updateRecipe,
    isUploading,
    isLoading: isCreatingRecipe,
    error: recipeCreationError,
  } = useCreateRecipeWithUpload(recipeId);

  const { recipeData: recipe } = useRecipeDetailQuery(recipeId);
  const ingredientIds = recipe.ingredients.map((ingredient) => ingredient.id);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [stepImagePreviewUrls, setStepImagePreviewUrls] = useState<
    (string | null)[]
  >([]);

  const defaultFormValues: RecipeFormValues = {
    title: recipe.title,
    imageFile: null,
    ingredients: recipe.ingredients.map((ingredient) => ({
      name: ingredient.name,
      quantity: ingredient.quantity || "",
      unit: ingredient.unit || "",
    })),
    cookingTime: recipe.cookingTime || 1,
    servings: recipe.servings || 1,
    dishType: recipe.dishType,
    imageKey: recipe.imageKey,
    description: recipe.description,
    steps: recipe.steps.map((step, index) => ({
      instruction: step.instruction,
      stepNumber: index,
      imageFile: null,
      ingredients: step.ingredients || [],
      imageKey: step.stepImageKey,
    })),
    cookingTools: recipe.cookingTools || [],
    tagNames: recipe.tagNames || [],
  };

  const methods = useForm({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  useEffect(() => {
    setImagePreviewUrl(recipe.imageUrl);
    setStepImagePreviewUrls([...recipe.steps.map((step) => step.stepImageUrl)]);
  }, [recipe]);

  useEffect(() => {
    const currentRHFImageKey = methods.watch("imageKey");
    let newImageKeyToSet = recipe.imageKey;

    if (imagePreviewUrl === null) {
      newImageKeyToSet = null;
    } else if (imagePreviewUrl !== recipe.imageUrl) {
      newImageKeyToSet = undefined;
    }

    if (currentRHFImageKey !== newImageKeyToSet) {
      methods.setValue("imageKey", newImageKeyToSet, { shouldDirty: true });
    }
  }, [imagePreviewUrl, recipe.imageKey, recipe.imageUrl, methods]);

  const watchedFormSteps = methods.watch("steps");
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
      methods.setValue("steps", newRHFStepsPayload, { shouldDirty: true });
    }
  }, [stepImagePreviewUrls, recipe.steps, methods, watchedFormSteps]);

  const onSubmit: SubmitHandler<RecipeFormValues> = (formData) => {
    updateRecipe(formData, {
      onSuccess: () => {
        addToast({
          message: "레시피가 성공적으로 수정되었습니다!",
          variant: "success",
          position: "bottom",
        });
        methods.reset();
        setImagePreviewUrl(null);
        setStepImagePreviewUrls([]);
        router.push("/search");
      },
      onError: (error) => {
        console.error("레시피 수정 실패:", error);
        addToast({
          message: `레시피 등록 중 오류가 발생했습니다: ${error.message}`,
          variant: "error",
          position: "bottom",
        });
      },
    });
  };

  const handleMainIngredientRemoved = (ingredientName: string) => {
    const currentSteps = methods.watch("steps");
    const updatedSteps = currentSteps.map((step) => {
      const newStepIngredients = (step.ingredients || []).filter(
        (ing) => ing.name !== ingredientName
      );
      return {
        ...step,
        ingredients: newStepIngredients,
      };
    });
    methods.setValue("steps", updatedSteps, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const isLoading = isUploading || isCreatingRecipe;

  return {
    methods,
    onSubmit: methods.handleSubmit(onSubmit),
    isLoading,
    recipeCreationError,

    imagePreviewUrl,
    setImagePreviewUrl,
    stepImagePreviewUrls,
    setStepImagePreviewUrls,

    handleMainIngredientRemoved,
    ingredientIds,
  };
};
