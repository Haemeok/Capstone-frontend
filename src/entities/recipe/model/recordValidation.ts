import type {
  RecordImageFile,
  RecordImageKeys,
  RecordImagePurpose,
  RecordImageUploadFileRequest,
  RecordImageUploadUrlResponse,
} from "./record";

export const MAX_RECORD_TITLE_LENGTH = 30;
export const MAX_RECORD_TEXT_LENGTH = 500;
const MAX_RECORD_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_RECORD_IMAGE_COUNT = 2;
const ALLOWED_RECORD_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const OFFSET_DATE_TIME_PATTERN = /(Z|[+-]\d{2}:\d{2})$/;

export const validateRecordTitle = (
  title: string | undefined,
  isRequired: boolean
) => {
  if (isRequired && (title === undefined || title.trim().length === 0)) {
    throw new Error("MANUAL 기록 제목은 공백이 아닌 값이어야 합니다.");
  }
  if (title !== undefined && title.length > MAX_RECORD_TITLE_LENGTH) {
    throw new Error("기록 제목은 최대 30자입니다.");
  }
};

export const validateRecordText = (value: string | undefined) => {
  if (value !== undefined && value.length > MAX_RECORD_TEXT_LENGTH) {
    throw new Error("기록 메모와 후기는 최대 500자입니다.");
  }
};

export const validateCookedAt = (cookedAt: string | undefined) => {
  if (cookedAt === undefined) {
    return;
  }
  const timestamp = Date.parse(cookedAt);
  if (!OFFSET_DATE_TIME_PATTERN.test(cookedAt) || Number.isNaN(timestamp)) {
    throw new Error("cookedAt은 offset datetime 형식이어야 합니다.");
  }
  if (timestamp > Date.now()) {
    throw new Error("cookedAt에는 미래 시각을 사용할 수 없습니다.");
  }
};

export const validateRecordImageFiles = (images: RecordImageFile[]) => {
  if (images.length === 0 || images.length > MAX_RECORD_IMAGE_COUNT) {
    throw new Error("기록 이미지는 1개 또는 2개여야 합니다.");
  }
  const purposes = new Set<RecordImagePurpose>();
  images.forEach(({ file, purpose }) => {
    if (!ALLOWED_RECORD_IMAGE_TYPES.has(file.type)) {
      throw new Error("기록 이미지는 JPEG, PNG, WebP만 지원합니다.");
    }
    if (file.size > MAX_RECORD_IMAGE_SIZE) {
      throw new Error("기록 이미지는 파일당 10MiB 이하여야 합니다.");
    }
    if (purposes.has(purpose)) {
      throw new Error("같은 이미지 purpose를 중복해서 사용할 수 없습니다.");
    }
    purposes.add(purpose);
  });
  if (!purposes.has("ORIGINAL")) {
    throw new Error("ORIGINAL 이미지는 필수입니다.");
  }
};

export const toRecordImageUploadRequests = (
  images: RecordImageFile[]
): RecordImageUploadFileRequest[] =>
  images.map(({ file, purpose }) => ({
    contentType: file.type,
    fileSize: file.size,
    purpose,
  }));

export const toRecordImageKeys = (
  images: RecordImageFile[],
  uploaded: RecordImageUploadUrlResponse[]
): RecordImageKeys => {
  if (images.length !== uploaded.length) {
    throw new Error("이미지와 업로드 URL 개수가 일치하지 않습니다.");
  }
  const keys: Partial<Record<RecordImagePurpose, string>> = {};
  images.forEach(({ purpose }, index) => {
    const response = uploaded[index];
    if (response === undefined) {
      throw new Error("이미지 업로드 URL을 찾을 수 없습니다.");
    }
    keys[purpose] = response.imageKey;
  });
  if (keys.ORIGINAL === undefined) {
    throw new Error("ORIGINAL imageKey가 없습니다.");
  }
  return {
    originalKey: keys.ORIGINAL,
    ...(keys.STICKER === undefined ? {} : { stickerKey: keys.STICKER }),
  };
};
