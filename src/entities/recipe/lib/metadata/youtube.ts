import type { Locale } from "@/shared/i18n";
import { localizedSiteName } from "@/shared/lib/metadata/localized";

import type {
  RecipeYoutubeMeta,
  StaticRecipe,
} from "@/entities/recipe/model/types";

import { toIso8601 } from "./dateTime";

export type YoutubeMetadata = Required<Pick<RecipeYoutubeMeta, "channelName">> &
  Pick<
    RecipeYoutubeMeta,
    "videoTitle" | "thumbnailUrl" | "channelProfileUrl" | "subscriberCount"
  >;

export const extractYoutubeMetadata = (
  recipe: StaticRecipe
): YoutubeMetadata | undefined => {
  if (!recipe.youtube?.url || !recipe.youtube.channelName) {
    return undefined;
  }

  return {
    channelName: recipe.youtube.channelName,
    videoTitle: recipe.youtube.videoTitle,
    thumbnailUrl: recipe.youtube.thumbnailUrl,
    channelProfileUrl: recipe.youtube.channelProfileUrl,
    subscriberCount: recipe.youtube.subscriberCount,
  };
};

export const formatSubscriberCount = (
  count: number,
  locale: Locale = "ko"
): string => {
  if (locale === "en") {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1)}M`;
    }
    if (count >= 1_000) {
      return `${Math.floor(count / 1_000)}K`;
    }
    return `${count}`;
  }
  if (locale === "ja") {
    if (count >= 10_000) {
      return `${Math.floor(count / 10_000)}万人`;
    }
    if (count >= 1_000) {
      return `${Math.floor(count / 1_000)}千人`;
    }
    return `${count}人`;
  }
  if (count >= 10000) {
    const tenThousands = Math.floor(count / 10000);
    return `${tenThousands}만명`;
  } else if (count >= 1000) {
    const thousands = Math.floor(count / 1000);
    return `${thousands}천명`;
  }
  return `${count}명`;
};

const VIDEO_KEYWORDS: Record<Locale, [string, string]> = {
  ko: ["유튜브 레시피", "요리 영상"],
  en: ["YouTube recipe", "cooking video"],
  ja: ["YouTubeレシピ", "料理動画"],
};

const videoDescription = (
  ch: string,
  title: string,
  desc: string,
  locale: Locale
): string => {
  if (locale === "en") return `${title} recipe video by ${ch}. ${desc}`;
  if (locale === "ja") return `${ch}さんによる${title}のレシピ動画。${desc}`;
  return `${ch}의 ${title} 레시피 영상. ${desc}`;
};

export const createEnhancedVideoObject = (
  recipe: StaticRecipe,
  youtubeMetadata: YoutubeMetadata,
  locale: Locale = "ko"
) => {
  const subscriberCount = youtubeMetadata.subscriberCount || 0;
  const ch = youtubeMetadata.channelName;
  const [kw1, kw2] = VIDEO_KEYWORDS[locale];

  return {
    "@type": "VideoObject" as const,
    name:
      youtubeMetadata.videoTitle ||
      (locale === "ko" ? `${recipe.title} 만들기` : recipe.title),
    description: videoDescription(ch, recipe.title, recipe.description, locale),
    thumbnailUrl: [
      youtubeMetadata.thumbnailUrl || recipe.imageUrl,
      recipe.imageUrl,
    ].filter(Boolean),
    contentUrl: recipe.youtube?.url,
    embedUrl: recipe.youtube?.url,
    uploadDate: toIso8601(recipe.createdAt),
    ...(recipe.cookingTime && { duration: `PT${recipe.cookingTime}M` }),
    publisher: {
      "@type": "Organization" as const,
      name: localizedSiteName(locale),
      logo: {
        "@type": "ImageObject" as const,
        url: "https://www.recipio.kr/og.png",
      },
    },
    creator: {
      "@type": "Person" as const,
      name: ch,
      ...(youtubeMetadata.channelProfileUrl && {
        image: youtubeMetadata.channelProfileUrl,
      }),
    },
    ...(subscriberCount > 0 && {
      interactionStatistic: {
        "@type": "InteractionCounter" as const,
        interactionType: "https://schema.org/SubscribeAction",
        userInteractionCount: subscriberCount,
      },
    }),
    keywords: [recipe.title, ch, kw1, kw2, ...recipe.tags].join(", "),
  };
};

const JOB_TITLE: Record<Locale, string> = {
  ko: "요리 크리에이터",
  en: "Cooking creator",
  ja: "料理クリエイター",
};

const creatorDescription = (n: number, locale: Locale): string => {
  if (locale === "en")
    return `Popular cooking creator with ${formatSubscriberCount(n, "en")} subscribers`;
  if (locale === "ja")
    return `登録者${formatSubscriberCount(n, "ja")}の人気料理クリエイター`;
  return `구독자 ${formatSubscriberCount(n, "ko")}의 인기 요리 유튜버`;
};

export const createCreatorPersonSchema = (
  youtubeMetadata: YoutubeMetadata,
  locale: Locale = "ko"
) => {
  const subscriberCount = youtubeMetadata.subscriberCount || 0;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: youtubeMetadata.channelName,
    ...(youtubeMetadata.channelProfileUrl && {
      image: youtubeMetadata.channelProfileUrl,
    }),
    jobTitle: JOB_TITLE[locale],
    ...(subscriberCount > 0 && {
      description: creatorDescription(subscriberCount, locale),
    }),
  };
};
