"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { guestUser } from "@/shared/config/constants/user";
import { Container } from "@/shared/ui/Container";

import { useUserQuery } from "@/entities/user";
import { useUserStore } from "@/entities/user";

import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import Header from "@/widgets/Header/UserProfileHeader";
import UserProfileDisplay from "@/widgets/UserProfile/UserProfileDisplay";
import UserTab from "@/widgets/UserTab/UserTab";
import IOSInstallGuideModal from "@/widgets/IOSInstallGuideModal";

const UserDetailPage = () => {
  const { user: loggedInUser } = useUserStore();
  const { userId: profileId } = useParams();
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const isOwnProfile =
    loggedInUser !== null &&
    (profileId === "guestUser" || Number(profileId) === loggedInUser.id);

  const { user } = useUserQuery(
    Number(profileId),
    Number(profileId) !== loggedInUser?.id
  );

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

          {/* Test button for iOS Install Guide Modal */}
          <div className="p-4">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="bg-olive-medium w-full rounded-xl py-3 font-medium text-white"
            >
              iOS 설치 가이드 테스트
            </button>
          </div>
        </div>
      </Container>
      <DesktopFooter />

      {/* iOS Install Guide Modal */}
      <IOSInstallGuideModal
        isOpen={isGuideModalOpen}
        onOpenChange={setIsGuideModalOpen}
      />
    </>
  );
};

export default UserDetailPage;
