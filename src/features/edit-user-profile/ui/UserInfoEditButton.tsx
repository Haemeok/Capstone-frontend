"use client";

import Link from "next/link";

import { Pencil } from "lucide-react";

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
  if (variant === "bar") {
    return (
      <Link
        href="/users/edit"
        prefetch={false}
        onClick={() => triggerHaptic("Light")}
        className={cn(
          "flex h-10 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50",
          className
        )}
      >
        프로필 수정
      </Link>
    );
  }

  return (
    <Link
      href="/users/edit"
      prefetch={false}
      aria-label="프로필 편집"
      title="프로필 편집"
      onClick={() => triggerHaptic("Light")}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700",
        className
      )}
    >
      <Pencil size={12} aria-hidden="true" />
    </Link>
  );
};

export default UserInfoEditButton;
