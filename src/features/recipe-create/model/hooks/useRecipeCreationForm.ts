import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCreateRecipeWithUpload } from "@/features/recipe-create";
import { useToastStore } from "@/widgets/Toast";
import {
  recipeFormSchema,
  RecipeFormValues,
  RECIPE_FORM_DEFAULT_VALUES,
  IngredientPayload,
} from "../config";

export const useRecipeCreationForm = () => {
  const router = useRouter();
  const { addToast } = useToastStore();
  const {
    mutate: createRecipe,
    isLoading,
    error: recipeCreationError,
  } = useCreateRecipeWithUpload();

  const methods = useForm({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: RECIPE_FORM_DEFAULT_VALUES,
    mode: "onChange",
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [stepImagePreviewUrls, setStepImagePreviewUrls] = useState<
    (string | null)[]
  >([]);

  const onSubmit: SubmitHandler<RecipeFormValues> = (formData) => {
    createRecipe(formData, {
      onSuccess: () => {
        addToast({
          message: "레시피가 성공적으로 등록되었습니다!",
          variant: "success",
          position: "bottom",
        });

        router.push("/search");
        methods.reset();

        setImagePreviewUrl(null);
        setStepImagePreviewUrls([]);
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
  };
};
