"use client";

import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

type CookingReviewAuthorAvatarProps = {
  nickname: string;
  profileImageUrl: string | null;
  className?: string;
};

const AvatarFallback = ({ nickname }: { nickname: string }) => {
  const initial = Array.from(nickname.trim())[0] ?? "?";

  return (
    <span
      aria-label={`${nickname} 프로필 대체 이미지`}
      className="text-olive-dark absolute inset-0 grid place-items-center bg-gray-100 text-xs font-semibold"
    >
      {initial}
    </span>
  );
};

const AvatarFrame = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "block size-[34px] shrink-0 overflow-hidden rounded-full bg-gray-100",
      className
    )}
  >
    {children}
  </span>
);

export const CookingReviewAuthorAvatar = ({
  nickname,
  profileImageUrl,
  className,
}: CookingReviewAuthorAvatarProps) => {
  if (!profileImageUrl) {
    return (
      <AvatarFrame className={className}>
        <span className="relative block size-full">
          <AvatarFallback nickname={nickname} />
        </span>
      </AvatarFrame>
    );
  }

  return (
    <Image
      src={profileImageUrl}
      alt=""
      wrapperClassName={cn(
        "size-[34px] shrink-0 rounded-full bg-gray-100",
        className
      )}
      imgClassName="rounded-full"
      skeleton={<span aria-hidden className="absolute inset-0 bg-gray-100" />}
      errorFallback={<AvatarFallback nickname={nickname} />}
    />
  );
};
