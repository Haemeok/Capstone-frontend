"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { NutritionFilterKey } from "@/shared/config/constants/recipe";
import { NutritionThemeKey } from "@/shared/config/constants/recipe";
import {
  applyNutritionTheme,
  createDefaultNutritionValues,
  deriveThemeFromValues,
  hasModifiedNutritionValues,
  NutritionFilterValues,
} from "@/shared/lib/nutrition/utils";

export const useNutritionFilter = (
  open: boolean,
  initialValues: NutritionFilterValues,
  initialTypes: string[],
  initialCountries: string[] = []
) => {
  const [types, setTypes] = useState<string[]>(initialTypes);
  const [countries, setCountries] = useState<string[]>(initialCountries);
  const [values, setValues] = useState<NutritionFilterValues>(() => {
    const defaultValues = createDefaultNutritionValues();
    return { ...defaultValues, ...initialValues };
  });

  useEffect(() => {
    if (open) {
      const defaultValues = createDefaultNutritionValues();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset draft to URL state when the sheet opens (#124)
      setValues({ ...defaultValues, ...initialValues });
      setTypes(initialTypes);
      setCountries(initialCountries);
    }
  }, [open, initialValues, initialTypes, initialCountries]);

  const selectedTheme = useMemo<NutritionThemeKey | null>(
    () => deriveThemeFromValues(values),
    [values]
  );

  const handleThemeSelect = useCallback(
    (themeKey: NutritionThemeKey) => {
      if (selectedTheme === themeKey) {
        setValues(createDefaultNutritionValues());
        return;
      }
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
    },
    []
  );

  const handleTypesChange = useCallback((newTypes: string[]) => {
    setTypes(newTypes);
    if (!newTypes.includes("YOUTUBE")) {
      setCountries([]);
    }
  }, []);

  const handleCountriesChange = useCallback((newCountries: string[]) => {
    setCountries(newCountries);
  }, []);

  const reset = useCallback(() => {
    setValues(createDefaultNutritionValues());
  }, []);

  const isModified = useMemo(
    () => hasModifiedNutritionValues(values),
    [values]
  );

  return {
    values,
    selectedTheme,
    types,
    countries,
    isModified,
    handleThemeSelect,
    handleSliderChange,
    handleTypesChange,
    handleCountriesChange,
    reset,
  };
};
