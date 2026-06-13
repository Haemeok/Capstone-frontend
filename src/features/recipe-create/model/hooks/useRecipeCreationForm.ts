"use client";

import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRecipeFormDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import { useSubmitRecipe } from "@/features/recipe-create/model/hooks/useSubmitRecipe";

import { useToastStore } from "@/widgets/Toast";

import {
  buildRecipeFormSchema,
  RECIPE_FORM_DEFAULT_VALUES,
  RecipeFormValues,
} from "../config";

export const useRecipeCreationForm = () => {
  const router = useRouter();
  const { addToast } = useToastStore();
  const { submitRecipe, isPending, error } = useSubmitRecipe();
  const { validation } = useRecipeFormDict();

  const schema = useMemo(() => buildRecipeFormSchema(validation), [validation]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: RECIPE_FORM_DEFAULT_VALUES,
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<RecipeFormValues> = (formData) => {
    submitRecipe(
      { formData },
      {
        onSuccess: () => {
          triggerHaptic("Success");
          addToast({
            message: "레시피가 성공적으로 등록되었습니다!",
            variant: "success",
            position: "bottom",
          });

          router.push("/search");
          methods.reset();
        },
        onError: (error) => {
          console.error("레시피 생성 실패:", error);
          addToast({
            message: `레시피 등록 중 오류가 발생했습니다: ${error.message}`,
            variant: "error",
            position: "bottom",
          });
        },
      }
    );
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
    isLoading: isPending,
    recipeCreationError: error,

    handleMainIngredientRemoved,
  };
};
