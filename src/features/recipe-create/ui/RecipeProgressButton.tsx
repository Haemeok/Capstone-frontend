import React from "react";

import { FormProgressButton } from "@/shared/ui/form/FormProgressButton";

import { recipeFormSchema, RecipeFormValues } from "../model/config";

type RecipeProgressButtonProps = {
  isLoading: boolean;
  isEdit: boolean;
};

const RecipeProgressButton = ({
  isLoading,
  isEdit,
}: RecipeProgressButtonProps) => {
  return (
    <FormProgressButton<RecipeFormValues>
      schema={recipeFormSchema}
      isLoading={isLoading}
      text={isEdit ? "레시피 수정하기" : "레시피 등록하기"}
    />
  );
};

export default RecipeProgressButton;
