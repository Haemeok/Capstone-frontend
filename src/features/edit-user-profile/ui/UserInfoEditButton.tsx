"use client";

import Link from "next/link";

import { Edit } from "lucide-react";

import { cn } from "@/lib/utils";

type UserInfoEditButtonProps = {
  className?: string;
};

const UserInfoEditButton = ({ className = "" }: UserInfoEditButtonProps) => {
  return (
    <Link
      href="/users/edit"
      prefetch={false}
      className={cn(
        "bg-olive-light absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-md",
        className
      )}
    >
      <Edit size={14} className="text-white" />
    </Link>
  );
};

export default UserInfoEditButton;
