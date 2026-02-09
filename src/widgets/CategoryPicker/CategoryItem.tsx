import React from "react";

import {
  DISH_TYPE_ICONS,
  ICON_BASE_URL,
} from "@/shared/config/constants/recipe";
import { Image } from "@/shared/ui/image/Image";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";
import { Label } from "@/shared/ui/shadcn/label";
import { RadioGroupItem } from "@/shared/ui/shadcn/radio-group";

type CategoryItemProps = {
  value: string;
  isSelected: boolean;
  onToggle: (value: string) => void;
  isMultiple: boolean;
};

const CategoryItem = React.memo(
  ({ value, isSelected, onToggle, isMultiple }: CategoryItemProps) => {
    const handleChange = () => onToggle(value);

    const labelContent = (
      <>
        {DISH_TYPE_ICONS[value] && (
          <Image
            src={`${ICON_BASE_URL}${DISH_TYPE_ICONS[value]}`}
            alt={value}
            wrapperClassName="w-8 h-8"
            lazy={false}
          />
        )}
        <span>{value}</span>
      </>
    );

    if (isMultiple) {
      return (
        <Label
          htmlFor={`checkbox-${value}`}
          className="-mx-2 flex min-h-[44px] cursor-pointer select-none items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors active:bg-gray-100"
        >
          <Checkbox
            id={`checkbox-${value}`}
            checked={isSelected}
            onCheckedChange={handleChange}
            className="data-[state=checked]:bg-dark-light data-[state=checked]:border-dark-light h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 data-[state=checked]:text-white"
          />
          {labelContent}
        </Label>
      );
    }

    return (
      <Label
        htmlFor={`radio-${value}`}
        className="-mx-2 flex min-h-[44px] cursor-pointer select-none items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors active:bg-gray-100"
      >
        <RadioGroupItem
          value={value}
          id={`radio-${value}`}
          className="text-dark-light focus:ring-dark-light h-5 w-5 shrink-0 cursor-pointer border-gray-300"
        />
        {labelContent}
      </Label>
    );
  }
);

CategoryItem.displayName = "CategoryItem";

export default CategoryItem;
