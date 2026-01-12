type ThumbnailQuality = "maxresdefault" | "hqdefault" | "sddefault";

const YOUTUBE_THUMBNAIL_BASE_URL = "https://i.ytimg.com/vi";

export const getYouTubeThumbnailUrl = (
  videoId: string,
  quality: ThumbnailQuality
): string => {
  return `${YOUTUBE_THUMBNAIL_BASE_URL}/${videoId}/${quality}.jpg`;
};

export const getYouTubeThumbnailUrls = (videoId: string): string[] => {
  return [
    getYouTubeThumbnailUrl(videoId, "maxresdefault"),
    getYouTubeThumbnailUrl(videoId, "hqdefault"),
    getYouTubeThumbnailUrl(videoId, "sddefault"),
  ];
};

export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/v\/([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};
