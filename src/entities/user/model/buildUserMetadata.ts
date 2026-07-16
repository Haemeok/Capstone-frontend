import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { format, type Locale } from "@/shared/i18n";
import { buildHreflangAlternates } from "@/shared/i18n/hreflang";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";
import { isDefaultProfileImage } from "@/shared/lib/colors";
import { localizedPath, OG_LOCALE } from "@/shared/lib/metadata/localized";

import { getPublicUserForMetadata } from "./getPublicUserForMetadata";

const FALLBACK_IMAGE = absoluteUrl("og-default.png");

export const buildUserMetadata = async (
  userId: string,
  locale: Locale
): Promise<Metadata> => {
  const meta = userPagesMessages[locale].profile.metadata;
  const user = await getPublicUserForMetadata(userId);

  const robots = { index: false, follow: true } as const;

  if (!user) {
    return {
      title: meta.titleSuffix,
      description: meta.fallbackDescription,
      robots,
    };
  }

  const title = `${user.nickname} - ${meta.titleSuffix}`;
  const description =
    user.introduction ||
    format(meta.introFallbackTemplate, { nickname: user.nickname });
  const image =
    user.profileImage && !isDefaultProfileImage(user.profileImage)
      ? user.profileImage
      : FALLBACK_IMAGE;
  const url = absoluteUrl(localizedPath(locale, `users/${userId}`));

  return {
    title,
    description,
    robots,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(`users/${userId}`),
    },
    openGraph: {
      title,
      description,
      url,
      locale: OG_LOCALE[locale],
      images: [{ url: image }],
    },
    twitter: { card: "summary", title, description, images: [image] },
  };
};
