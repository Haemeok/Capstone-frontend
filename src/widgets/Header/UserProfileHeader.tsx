"use client";

import { useState } from "react";

import PrevButton from "@/shared/ui/PrevButton";

import { useUserStore } from "@/entities/user";

import SettingsActionButton from "@/features/auth/ui/SettingsActionButton";
import LoginDialog from "@/features/auth/ui/LoginDialog";
import LoginPromotionBadge from "@/shared/ui/badge/LoginPromotionBadge";

type HeaderProps = {
  isOwnProfile: boolean;
};

const Header = ({ isOwnProfile }: HeaderProps) => {
  const { user } = useUserStore();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  if (isOwnProfile) {
    return (
      <>
        <div className="relative flex justify-between overflow-visible bg-white p-4">
          <h2 className="text-2xl font-bold">프로필</h2>
          {user ? (
            <SettingsActionButton />
          ) : (
            <LoginPromotionBadge variant="desktop">
              <button
                onClick={() => setIsLoginDialogOpen(true)}
                className="bg-olive-mint hover:bg-olive-700 cursor-pointer rounded-xl border-1 border-gray-200 px-4 py-2 text-white transition-colors"
              >
                로그인
              </button>
            </LoginPromotionBadge>
          )}
        </div>
        <LoginDialog
          open={isLoginDialogOpen}
          onOpenChange={setIsLoginDialogOpen}
        />
      </>
    );
  }

  return (
    <div className="flex gap-4 bg-white p-4">
      <PrevButton />
      <h2 className="text-2xl font-bold">프로필</h2>
    </div>
  );
};

export default Header;
