import {
  DISH_TYPE_ICONS,
  ICON_BASE_URL,
} from "@/shared/config/constants/recipe";
import type { TaxonomyDomain } from "@/shared/i18n/taxonomyLabel";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { localizeOptionValue } from "./localizeOptionValue";

type DishTypeGridProps = {
  values: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
  domain?: TaxonomyDomain;
};

const DishTypeGrid = ({
  values,
  selected,
  onSelect,
  domain,
}: DishTypeGridProps) => {
  const { localize } = useTaxonomy();

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {values.map((value) => {
        const isSelected = selected === value;
        const displayValue = domain
          ? localizeOptionValue(value, domain, localize)
          : value;
        const handleClick = () => {
          if (!isSelected) triggerHaptic("Light");
          onSelect(value);
        };

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={handleClick}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 transition-all",
              isSelected
                ? "border-olive-light bg-olive-light/10"
                : "border-transparent bg-gray-50 hover:border-gray-300"
            )}
          >
            {DISH_TYPE_ICONS[value] && (
              <Image
                src={`${ICON_BASE_URL}${DISH_TYPE_ICONS[value]}`}
                alt=""
                wrapperClassName="h-9 w-9"
              />
            )}
            <span
              className={cn(
                "text-center text-xs leading-tight font-medium",
                isSelected ? "text-olive" : "text-ink-sub"
              )}
            >
              {displayValue}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DishTypeGrid;
