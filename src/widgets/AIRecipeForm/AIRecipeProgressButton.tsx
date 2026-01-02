"use client";

import React from "react";

import { FormProgressButton } from "@/shared/ui/form/FormProgressButton";

import {
  aiRecipeFormSchema,
  AI_RECIPE_FIELD_LABELS,
  type AIRecipeFormValues,
} from "@/features/recipe-create-ai/model/schema";

type AIRecipeProgressButtonProps = {
  isLoading: boolean;
  onClick?: () => void;
};

const AIRecipeProgressButton = ({
  isLoading,
  onClick,
}: AIRecipeProgressButtonProps) => {
  return (
    <FormProgressButton<AIRecipeFormValues>
      schema={aiRecipeFormSchema}
      isLoading={isLoading}
      onClick={onClick}
      text="레시피 생성하기"
      fieldLabels={AI_RECIPE_FIELD_LABELS}
    />
  );
};

export default AIRecipeProgressButton;
