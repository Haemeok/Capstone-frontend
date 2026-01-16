"use client";

import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Image } from "@/shared/ui/image/Image";
import {
  generateUserGradient,
  isDefaultProfileImage,
} from "@/shared/lib/colors";

type UserProfileImageProps = {
  profileImage: string;
  userId: string;
  className?: string;
};

const UserProfileImage = ({
  profileImage,
  userId,
  className,
}: UserProfileImageProps) => {
  const isDefault = isDefaultProfileImage(profileImage);
  const gradientStyle = isDefault ? generateUserGradient(userId) : undefined;

  return (
    <Link href={`/users/${userId}`}>
      <div
        className={cn(
          "h-8 w-8 flex-shrink-0 cursor-pointer overflow-hidden rounded-full",
          className
        )}
        style={gradientStyle}
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
