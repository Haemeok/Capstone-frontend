"use client";

import React, { useMemo } from "react";

import { useRecipeFormDict } from "@/shared/i18n";
import { FormProgressButton } from "@/shared/ui/form/FormProgressButton";

import { buildRecipeFormSchema, RecipeFormValues } from "../model/config";

export type RecipeFormMode = "create" | "edit" | "remix";

type RecipeProgressButtonProps = {
  isLoading: boolean;
  mode: RecipeFormMode;
};

const RecipeProgressButton = ({
  isLoading,
  mode,
}: RecipeProgressButtonProps) => {
  const { labels, validation, ui } = useRecipeFormDict();

  const schema = useMemo(() => buildRecipeFormSchema(validation), [validation]);

  const text =
    mode === "edit"
      ? ui.submitEdit
      : mode === "remix"
        ? ui.submitRemix
        : ui.submitCreate;

  return (
    <FormProgressButton<RecipeFormValues>
      schema={schema}
      isLoading={isLoading}
      text={text}
      fieldLabels={labels}
      missingPrefix={ui.missingFieldsPrefix}
    />
  );
};

export default RecipeProgressButton;
