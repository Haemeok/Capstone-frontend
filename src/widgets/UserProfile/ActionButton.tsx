"use client";

import Link from "next/link";

import { LogIn, Plus } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

type ActionButtonProps = {
  isLoggedIn: boolean;
  isOwnProfile: boolean;
  isGuest: boolean;
};

const ActionButton = ({
  isLoggedIn,
  isOwnProfile,
  isGuest,
}: ActionButtonProps) => {
  if (!isOwnProfile && !isGuest) {
    return <></>;
  }

  if (!isLoggedIn && isGuest) {
    return (
      <Button asChild className="bg-olive-light hover:bg-olive-dark rounded-full px-6 text-white">
        <Link href="/login">
          <LogIn size={16} className="mr-1" /> 로그인
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild className="bg-olive-light gap-0 rounded-full px-6 text-white">
      <Link href="/recipes/new" prefetch={false}>
        <Plus size={16} className="mr-1" /> 레시피 등록하기
      </Link>
    </Button>
  );
};

export default ActionButton;
