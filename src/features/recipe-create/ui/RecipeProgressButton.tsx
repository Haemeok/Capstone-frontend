import ProgressButton from "@/shared/ui/ProgressButton";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { recipeFormSchema, RecipeFormValues } from "../model/config";

type RecipeProgressButtonProps = {
  isLoading: boolean;
};

const RecipeProgressButton = ({ isLoading }: RecipeProgressButtonProps) => {
  const { control, formState } = useFormContext<RecipeFormValues>();
  const { isValid, isDirty } = formState;
  const formValues = useWatch({ control });

  const fieldsSchema = recipeFormSchema.shape;

  const needSteps = [
    fieldsSchema.title.safeParse(formValues.title).success,
    fieldsSchema.imageFile.safeParse(formValues.imageFile).success,
    fieldsSchema.description.safeParse(formValues.description).success,
    fieldsSchema.dishType.safeParse(formValues.dishType).success,
    fieldsSchema.cookingTime.safeParse(formValues.cookingTime).success,
    fieldsSchema.servings.safeParse(formValues.servings).success,
    fieldsSchema.ingredients.safeParse(formValues.ingredients).success,
  ];

  const completedSteps = needSteps.filter(Boolean).length;
  const totalSteps = needSteps.length;
  const progressPercentage =
    totalSteps > 0 ? Math.floor((completedSteps / totalSteps) * 100) : 0;

  console.log(formValues, formState);
  return (
    <ProgressButton
      progressPercentage={progressPercentage}
      isFormValid={isValid && isDirty}
      isLoading={isLoading}
    />
  );
};

export default RecipeProgressButton;
