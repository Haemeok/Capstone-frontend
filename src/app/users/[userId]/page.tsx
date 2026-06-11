import type { Metadata } from "next";

import { absoluteUrl, BASE_URL } from "@/shared/config/constants/api";
import { isDefaultProfileImage } from "@/shared/lib/colors";

import { getPublicUserForMetadata } from "@/entities/user/model/getPublicUserForMetadata";

import UserDetailClient from "./UserDetailClient";

const FALLBACK_DESC = "레시피오에서 이 프로필을 확인해보세요.";
const FALLBACK_IMAGE = absoluteUrl("og-default.png");

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
  const description =
    user.introduction ||
    `${user.nickname}님의 레시피와 요리 활동을 레시피오에서 확인해보세요.`;
  const image =
    user.profileImage && !isDefaultProfileImage(user.profileImage)
      ? user.profileImage
      : FALLBACK_IMAGE;
  const url = new URL(`users/${userId}`, BASE_URL).toString();

  return {
    title,
    description,
    openGraph: { title, description, url, images: [{ url: image }] },
    twitter: { card: "summary", title, description, images: [image] },
  };
};

const Page = () => <UserDetailClient />;

export default Page;
