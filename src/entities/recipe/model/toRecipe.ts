import type { RawRecipeResponse, Recipe } from "./types";

export const toRecipe = (raw: RawRecipeResponse): Recipe => {
  const {
    youtubeUrl,
    youtubeChannelName,
    youtubeVideoTitle,
    youtubeThumbnailUrl,
    youtubeChannelProfileUrl,
    youtubeSubscriberCount,
    youtubeChannelId,
    source,
    ...rest
  } = raw;
  const youtube = youtubeUrl
    ? {
        url: youtubeUrl,
        channelName: youtubeChannelName,
        videoTitle: youtubeVideoTitle,
        thumbnailUrl: youtubeThumbnailUrl,
        channelProfileUrl: youtubeChannelProfileUrl,
        subscriberCount: youtubeSubscriberCount,
        channelId: youtubeChannelId,
      }
    : undefined;
  return { ...rest, source: source ?? "USER", ...(youtube ? { youtube } : {}) };
};
