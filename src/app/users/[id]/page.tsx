import { useParams } from "next/navigation";

import { useUserQuery } from "@/entities/user";

import Header from "@/widgets/Header/UserProfileHeader";
import UserProfileDisplay from "@/widgets/UserProfile/UserProfileDisplay";

import { guestUser } from "@/shared/config/constants/user";
import { useUserStore } from "@/entities/user";

import UserTab from "@/widgets/UserTab/UserTab";

const UserDetailPage = () => {
  const { user: loggedInUser } = useUserStore();
  const { userId: profileId } = useParams();

  const isOwnProfile =
    loggedInUser !== null && Number(profileId) === loggedInUser.id;

  const { user } = useUserQuery(
    Number(profileId),
    Number(profileId) !== loggedInUser?.id
  );

  const displayUser = isOwnProfile ? loggedInUser : (user ?? guestUser);

  return (
    <div className="flex flex-col overflow-hidden">
      <Header isOwnProfile={isOwnProfile} />

      <UserProfileDisplay
        user={displayUser}
        isOwnProfile={isOwnProfile}
        loggedInUser={loggedInUser}
      />

      <UserTab
        user={user}
        isOwnProfile={isOwnProfile}
        isLoggedIn={!!loggedInUser}
      />
    </div>
  );
};

export default UserDetailPage;
