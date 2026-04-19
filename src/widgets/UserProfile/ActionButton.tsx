"use client";

import Link from "next/link";

import { LogIn, Plus } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
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
      <LoginPromotionBadge variant="desktop" popupClassName="md:hidden">
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
    <>
      <Button
        asChild
        className="hidden md:inline-flex bg-white border border-olive-light hover:bg-olive-light/10 gap-0 rounded-full px-6 text-olive-light"
      >
        <Link href="/recipes/new" prefetch={false}>
          <Plus size={16} className="mr-1" /> 레시피 등록하기
        </Link>
      </Button>
      <Link
        href="/recipes/new"
        prefetch={false}
        aria-label="레시피 등록하기"
        onClick={() => triggerHaptic("Light")}
        className="md:hidden z-header sticky-optimized fixed bottom-24 right-5 flex h-14 items-center gap-1 rounded-full bg-olive-light pl-4 pr-5 font-bold text-white shadow-lg active:scale-[0.98] transition-transform"
      >
        <Plus size={20} />
        <span>레시피</span>
      </Link>
    </>
  );
};

export default ActionButton;
