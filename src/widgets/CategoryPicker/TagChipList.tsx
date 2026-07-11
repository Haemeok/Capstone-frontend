import type { TaxonomyDomain } from "@/shared/i18n/taxonomyLabel";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { localizeOptionValue } from "./localizeOptionValue";

type TagChipListProps = {
  values: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  domain?: TaxonomyDomain;
};

const TagChipList = ({
  values,
  selected,
  onToggle,
  domain,
}: TagChipListProps) => {
  const { localize } = useTaxonomy();

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => {
        const isSelected = selected.includes(value);
        const displayValue = domain
          ? localizeOptionValue(value, domain, localize)
          : value;
        const handleClick = () => {
          triggerHaptic("Light");
          onToggle(value);
        };

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={handleClick}
            className={cn(
              "cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              isSelected
                ? "border-olive-light bg-olive-light/10 text-olive"
                : "text-ink-sub border-gray-200 bg-white hover:bg-gray-50"
            )}
          >
            {displayValue}
          </button>
        );
      })}
    </div>
  );
};

export default TagChipList;
