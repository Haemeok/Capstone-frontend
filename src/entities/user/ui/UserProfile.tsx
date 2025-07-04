import { User } from "@/entities/user/model/types";

import Username from "./UserName";
import UserProfileImage from "./UserProfileImage";

type UserProfileProps = {
  user: User;
  className?: string;
};

const UserProfile = ({ user, className }: UserProfileProps) => {
  return (
    <div className="h-[80px] w-full max-w-md overflow-hidden">
      <div className="flex h-full items-center gap-2">
        <UserProfileImage
          profileImage={user.profileImage ?? ""}
          userId={user.id}
          className="h-full w-[80px]"
        />
        <div className="flex h-full flex-col items-start justify-center p-2">
          <Username
            username={user.nickname}
            userId={user.id}
            className={className}
          />
          <p className="text-left text-sm">{user.introduction}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
