import React from "react";

import { FormProgressButton } from "@/shared/ui/form/FormProgressButton";

import { recipeFormSchema, RecipeFormValues } from "../model/config";

type RecipeProgressButtonProps = {
  isLoading: boolean;
};

const RecipeProgressButton = ({ isLoading }: RecipeProgressButtonProps) => {
  return (
    <FormProgressButton<RecipeFormValues>
      schema={recipeFormSchema}
      isLoading={isLoading}
    />
  );
};

export default RecipeProgressButton;
