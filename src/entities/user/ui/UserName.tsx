"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

type UsernameProps = {
  username: string;
  userId: number;
  className?: string;
};

const Username = ({ username, userId, className }: UsernameProps) => {
  return (
    <Link href={`/users/${userId}`} className="min-w-0 w-full block">
      <p className={cn("text-sm font-bold text-gray-800 truncate text-left hover:underline", className)}>
        {username}
      </p>
    </Link>
  );
};

export default Username;
