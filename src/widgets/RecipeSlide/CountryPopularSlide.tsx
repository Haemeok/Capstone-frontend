"use client";

import { format } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { createRecipeSlide } from "./createRecipeSlide";
import { useCountryPopularQuery } from "./hooks";

const CountryPopularSlide = createRecipeSlide<{ locale?: "ko" | "ja" | "en" }>(
  ({ inView, props }) => {
    const t = useSearchDiscoveryDict();
    const { data, isLoading, error } = useCountryPopularQuery({
      enabled: inView,
      locale: props.locale,
    });
    const countryCode = data?.countryCode ?? null;
    return {
      title: format(t.countryPopularTitle, {
        country: countryCode ? t.countryPopularNames[countryCode] : "",
      }),
      items: data?.content ?? [],
      isLoading,
      error,
      requiresMeta: true,
      metaName: countryCode,
    };
  }
);

export default CountryPopularSlide;
