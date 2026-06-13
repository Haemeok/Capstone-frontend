"use client";

import React, { useMemo } from "react";

import { useRecipeFormDict } from "@/shared/i18n";
import { FormProgressButton } from "@/shared/ui/form/FormProgressButton";

import { buildRecipeFormSchema, RecipeFormValues } from "../model/config";

type RecipeProgressButtonProps = {
  isLoading: boolean;
  isEdit: boolean;
};

const RecipeProgressButton = ({
  isLoading,
  isEdit,
}: RecipeProgressButtonProps) => {
  const { labels, validation, ui } = useRecipeFormDict();

  const schema = useMemo(() => buildRecipeFormSchema(validation), [validation]);

  return (
    <FormProgressButton<RecipeFormValues>
      schema={schema}
      isLoading={isLoading}
      text={isEdit ? ui.submitEdit : ui.submitCreate}
      fieldLabels={labels}
    />
  );
};

export default RecipeProgressButton;
