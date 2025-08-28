"use client";

import React from "react";
import { FormProgressButton } from "@/shared/ui/form/FormProgressButton";
import {
  aiRecipeFormSchema,
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
    />
  );
};

export default AIRecipeProgressButton;
