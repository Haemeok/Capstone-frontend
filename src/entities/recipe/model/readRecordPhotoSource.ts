export const readRecordPhotoSource = async (url: string): Promise<File> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("RECORD_PHOTO_DOWNLOAD_FAILED");
  const blob = await response.blob();
  return new File([blob], "record-photo", { type: blob.type });
};
