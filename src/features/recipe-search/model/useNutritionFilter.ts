"use client";

import { useCallback, useEffect, useMemo,useState } from "react";

import { NutritionThemeKey } from "@/shared/config/constants/recipe";
import { NutritionFilterKey } from "@/shared/config/constants/recipe";
import {
  applyNutritionTheme,
  createDefaultNutritionValues,
  hasModifiedNutritionValues,
  NutritionFilterValues,
} from "@/shared/lib/nutrition/utils";

export const useNutritionFilter = (
  open: boolean,
  initialValues: NutritionFilterValues,
  initialTypes: string[]
) => {
  const [selectedTheme, setSelectedTheme] = useState<NutritionThemeKey | null>(
    null
  );
  const [types, setTypes] = useState<string[]>(initialTypes);
  const [values, setValues] = useState<NutritionFilterValues>(() => {
    const defaultValues = createDefaultNutritionValues();
    return { ...defaultValues, ...initialValues };
  });

  useEffect(() => {
    if (open) {
      const defaultValues = createDefaultNutritionValues();
      setValues({ ...defaultValues, ...initialValues });
      setTypes(initialTypes);
    }
  }, [open, initialValues, initialTypes]);

  const handleThemeSelect = useCallback(
    (themeKey: NutritionThemeKey) => {
      if (selectedTheme === themeKey) {
        setValues(createDefaultNutritionValues());
        setSelectedTheme(null);
        return;
      }

      setSelectedTheme(themeKey);
      setValues(applyNutritionTheme(themeKey));
    },
    [selectedTheme]
  );

  const handleSliderChange = useCallback(
    (key: NutritionFilterKey, newValue: [number, number]) => {
      setValues((prev) => ({
        ...prev,
        [key]: newValue,
      }));

      if (selectedTheme !== null) {
        setSelectedTheme(null);
      }
    },
    [selectedTheme]
  );

  const handleTypesChange = useCallback((newTypes: string[]) => {
    setTypes(newTypes);
  }, []);

  const reset = useCallback(() => {
    setValues(createDefaultNutritionValues());
    setSelectedTheme(null);
  }, []);

  const isModified = useMemo(
    () => hasModifiedNutritionValues(values),
    [values]
  );

  return {
    values,
    selectedTheme,
    types,
    isModified,
    handleThemeSelect,
    handleSliderChange,
    handleTypesChange,
    reset,
  };
};
