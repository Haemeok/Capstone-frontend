"use client";

import { useState } from "react";
import { LockKeyhole, LockOpen } from "lucide-react";

import ToggleIconButton from "@/shared/ui/ToggleIconButton";

import useRecipeVisibilityMutation from "../model/useRecipeVisibilityMutation";

type LockButtonProps = {
  recipeId: string;
  initialIsLocked: boolean;
};

const LockButton = ({ recipeId, initialIsLocked }: LockButtonProps) => {
  const [isLocked, setIsLocked] = useState(initialIsLocked);
  const { mutate: toggleVisibility } = useRecipeVisibilityMutation(recipeId);

  const handleToggle = () => {
    setIsLocked((prev) => !prev);
    toggleVisibility();
  };

  return (
    <div className="flex flex-col items-center">
      <ToggleIconButton
        isActive={isLocked}
        onToggle={handleToggle}
        size="default"
        icon={
          <LockOpen
            width={24}
            height={24}
            className="transition-all duration-300"
          />
        }
        activeIcon={<LockKeyhole className="transition-all duration-300" />}
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
      />
      <p className="mt-1 text-sm font-bold">
        {isLocked ? "비공개" : "공개"}
      </p>
    </div>
  );
};

export default LockButton;
