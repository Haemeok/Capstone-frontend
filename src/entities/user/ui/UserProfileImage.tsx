"use client";

import React from "react";
import Link from "next/link";

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
    <Link href={`/users/${userId}`}>
      <div
        className={cn("h-8 w-8 rounded-full flex-shrink-0 cursor-pointer overflow-hidden", className)}
      >
        <Image
          src={profileImage}
          alt="profileImage"
          wrapperClassName="h-full w-full rounded-full"
          fit="cover"
        />
      </div>
    </Link>
  );
};

export default UserProfileImage;
