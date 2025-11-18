"use client";

import React, { useEffect, useState } from "react";

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { Button } from "@/shared/ui/shadcn/button";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";
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

type CategoryPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMultiple: boolean;
  setValue: (value: string[] | string) => void;
  initialValue: string[] | string;
  availableValues: string[];
  header: string;
  description?: string;
  triggerButton?: React.ReactNode;
};

const CategoryPicker = ({
  open,
  onOpenChange,
  isMultiple,
  setValue,
  header,
  description,
  initialValue,
  availableValues,
  triggerButton,
}: CategoryPickerProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [internalSelection, setInternalSelection] = useState<string[] | string>(
    initialValue
  );

  useEffect(() => {
    if (open) {
      setInternalSelection(initialValue);
    }
  }, [open, initialValue]);

  const handleCheckboxChange = (value: string) => {
    setInternalSelection((prevSelection) => {
      const currentSelection = Array.isArray(prevSelection)
        ? prevSelection
        : [];
      if (currentSelection.includes(value)) {
        return currentSelection.filter((item) => item !== value);
      } else {
        return [...currentSelection, value];
      }
    });
  };

  const handleRadioChange = (value: string) => {
    setInternalSelection(value);
  };

  const handleReset = () => {
    setInternalSelection(isMultiple ? [] : "");
  };

  const handleApply = () => {
    setValue(internalSelection);
    onOpenChange(false);
  };

  const SelectionContent = () => (
    <div className="space-y-3">
      {isMultiple ? (
        availableValues.map((value) => (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              id={`checkbox-${value}`}
              checked={(internalSelection as string[]).includes(value)}
              onCheckedChange={() => handleCheckboxChange(value)}
              className="data-[state=checked]:bg-dark-light data-[state=checked]:border-dark-light h-5 w-5 cursor-pointer rounded border-gray-300 data-[state=checked]:text-white"
            />
            <Label
              htmlFor={`checkbox-${value}`}
              className="cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {value}
            </Label>
          </div>
        ))
      ) : (
        <RadioGroup
          value={internalSelection as string}
          onValueChange={handleRadioChange}
          className="space-y-3"
        >
          {availableValues.map((value) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={value}
                id={`radio-${value}`}
                className="text-dark-light focus:ring-dark-light h-5 w-5 cursor-pointer border-gray-300"
              />
              <Label
                htmlFor={`radio-${value}`}
                className="cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {value}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
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
        <div></div>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-medium">{header}</h4>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            <SelectionContent />
          </div>

          <div className="flex gap-2 border-t pt-2">
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
              className="bg-olive-light hover:bg-olive-light/90 flex-1 text-white"
            >
              완료
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryPicker;
