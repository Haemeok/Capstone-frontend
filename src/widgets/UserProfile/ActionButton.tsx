"use client";

import { LogIn, Plus } from "lucide-react";

import { LocalizedLink, useUserPagesDict } from "@/shared/i18n";
import LoginPromotionBadge from "@/entities/user/ui/LoginPromotionBadge";
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
  const t = useUserPagesDict();

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
          <LocalizedLink href="/login">
            <LogIn size={16} className="mr-1" /> {t.profile.loginAction}
          </LocalizedLink>
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
        <LocalizedLink href="/recipes/new" prefetch={false}>
          <Plus size={16} className="mr-1" /> {t.profile.createRecipeAction}
        </LocalizedLink>
      </Button>
      <FloatingCreateRecipeButton />
    </>
  );
};

export default ActionButton;
