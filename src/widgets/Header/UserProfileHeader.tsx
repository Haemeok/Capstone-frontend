"use client";

import dynamic from "next/dynamic";

import PrevButton from "@/shared/ui/PrevButton";

const SettingsActionButton = dynamic(
  () => import("@/features/auth/ui/SettingsActionButton"),
  {
    ssr: false,
    loading: () => (
      <div className="h-9 w-9 rounded-full animate-pulse bg-gray-200" />
    ),
  }
);

type HeaderProps = {
  isOwnProfile: boolean;
};

const Header = ({ isOwnProfile }: HeaderProps) => {
  if (isOwnProfile) {
    return (
      <div className="relative flex justify-between overflow-visible bg-white p-4">
        <h2 className="text-2xl font-bold">프로필</h2>
        <SettingsActionButton />
      </div>
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
