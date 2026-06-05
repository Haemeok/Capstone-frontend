"use client";

import { useState } from "react";

import { COUNTRY_DEFINITIONS } from "@/shared/config/constants/recipe";
import FilterChip from "@/shared/ui/FilterChip";

import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";

import { useCountryFilter } from "../model";

const COUNTRY_LABELS = COUNTRY_DEFINITIONS.map((def) => def.label);

export const CountryFilter = () => {
  const [countries, setCountries] = useCountryFilter();
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (value: string | string[]) => {
    setCountries(value as string[]); // CategoryPicker setValue gives string | string[]
  };

  return (
    <CategoryPicker
      trigger={
        <FilterChip
          header={countries.length > 0 ? countries.join(", ") : "국가"}
          isDirty={countries.length > 0}
        />
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      isMultiple={true}
      setValue={handleValueChange}
      initialValue={countries}
      availableValues={COUNTRY_LABELS}
      header="국가"
      description="유튜브 채널 국가로 거르기"
    />
  );
};
