export type FileInfoRequest = {
  fileName: string;
  fileType: string;
};

export type PresignedUrlInfo = {
  presignedUrl: string;
  fileKey: string;
};

export type PresignedUrlResponse = {
  uploads: PresignedUrlInfo[];
};
