"use client";

import { COUNTRY_DEFINITIONS } from "@/shared/config/constants/recipe";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { cn } from "@/shared/lib/utils";

import { CountryFlagGlyph } from "@/entities/recipe";

type CountryFilterSectionProps = {
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
};

export const CountryFilterSection = ({
  selectedCountries,
  onCountriesChange,
}: CountryFilterSectionProps) => {
  const { dict, localize } = useTaxonomy();

  const handleToggle = (label: string) => {
    const next = selectedCountries.includes(label)
      ? selectedCountries.filter((country) => country !== label)
      : [...selectedCountries, label];
    onCountriesChange(next);
  };

  return (
    <div className="space-y-3">
      <h5 className="text-ink-sub text-sm font-semibold">
        {dict.filters.countrySection}
      </h5>
      <div className="flex flex-wrap gap-2">
        {COUNTRY_DEFINITIONS.map(({ code, label }) => {
          const isSelected = selectedCountries.includes(label);

          return (
            <button
              key={code}
              type="button"
              onClick={() => handleToggle(label)}
              aria-pressed={isSelected}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all",
                isSelected
                  ? "border-olive-light bg-olive-light/10 text-olive-dark"
                  : "text-ink-sub border-transparent bg-gray-50 hover:border-gray-300"
              )}
            >
              <CountryFlagGlyph tag={code} />
              <span>{localize(label, "country")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
