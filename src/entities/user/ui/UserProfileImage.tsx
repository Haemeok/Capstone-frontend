"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Avatar } from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

type UserProfileImageProps = {
  profileImage: string;
  userId: number;
  className?: string;
};

const UserProfileImage = ({
  profileImage,
  userId,
  className,
}: UserProfileImageProps) => {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/users/${userId}`);
  };
  return (
    <Avatar
      className={cn("h-8 w-8 rounded-full flex-shrink-0", className)}
      onClick={handleClick}
    >
      <img
        src={profileImage}
        alt="profileImage"
        width={32}
        height={32}
        className="h-full w-full rounded-full object-cover"
      />
    </Avatar>
  );
};

export default UserProfileImage;
