import type { ImageSize } from "@/shared/lib/image-crop";

export const readPhotoFile = async (
  file: File
): Promise<{ url: string; size: ImageSize }> => {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size === 0 ||
    file.size > 10 * 1024 * 1024
  )
    throw new Error("INVALID_PHOTO");
  const url = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("PHOTO_READ_FAILED"));
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("PHOTO_READ_FAILED"));
    reader.readAsDataURL(file);
  });
  const size = await readPhotoDimensions(url);
  return { url, size };
};

export const readPhotoDimensions = (url: string): Promise<ImageSize> =>
  new Promise<ImageSize>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () =>
      image.naturalWidth > 0 && image.naturalHeight > 0
        ? resolve({ width: image.naturalWidth, height: image.naturalHeight })
        : reject(new Error("PHOTO_DECODE_FAILED"));
    image.onerror = () => reject(new Error("PHOTO_DECODE_FAILED"));
    image.src = url;
  });
