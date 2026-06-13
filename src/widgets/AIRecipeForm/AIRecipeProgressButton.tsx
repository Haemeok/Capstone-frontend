"use client";

import React from "react";

import { useT } from "@/shared/i18n";
import { FormProgressButton } from "@/shared/ui/form/FormProgressButton";

import {
  AI_RECIPE_FIELD_LABELS,
  aiRecipeFormSchema,
  type AIRecipeFormValues,
} from "@/features/recipe-create-ai/model/schema";

type AIRecipeProgressButtonProps = {
  isLoading: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const AIRecipeProgressButton = ({
  isLoading,
  disabled,
  onClick,
}: AIRecipeProgressButtonProps) => {
  const t = useT();
  return (
    <FormProgressButton<AIRecipeFormValues>
      schema={aiRecipeFormSchema}
      isLoading={isLoading}
      disabled={disabled}
      onClick={onClick}
      text={t.aiRecipe.form.progressButton.label}
      fieldLabels={AI_RECIPE_FIELD_LABELS}
    />
  );
};

export default AIRecipeProgressButton;
