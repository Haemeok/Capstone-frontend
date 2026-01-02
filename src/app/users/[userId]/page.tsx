"use client";

import { notFound, useParams } from "next/navigation";

import { guestUser } from "@/shared/config/constants/user";
import { Container } from "@/shared/ui/Container";

import { useUserQuery } from "@/entities/user";
import { useUserStore } from "@/entities/user";

import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import Header from "@/widgets/Header/UserProfileHeader";
import UserProfileDisplay from "@/widgets/UserProfile/UserProfileDisplay";
import UserTab from "@/widgets/UserTab/UserTab";

const UserDetailPage = () => {
  const { user: loggedInUser } = useUserStore();
  const { userId: profileId } = useParams();

  const isOwnProfile =
    loggedInUser !== null &&
    (profileId === "guestUser" || profileId === loggedInUser.id);

  if (typeof profileId !== "string") {
    notFound();
  }

  const { user } = useUserQuery(profileId, profileId !== loggedInUser?.id);

  const displayUser = isOwnProfile ? loggedInUser : (user ?? guestUser);

  return (
    <>
      <Container padding={false}>
        <div className="flex flex-col">
          <Header isOwnProfile={isOwnProfile} />

          <UserProfileDisplay
            user={displayUser}
            isOwnProfile={isOwnProfile}
            loggedInUser={loggedInUser}
          />

          <UserTab
            user={displayUser}
            isOwnProfile={isOwnProfile}
            isLoggedIn={!!loggedInUser}
          />
        </div>
      </Container>
      <DesktopFooter />
    </>
  );
};

export default UserDetailPage;
