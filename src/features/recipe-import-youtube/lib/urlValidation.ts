const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?].*)?$/;

export type UrlValidationResult =
  | { valid: true; videoId: string; cleanUrl: string }
  | { valid: false; error: string };

export const validateYoutubeUrl = (url: string): UrlValidationResult => {
  console.log(url);
  if (!url || url.trim() === "") {
    return { valid: false, error: "URL을 입력해주세요." };
  }

  const trimmedUrl = url.trim();
  const match = trimmedUrl.match(YOUTUBE_REGEX);

  if (!match) {
    return {
      valid: false,
      error:
        "올바른 유튜브 URL이 아닙니다. (youtube.com, youtu.be 링크만 지원)",
    };
  }

  const videoId = match[1];
  const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return { valid: true, videoId, cleanUrl };
};

export const extractVideoId = (url: string): string | null => {
  const result = validateYoutubeUrl(url);
  return result.valid ? result.videoId : null;
};
