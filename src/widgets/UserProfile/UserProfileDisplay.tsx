import { UserRound } from "lucide-react";

import { guestUser } from "@/shared/config/constants/user";
import {
  generateUserGradient,
  isDefaultProfileImage,
} from "@/shared/lib/colors";
import CollapsibleP from "@/shared/ui/CollapsibleP";
import { Image } from "@/shared/ui/image/Image";

import UserInfoEditButton from "@/features/edit-user-profile/ui/UserInfoEditButton";

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
}: UserProfileDisplayProps) => (
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
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 border-2 border-gray-200">
            <UserRound className="h-20 w-20 text-gray-300" />
          </div>
        )}
      </div>
      <div className="grow flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-dark text-base font-bold">{user.nickname}</h2>
          {isOwnProfile && <UserInfoEditButton />}
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
      className="px-0 pt-3 pb-2 text-mm"
      height={52}
      gradientHeight={16}
    />
  </div>
);

export default UserProfileDisplay;
