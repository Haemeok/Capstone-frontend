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
        <div className="relative z-30 flex justify-between overflow-visible bg-white p-4">
          <h2 className="text-2xl font-bold">프로필</h2>
          {user ? (
            <SettingsActionButton />
          ) : (
            <LoginPromotionBadge variant="mobile-detailed">
              <button
                onClick={() => setIsLoginDialogOpen(true)}
                className="cursor-pointer rounded-xl border-1 border-gray-200 bg-olive-mint px-4 py-2 text-white transition-colors hover:bg-olive-700"
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
    <div className="z-30 flex gap-4 bg-white p-4">
      <PrevButton />
      <h2 className="text-2xl font-bold">프로필</h2>
    </div>
  );
};

export default Header;
