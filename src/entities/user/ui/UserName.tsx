"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

type UsernameProps = {
  username: string;
  userId: string;
  className?: string;
};

const Username = ({ username, userId, className }: UsernameProps) => {
  return (
    <Link href={`/users/${userId}`} className="block w-full min-w-0">
      <p
        className={cn(
          "truncate text-left text-sm font-bold text-gray-800 hover:underline",
          className
        )}
      >
        {username}
      </p>
    </Link>
  );
};

export default Username;
