"use client";

import { Pencil } from "lucide-react";

import { LocalizedLink, useUserPagesDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import { cn } from "@/lib/utils";

type UserInfoEditButtonProps = {
  className?: string;
  variant?: "icon" | "bar";
};

const UserInfoEditButton = ({
  className = "",
  variant = "icon",
}: UserInfoEditButtonProps) => {
  const t = useUserPagesDict();

  if (variant === "bar") {
    return (
      <LocalizedLink
        href="/users/edit"
        prefetch={false}
        onClick={() => triggerHaptic("Light")}
        className={cn(
          "text-ink-sub flex h-10 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold transition-colors hover:bg-gray-50",
          className
        )}
      >
        {t.profile.editAction}
      </LocalizedLink>
    );
  }

  return (
    <LocalizedLink
      href="/users/edit"
      prefetch={false}
      aria-label={t.profile.editAria}
      title={t.profile.editAria}
      onClick={() => triggerHaptic("Light")}
      className={cn(
        "text-ink-muted hover:text-ink-sub inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white transition-colors hover:bg-gray-50",
        className
      )}
    >
      <Pencil size={12} aria-hidden="true" />
    </LocalizedLink>
  );
};

export default UserInfoEditButton;
