import type { Metadata } from "next";

import { BASE_URL } from "@/shared/config/constants/api";
import { isDefaultProfileImage } from "@/shared/lib/colors";

import { getPublicUserForMetadata } from "@/entities/user/model/getPublicUserForMetadata";

import UserDetailClient from "./UserDetailClient";

const FALLBACK_DESC = "레시피오에서 이 프로필을 확인해보세요.";
const FALLBACK_IMAGE = `${BASE_URL}og-default.png`;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> => {
  const { userId } = await params;
  const user = await getPublicUserForMetadata(userId);

  if (!user) {
    return { title: "레시피오", description: FALLBACK_DESC };
  }

  const title = `${user.nickname} - 레시피오`;
  const description = user.introduction || FALLBACK_DESC; // 빈 소개 → 폴백 (의도된 기본값)
  const image =
    user.profileImage && !isDefaultProfileImage(user.profileImage)
      ? user.profileImage
      : FALLBACK_IMAGE;
  const url = `${BASE_URL}users/${userId}`;

  return {
    title,
    description,
    openGraph: { title, description, url, images: [{ url: image }] },
    twitter: { card: "summary", title, description, images: [image] },
  };
};

const Page = () => <UserDetailClient />;

export default Page;
