"use client";

import { Share2, UserRound } from "lucide-react";

import { BASE_URL } from "@/shared/config/constants/api";
import { guestUser } from "@/shared/config/constants/user";
import { useShare } from "@/shared/hooks/useShare";
import { format, useUserPagesDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import {
  generateUserGradient,
  isDefaultProfileImage,
} from "@/shared/lib/colors";
import CollapsibleP from "@/shared/ui/CollapsibleP";
import { Image } from "@/shared/ui/image/Image";

import UserInfoEditButton from "@/features/edit-user-profile/ui/UserInfoEditButton";
import { ReferralGiftButton } from "@/features/referral";

import { User } from "../../entities/user/model/types";
import ActionButton from "./ActionButton";

type UserProfileDisplayProps = {
  user: User;
  isOwnProfile: boolean;
  loggedInUser: User | null;
};

const UserProfileDisplay = ({
  user,
  isOwnProfile,
  loggedInUser,
}: UserProfileDisplayProps) => {
  const { share } = useShare();
  const t = useUserPagesDict();

  const handleShareProfile = () => {
    triggerHaptic("Light");
    share({
      title: format(t.profile.shareTitle, { nickname: user.nickname }),
      text: t.profile.shareText,
      url: new URL(`users/${user.id}`, BASE_URL).toString(),
    });
  };

  return (
    <div className="relative z-10 px-5 pt-4 pb-1">
      <div className="flex items-center gap-4">
        <div
          className="h-24 w-24 shrink-0 overflow-hidden rounded-full"
          style={
            user.profileImage && isDefaultProfileImage(user.profileImage)
              ? generateUserGradient(user.id)
              : undefined
          }
        >
          {user.profileImage ? (
            <Image src={user.profileImage} alt={user.nickname} />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100">
              <UserRound className="h-20 w-20 text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex grow flex-col">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-ink text-base font-bold">{user.nickname}</h2>
          </div>
          <div className="self-end">
            <ActionButton
              isLoggedIn={!!loggedInUser}
              isOwnProfile={isOwnProfile}
              isGuest={user.id === guestUser.id}
            />
          </div>
        </div>
      </div>
      <CollapsibleP
        content={user.introduction}
        className="text-mm px-0 pt-3 pb-2"
        height={52}
        gradientHeight={16}
      />
      {isOwnProfile && (
        <div className="mt-1 flex items-center gap-2">
          <UserInfoEditButton variant="bar" />
          <ReferralGiftButton />
          <button
            type="button"
            aria-label={t.profile.shareAria}
            onClick={handleShareProfile}
            className="text-ink flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50"
          >
            <Share2 size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDisplay;
