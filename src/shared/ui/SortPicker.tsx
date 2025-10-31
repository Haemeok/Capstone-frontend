"use client";

import React, { useEffect, useState } from "react";

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { Button } from "@/shared/ui/shadcn/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
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
  const [internalSelection, setInternalSelection] =
    useState<string>(currentSort);

  useEffect(() => {
    if (open) {
      setInternalSelection(currentSort);
    }
  }, [open, currentSort]);

  const handleRadioChange = (value: string) => {
    setInternalSelection(value);
  };

  const handleReset = () => {
    setInternalSelection("최신순");
  };

  const handleApply = () => {
    onSortChange(internalSelection);
    onOpenChange(false);
  };

  const SelectionContent = () => (
    <RadioGroup
      value={internalSelection}
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
          <div className="flex-1 overflow-y-auto p-4">
            <SelectionContent />
          </div>

          <DrawerFooter className="mt-auto flex-row gap-2 border-t border-gray-200 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 rounded-md border-gray-300"
            >
              초기화
            </Button>
            <DrawerClose asChild>
              <Button
                onClick={handleApply}
                className="bg-olive-light flex-1 rounded-md text-white"
              >
                완료
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div className=""></div>
      </PopoverTrigger>

      <PopoverContent className="w-64" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-base">{header}</h4>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>

          <SelectionContent />

          <div className="flex gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              초기화
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="bg-olive-light flex-1 text-white hover:bg-olive-light/90"
            >
              완료
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortPicker;
