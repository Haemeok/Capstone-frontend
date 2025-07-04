import Image from "next/image";

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
            <Image
              src={user.profileImage ?? ""}
              alt={user.nickname}
              fill
              className="object-cover"
            />
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
