import type { Metadata } from "next";

import { absoluteUrl, BASE_URL } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";
import { buildHreflangAlternates } from "@/shared/i18n/hreflang";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";
import { isDefaultProfileImage } from "@/shared/lib/colors";

import { getPublicUserForMetadata } from "./getPublicUserForMetadata";

const FALLBACK_IMAGE = absoluteUrl("og-default.png");

export const buildUserMetadata = async (
  userId: string,
  locale: Locale
): Promise<Metadata> => {
  const meta = userPagesMessages[locale].profile.metadata;
  const user = await getPublicUserForMetadata(userId);

  if (!user) {
    return { title: meta.titleSuffix, description: meta.fallbackDescription };
  }

  const title = `${user.nickname} - ${meta.titleSuffix}`;
  const description = user.introduction || meta.fallbackDescription;
  const image =
    user.profileImage && !isDefaultProfileImage(user.profileImage)
      ? user.profileImage
      : FALLBACK_IMAGE;
  const url = new URL(`users/${userId}`, BASE_URL).toString();

  return {
    title,
    description,
    alternates: { languages: buildHreflangAlternates(`users/${userId}`) },
    openGraph: { title, description, url, images: [{ url: image }] },
    twitter: { card: "summary", title, description, images: [image] },
  };
};
