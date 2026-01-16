import type { StaticRecipe } from "@/entities/recipe/model/types";

import { SEO_CONSTANTS, YOUTUBE_SEO } from "./constants";

export type YoutubeMetadata = {
  channelName: string;
  videoTitle?: string;
  thumbnailUrl?: string;
  channelProfileUrl?: string;
  subscriberCount?: number;
};

export const extractYoutubeMetadata = (
  recipe: StaticRecipe
): YoutubeMetadata | undefined => {
  if (!recipe.youtubeUrl || !recipe.youtubeChannelName) {
    return undefined;
  }

  return {
    channelName: recipe.youtubeChannelName,
    videoTitle: recipe.youtubeVideoTitle,
    thumbnailUrl: recipe.youtubeThumbnailUrl,
    channelProfileUrl: recipe.youtubeChannelProfileUrl,
    subscriberCount: recipe.youtubeSubscriberCount,
  };
};

export const formatSubscriberCount = (count: number): string => {
  if (count >= YOUTUBE_SEO.SUBSCRIBER_THRESHOLDS.MILLION) {
    const millions = Math.floor(count / 10000) / 100;
    return `${millions}만명`;
  } else if (count >= 10000) {
    const tenThousands = Math.floor(count / 10000);
    return `${tenThousands}만명`;
  } else if (count >= 1000) {
    const thousands = Math.floor(count / 1000);
    return `${thousands}천명`;
  }
  return `${count}명`;
};

export const createEnhancedVideoObject = (
  recipe: StaticRecipe,
  youtubeMetadata: YoutubeMetadata
) => {
  const subscriberCount = youtubeMetadata.subscriberCount || 0;

  return {
    "@type": "VideoObject" as const,
    name: youtubeMetadata.videoTitle || `${recipe.title} 만들기`,
    description: `${youtubeMetadata.channelName}의 ${recipe.title} 레시피 영상. ${recipe.description}`,
    thumbnailUrl: [
      youtubeMetadata.thumbnailUrl || recipe.imageUrl,
      recipe.imageUrl,
    ].filter(Boolean),
    contentUrl: recipe.youtubeUrl,
    embedUrl: recipe.youtubeUrl,
    uploadDate: recipe.createdAt || new Date().toISOString(),
    ...(recipe.cookingTime && { duration: `PT${recipe.cookingTime}M` }),
    publisher: {
      "@type": "Organization" as const,
      name: SEO_CONSTANTS.SITE_NAME,
      logo: {
        "@type": "ImageObject" as const,
        url: SEO_CONSTANTS.DEFAULT_IMAGE,
      },
    },
    creator: {
      "@type": "Person" as const,
      name: youtubeMetadata.channelName,
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
    keywords: [
      recipe.title,
      youtubeMetadata.channelName,
      "유튜브 레시피",
      "요리 영상",
      ...recipe.tags,
    ].join(", "),
  };
};

export const createCreatorPersonSchema = (youtubeMetadata: YoutubeMetadata) => {
  const subscriberCount = youtubeMetadata.subscriberCount || 0;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: youtubeMetadata.channelName,
    ...(youtubeMetadata.channelProfileUrl && {
      image: youtubeMetadata.channelProfileUrl,
    }),
    jobTitle: "요리 크리에이터",
    ...(subscriberCount > 0 && {
      description: `구독자 ${formatSubscriberCount(subscriberCount)}의 인기 요리 유튜버`,
    }),
  };
};
