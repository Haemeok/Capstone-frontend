"use client";

import React from "react";
import Link from "next/link";

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
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Link href={`/users/${userId}`}>
        <Avatar
          className={cn("h-8 w-8 rounded-full flex-shrink-0 cursor-pointer", className)}
        >
          <Image
            src={profileImage}
            alt="profileImage"
            wrapperClassName="h-full w-full rounded-full"
            fit="cover"
          />
        </Avatar>
      </Link>
    </div>
  );
};

export default UserProfileImage;
