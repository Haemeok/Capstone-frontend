"use client";

import React, { useState } from "react";

import { useCommonDict } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
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
import { RadioGroup, RadioGroupItem } from "@/shared/ui/shadcn/radio-group";

type RecipeSortDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSort: string;
  availableSorts: readonly string[];
  onSortChange: (sort: string) => void;
  header?: string;
  description?: string;
};

const RecipeSortDrawer = ({
  open,
  onOpenChange,
  currentSort,
  availableSorts,
  onSortChange,
  header,
  description,
}: RecipeSortDrawerProps) => {
  const t = useCommonDict();
  const { localize } = useTaxonomy();
  const resolvedHeader = header ?? t.sort.title;
  const [internalSelection, setInternalSelection] =
    useState<string>(currentSort);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setInternalSelection(currentSort);
    onOpenChange(nextOpen);
  };

  const handleRadioChange = (value: string) => {
    setInternalSelection(value);
  };

  const handleReset = () => {
    setInternalSelection("최신순");
  };

  const handleApply = () => {
    onSortChange(internalSelection);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="flex w-full flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl font-bold">
            {resolvedHeader}
          </DrawerTitle>
          {description && (
            <DrawerDescription className="text-md text-ink-muted">
              {description}
            </DrawerDescription>
          )}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4">
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
                  className="text-ink-sub focus:ring-dark-light h-5 w-5 border-gray-300"
                />
                <Label
                  htmlFor={`radio-${sortOption}`}
                  className="cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {localize(sortOption, "recipeSort")}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DrawerFooter className="mt-auto flex-row gap-2 border-t border-gray-200 pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 rounded-md border-gray-300"
          >
            {t.sort.reset}
          </Button>
          <DrawerClose asChild>
            <Button
              onClick={handleApply}
              className="bg-olive-light flex-1 rounded-md text-white"
            >
              {t.sort.apply}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RecipeSortDrawer;
