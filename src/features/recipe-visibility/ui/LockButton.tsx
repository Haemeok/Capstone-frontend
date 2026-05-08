"use client";

import { LockKeyhole, LockOpen } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import ToggleIconButton from "@/shared/ui/ToggleIconButton";

import type { Visibility } from "@/entities/recipe/model/types";

import useRecipeVisibilityMutation from "../model/useRecipeVisibilityMutation";

type LockButtonProps = {
  recipeId: string;
  visibility: Visibility;
  onToggleSuccess?: (next: Visibility) => void;
};

const LockButton = ({
  recipeId,
  visibility,
  onToggleSuccess,
}: LockButtonProps) => {
  const isPrivate = visibility === "PRIVATE";
  const { mutate, isPending } = useRecipeVisibilityMutation(recipeId, {
    onSuccess: onToggleSuccess,
  });

  const handleToggle = () => {
    if (isPending) return;
    triggerHaptic("Light");
    mutate(isPrivate ? "PUBLIC" : "PRIVATE");
  };

  return (
    <div className="flex flex-col items-center">
      <ToggleIconButton
        isActive={isPrivate}
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
        {isPrivate ? "비공개" : "공개"}
      </p>
    </div>
  );
};

export default LockButton;
