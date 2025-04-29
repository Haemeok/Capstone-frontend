export type FileInfoRequest = {
  type: 'main' | 'step';
  contentType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
  stepIndex?: number;
};

export type PresignedUrlInfo = {
  presignedUrl: string;
  fileKey: string;
};

export type PresignedUrlResponse = {
  uploads: PresignedUrlInfo[];
  recipeId: number;
};

export type FileObject = {
  file: File;
  type: 'main' | 'step';
  stepIndex?: number;
};

export type UploadResult = {
  fileKey: string;
  success: boolean;
  originalIndex: number;
  error?: unknown;
};
