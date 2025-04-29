import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { DrawerContent } from '@/components/ui/drawer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React, { useEffect, useState } from 'react';

type CategoryDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMultiple: boolean;
  setValue: (value: string[] | string) => void;
  initialValue: string[] | string; // 외부에서 관리하는 현재 값
  availableValues: string[];
  header: string;
  description: string;
};

const CategoryDrawer = ({
  open,
  onOpenChange,
  isMultiple,
  setValue,
  header,
  description,
  initialValue,
  availableValues,
}: CategoryDrawerProps) => {
  const [internalSelection, setInternalSelection] = useState<string[] | string>(
    initialValue,
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
    setInternalSelection(isMultiple ? [] : '');
  };

  const handleApply = () => {
    setValue(internalSelection);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex w-full flex-col sm:max-w-lg">
        <DrawerHeader className="text-left">
          {' '}
          {/* text-left 추가 */}
          <DrawerTitle className="text-xl font-semibold">
            {' '}
            {/* font-semibold 추가 */}
            {header}
          </DrawerTitle>
          {description && (
            <DrawerDescription className="text-md text-gray-500">
              {' '}
              {/* 스타일 추가 */}
              {description}
            </DrawerDescription>
          )}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {isMultiple ? (
            <div className="space-y-3">
              {availableValues.map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`checkbox-${value}`}
                    checked={(internalSelection as string[]).includes(value)}
                    onCheckedChange={() => handleCheckboxChange(value)}
                    className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white" // 스타일 조정
                  />
                  <Label
                    htmlFor={`checkbox-${value}`}
                    className="cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" // Label 스타일 추가
                  >
                    {value}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup
              value={internalSelection as string}
              onValueChange={handleRadioChange}
              className="space-y-3" // 항목 간 간격
            >
              {availableValues.map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={value}
                    id={`radio-${value}`}
                    className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500" // 스타일 조정
                  />
                  <Label
                    htmlFor={`radio-${value}`}
                    className="cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" // Label 스타일 추가
                  >
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        {/* Footer 영역 */}
        <DrawerFooter className="mt-auto flex-row gap-2 border-t border-gray-200 pt-4">
          {' '}
          {/* border 및 padding 추가, 가로 배치 */}
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 rounded-md border-gray-300" // 스타일 조정
          >
            초기화
          </Button>
          <DrawerClose asChild>
            <Button
              onClick={handleApply}
              className="flex-1 rounded-md bg-orange-500 text-white hover:bg-orange-600" // 스타일 조정
            >
              완료
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
