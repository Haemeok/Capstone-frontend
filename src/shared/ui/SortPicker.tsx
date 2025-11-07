"use client";

import React from "react";

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";
import { Label } from "@/shared/ui/shadcn/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/shadcn/popover";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/shadcn/radio-group";

type SortPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSort: string;
  availableSorts: readonly string[];
  onSortChange: (sort: string) => void;
  header?: string;
  description?: string;
  triggerButton?: React.ReactNode;
};

const SortPicker = ({
  open,
  onOpenChange,
  currentSort,
  availableSorts,
  onSortChange,
  header = "정렬 방식 선택",
  description,
  triggerButton,
}: SortPickerProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleRadioChange = (value: string) => {
    onSortChange(value);
    onOpenChange(false);
  };

  const SelectionContent = () => (
    <RadioGroup
      value={currentSort}
      onValueChange={handleRadioChange}
      className="space-y-3"
    >
      {availableSorts.map((sortOption) => (
        <div key={sortOption} className="flex items-center space-x-2">
          <RadioGroupItem
            value={sortOption}
            id={`radio-${sortOption}`}
            className="text-dark-light focus:ring-dark-light h-5 w-5 border-gray-300"
          />
          <Label
            htmlFor={`radio-${sortOption}`}
            className="cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {sortOption}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="flex w-full flex-col sm:max-w-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl font-bold">{header}</DrawerTitle>
            {description && (
              <DrawerDescription className="text-md text-gray-500">
                {description}
              </DrawerDescription>
            )}
          </DrawerHeader>
          <div className="p-4 pb-6">
            <SelectionContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div className=""></div>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-4" align="end" sideOffset={20}>
        <SelectionContent />
      </PopoverContent>
    </Popover>
  );
};

export default SortPicker;
