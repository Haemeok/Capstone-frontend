const S3_BASE = "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/";

export const coverImageUrlFromKey = (
  key: string | null | undefined,
): string | null => {
  if (!key) return null;
  if (key.startsWith("http://") || key.startsWith("https://")) return key;
  return `${S3_BASE}${key}`;
};
