"use client";

import Link from "next/link";

import { LogIn, Plus } from "lucide-react";

import LoginPromotionBadge from "@/shared/ui/badge/LoginPromotionBadge";
import { Button } from "@/shared/ui/shadcn/button";

import FloatingCreateRecipeButton from "@/features/recipe-create/ui/FloatingCreateRecipeButton";

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
      <LoginPromotionBadge variant="desktop" popupClassName="md:hidden">
        <Button
          asChild
          className="border-olive-light hover:bg-olive-light/10 text-olive-light rounded-full border bg-white px-6"
        >
          <Link href="/login">
            <LogIn size={16} className="mr-1" /> 로그인
          </Link>
        </Button>
      </LoginPromotionBadge>
    );
  }

  return (
    <>
      <Button
        asChild
        className="border-olive-light hover:bg-olive-light/10 text-olive-light hidden gap-0 rounded-full border bg-white px-6 md:inline-flex"
      >
        <Link href="/recipes/new" prefetch={false}>
          <Plus size={16} className="mr-1" /> 레시피 등록하기
        </Link>
      </Button>
      <FloatingCreateRecipeButton />
    </>
  );
};

export default ActionButton;
