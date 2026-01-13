"use client";

import Link from "next/link";

import { LogIn, Plus } from "lucide-react";

import LoginPromotionBadge from "@/shared/ui/badge/LoginPromotionBadge";
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
      <LoginPromotionBadge variant="desktop">
        <Button
          asChild
          className="bg-white border border-olive-light hover:bg-olive-light/10 rounded-full px-6 text-olive-light"
        >
          <Link href="/login">
            <LogIn size={16} className="mr-1" /> 로그인
          </Link>
        </Button>
      </LoginPromotionBadge>
    );
  }

  return (
    <Button
      asChild
      className="bg-white border border-olive-light hover:bg-olive-light/10 gap-0 rounded-full px-6 text-olive-light"
    >
      <Link href="/recipes/new" prefetch={false}>
        <Plus size={16} className="mr-1" /> 레시피 등록하기
      </Link>
    </Button>
  );
};

export default ActionButton;
