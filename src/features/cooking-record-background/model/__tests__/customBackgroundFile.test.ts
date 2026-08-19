import {
  getCustomBackgroundFileError,
  MAX_CUSTOM_BACKGROUND_FILE_SIZE,
} from "../customBackgroundFile";

const createFile = (size: number, type: string) =>
  new File([new Uint8Array(size)], "background", { type });

it("정확히 10MB인 JPEG 커스텀 배경은 허용합니다", () => {
  expect(
    getCustomBackgroundFileError(
      createFile(MAX_CUSTOM_BACKGROUND_FILE_SIZE, "image/jpeg")
    )
  ).toBeNull();
});

it.each([
  [0, "image/jpeg", "EMPTY_FILE"],
  [1, "application/pdf", "UNSUPPORTED_TYPE"],
  [MAX_CUSTOM_BACKGROUND_FILE_SIZE + 1, "image/png", "FILE_TOO_LARGE"],
] as const)(
  "크기 %i, 형식 %s인 파일은 %s로 거절합니다",
  (size, type, expected) => {
    expect(getCustomBackgroundFileError(createFile(size, type))).toBe(expected);
  }
);
