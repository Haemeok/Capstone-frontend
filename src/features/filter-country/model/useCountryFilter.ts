"use client";

import { COUNTRY_DEFINITIONS } from "@/shared/config/constants/recipe";
import { countryCodec, useFilterParam } from "@/shared/lib/filters";

import type { CreatorCountryTag } from "@/entities/recipe";

type CountryCode = (typeof COUNTRY_DEFINITIONS)[number]["code"];

export const useCountryFilter = () => {
  return useFilterParam("creatorCountryTags", countryCodec);
};

export const useCountryCodes = (): CreatorCountryTag[] => {
  const [labels] = useCountryFilter();
  return labels
    .map(
      (label) => COUNTRY_DEFINITIONS.find((def) => def.label === label)?.code
    )
    .filter((code): code is CountryCode => code !== undefined);
};
