"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Avatar } from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { Image } from "@/shared/ui/image/Image";

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
      <Image
        src={profileImage}
        alt="profileImage"
        wrapperClassName="h-full w-full rounded-full"
        fit="cover"
      />
    </Avatar>
  );
};

export default UserProfileImage;
