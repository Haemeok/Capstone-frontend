import { Image } from "@/shared/ui/image/Image";

import { UserRound } from "lucide-react";

import { guestUser } from "@/shared/config/constants/user";
import {
  generateUserGradient,
  isDefaultProfileImage,
} from "@/shared/lib/colors";

import UserInfoEditButton from "@/features/edit-user-profile/ui/UserInfoEditButton";

import { User } from "../../entities/user/model/types";
import ActionButton from "./ActionButton";
import CollapsibleP from "@/shared/ui/CollapsibleP";

type UserProfileDisplayProps = {
  user: User;
  isOwnProfile: boolean;
  loggedInUser: User | null;
};

const UserProfileDisplay = ({
  user,
  isOwnProfile,
  loggedInUser,
}: UserProfileDisplayProps) => (
  <div className="relative z-10 px-6">
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className="h-24 w-24 overflow-hidden rounded-full"
            style={
              user.profileImage && isDefaultProfileImage(user.profileImage)
                ? generateUserGradient(user.id)
                : undefined
            }
          >
            {user.profileImage ? (
              <Image src={user.profileImage} alt={user.nickname} />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 border-2 border-gray-200">
                <UserRound className="h-20 w-20 text-gray-300" />
              </div>
            )}
          </div>
          {isOwnProfile && <UserInfoEditButton />}
        </div>
      </div>
      <div className="grow flex flex-col">
        <h2 className="text-dark text-xl font-bold mb-2">{user.nickname}</h2>
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
      className="px-0 text-mm"
      height={52}
      gradientHeight={16}
    />
  </div>
);

export default UserProfileDisplay;
