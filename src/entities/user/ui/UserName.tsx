"use client";

import { LocalizedLink } from "@/shared/i18n";

import { cn } from "@/lib/utils";

type UsernameProps = {
  username: string;
  userId: string;
  className?: string;
};

const Username = ({ username, userId, className }: UsernameProps) => {
  return (
    <LocalizedLink
      href={`/users/${userId}`}
      className="block w-fit max-w-full min-w-0"
    >
      <p
        className={cn(
          "text-ink truncate text-left text-sm font-bold hover:underline",
          className
        )}
      >
        {username}
      </p>
    </LocalizedLink>
  );
};

export default Username;
