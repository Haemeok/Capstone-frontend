"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

type UsernameProps = {
  username: string;
  userId: number;
  className?: string;
};

const Username = ({ username, userId, className }: UsernameProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/users/${userId}`);
  };
  return (
    <button onClick={handleClick} className="min-w-0 max-w-full">
      <p className={cn("text-sm font-bold text-gray-800 truncate", className)}>
        {username}
      </p>
    </button>
  );
};

export default Username;
