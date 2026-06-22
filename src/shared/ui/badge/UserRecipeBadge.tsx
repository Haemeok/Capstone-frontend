"use client";

import { UserRound } from "lucide-react";

import { useUiCommonDict } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

type UserRecipeBadgeProps = {
  className?: string;
};

const UserRecipeBadge = ({ className }: UserRecipeBadgeProps) => {
  const t = useUiCommonDict();
  return (
    <div
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-500",
        className
      )}
      aria-label={t.badge.userRecipe}
    >
      <UserRound className="h-4 w-4 text-white" />
    </div>
  );
};

export default UserRecipeBadge;
