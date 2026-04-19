"use client";

import Link from "next/link";

import { Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/shared/lib/bridge";

type UserInfoEditButtonProps = {
  className?: string;
};

const UserInfoEditButton = ({ className = "" }: UserInfoEditButtonProps) => {
  return (
    <Link
      href="/users/edit"
      prefetch={false}
      aria-label="프로필 편집"
      title="프로필 편집"
      onClick={() => triggerHaptic("Light")}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors",
        className
      )}
    >
      <Pencil size={12} aria-hidden="true" />
    </Link>
  );
};

export default UserInfoEditButton;
