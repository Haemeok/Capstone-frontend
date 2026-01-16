"use client";

import { Button } from "@/shared/ui/shadcn/button";

type NutritionFilterActionsProps = {
  onReset: () => void;
  onApply: () => void;
  isResetDisabled: boolean;
  isMobile?: boolean;
};

export const NutritionFilterActions = ({
  onReset,
  onApply,
  isResetDisabled,
  isMobile = false,
}: NutritionFilterActionsProps) => {
  if (isMobile) {
    return (
      <div className="mt-4 flex gap-2 border-t pt-4">
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isResetDisabled}
          className="flex-1 rounded-md border-gray-300"
        >
          초기화
        </Button>
        <Button
          onClick={onApply}
          className="bg-olive-light flex-1 rounded-md text-white"
        >
          완료
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 border-t pt-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onReset}
        disabled={isResetDisabled}
        className="flex-1 cursor-pointer"
      >
        초기화
      </Button>
      <Button
        size="sm"
        onClick={onApply}
        className="bg-olive-light hover:bg-olive-light/90 flex-1 cursor-pointer text-white"
      >
        완료
      </Button>
    </div>
  );
};
