"use client";

import { LockKeyhole, LockOpen } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import useRecipeVisibilityMutation from "../model/useRecipeVisibilityMutation";

type VisibilityRowActionProps = {
  recipeId: string;
  isPrivate: boolean;
  variant: "mobile" | "desktop";
  onAfterToggle?: () => void;
};

const VisibilityRowAction = ({
  recipeId,
  isPrivate,
  variant,
  onAfterToggle,
}: VisibilityRowActionProps) => {
  const { mutate: toggleVisibility, isPending } = useRecipeVisibilityMutation(
    recipeId,
  );

  const isMobile = variant === "mobile";

  const handleToggle = () => {
    if (isPending) return;
    triggerHaptic("Light");
    toggleVisibility(isPrivate ? "PUBLIC" : "PRIVATE");
    onAfterToggle?.();
  };

  return (
    <button
      type="button"
      disabled={isPending}
      className={
        isMobile
          ? "flex w-full cursor-pointer justify-between disabled:opacity-50"
          : "flex w-full cursor-pointer justify-center gap-2 px-6 py-4 transition-colors hover:bg-gray-50 disabled:opacity-50"
      }
      onClick={handleToggle}
    >
      {!isMobile &&
        (isPrivate ? <LockOpen size={20} /> : <LockKeyhole size={20} />)}
      <p>{isPrivate ? "공개로 전환" : "비공개로 전환"}</p>
      {isMobile &&
        (isPrivate ? <LockOpen size={20} /> : <LockKeyhole size={20} />)}
    </button>
  );
};

export default VisibilityRowAction;
