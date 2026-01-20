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

    return (
      <div className="flex items-center space-x-2">
        {isMultiple ? (
          <>
            <Checkbox
              id={`checkbox-${value}`}
              checked={isSelected}
              onCheckedChange={handleChange}
              className="data-[state=checked]:bg-dark-light data-[state=checked]:border-dark-light h-5 w-5 cursor-pointer rounded border-gray-300 data-[state=checked]:text-white"
            />
            <Label
              htmlFor={`checkbox-${value}`}
              className="flex cursor-pointer items-center gap-1 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {DISH_TYPE_ICONS[value] && (
                <Image
                  src={`${ICON_BASE_URL}${DISH_TYPE_ICONS[value]}`}
                  alt={value}
                  wrapperClassName="w-8 h-8"
                  lazy={false}
                />
              )}
              {value}
            </Label>
          </>
        ) : (
          <>
            <RadioGroupItem
              value={value}
              id={`radio-${value}`}
              className="text-dark-light focus:ring-dark-light h-5 w-5 cursor-pointer border-gray-300"
            />
            <Label
              htmlFor={`radio-${value}`}
              className="flex cursor-pointer items-center gap-1 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {DISH_TYPE_ICONS[value] && (
                <Image
                  src={`${ICON_BASE_URL}${DISH_TYPE_ICONS[value]}`}
                  alt={value}
                  wrapperClassName="w-8 h-8"
                  lazy={false}
                />
              )}
              {value}
            </Label>
          </>
        )}
      </div>
    );
  }
);

CategoryItem.displayName = "CategoryItem";

export default CategoryItem;
