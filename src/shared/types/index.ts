import type { HIDDEN_NAVBAR_PATHS } from "../config/constants/navigation";

export type DefaultOption = {
  code: null;
  displayName: string;
};

export type SpecificOption = {
  code: string;
  displayName: string;
};

export type FilterOption = DefaultOption | SpecificOption;

export type FileObject = {
  file: File;
  type: "main" | "step";
  stepIndex?: number;
};

export type UploadResult = {
  fileKey: string;
  success: boolean;
  originalIndex: number;
  error?: unknown;
};

export type FileInfoRequest = {
  type: "main" | "step";
  contentType: (typeof ALLOWED_CONTENT_TYPES)[number];
  stepIndex?: number;
};

export const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

export type PresignedUrlInfo = {
  presignedUrl: string;
  fileKey: string;
};

export type HiddenNavbarPath = (typeof HIDDEN_NAVBAR_PATHS)[number];

export type { AuthStatus, ServerAuthResult } from "./auth";
export { isAuthenticated, isTokenExpired, isUnauthenticated } from "./auth";
