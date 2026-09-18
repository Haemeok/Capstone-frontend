export const readRecordPhotoSource = async (url: string): Promise<File> => {
  const query = new URLSearchParams({ url });
  const response = await fetch(`/api/bff/record-photo-source?${query}`);
  if (!response.ok) throw new Error("RECORD_PHOTO_DOWNLOAD_FAILED");
  const blob = await response.blob();
  return new File([blob], "record-photo", { type: blob.type });
};
