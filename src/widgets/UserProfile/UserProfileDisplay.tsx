import Image from "next/image";

import { UserRound } from "lucide-react";

import { guestUser } from "@/shared/config/constants/user";

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
  <div className="relative z-10 px-6">
    <div className="flex items-end justify-between">
      <div className="flex items-end gap-4">
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.nickname}
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 border-2 border-gray-200">
                <UserRound className="h-20 w-20 text-gray-300" />
              </div>
            )}
          </div>
          {isOwnProfile && <UserInfoEditButton />}
        </div>
        <h2 className="text-dark mb-5 text-2xl font-bold">{user.nickname}</h2>
      </div>
      <ActionButton
        isLoggedIn={!!loggedInUser}
        isOwnProfile={isOwnProfile}
        isGuest={user.id === guestUser.id}
      />
    </div>
    <p className="text-mm text-dark mt-3 max-w-[90%]">{user.introduction}</p>
  </div>
);

export default UserProfileDisplay;
