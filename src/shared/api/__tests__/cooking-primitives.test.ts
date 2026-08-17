import { END_POINTS } from "@/shared/config/constants/api";

import { ApiError, isApiErrorWithCode } from "../errors";
import { uploadFileToS3 } from "../file";
import { ensureResponsePolyfill } from "./_auth-harness";

ensureResponsePolyfill();

describe("cooking API shared primitives", () => {
  it("기록 이미지 업로드와 내 후기 목록 경로를 백엔드 계약대로 제공한다", () => {
    expect(END_POINTS.RECORD_IMAGE_UPLOAD_URLS).toBe(
      "/me/records/image-upload-urls"
    );
    expect(END_POINTS.MY_RECORDS).toBe("/me/records");
    expect(END_POINTS.MY_REVIEWS).toBe("/me/reviews");
  });

  it("기록과 후기 식별자를 동적 경로에 그대로 연결한다", () => {
    expect(END_POINTS.MY_RECORD("record-a")).toBe("/me/records/record-a");
    expect(END_POINTS.RECORD_IMAGE).toBeDefined();
    expect(END_POINTS.RECORD_IMAGE("record-a")).toBe(
      "/me/records/record-a/image"
    );
    expect(END_POINTS.RECIPE_REVIEWS).toBeDefined();
    expect(END_POINTS.RECIPE_REVIEWS("recipe-b")).toBe(
      "/recipes/recipe-b/reviews"
    );
    expect(END_POINTS.REVIEW).toBeDefined();
    expect(END_POINTS.REVIEW("review-c")).toBe("/reviews/review-c");
    expect(END_POINTS.REVIEW_REPORTS).toBeDefined();
    expect(END_POINTS.REVIEW_REPORTS("review-c")).toBe(
      "/reviews/review-c/reports"
    );
  });

  it("S3가 500을 반환하면 URL을 노출하지 않고 업로드를 거부하며 진행 완료를 알리지 않는다", async () => {
    const presignedUrl =
      "https://private-bucket.example/upload?signature=secret";
    const fetchMock = jest
      .fn<Promise<Response>, Parameters<typeof fetch>>()
      .mockResolvedValue(
        new Response(null, {
          status: 500,
          statusText: "Internal Server Error",
        })
      );
    const onProgress = jest.fn();
    global.fetch = fetchMock;

    const result = await uploadFileToS3(
      new File(["image"], "dish.jpg", { type: "image/jpeg" }),
      { presignedUrl, fileKey: "records/dish.jpg" },
      onProgress
    ).catch((error: unknown) => error);

    expect(result).toEqual(new Error("S3 upload failed with status 500"));
    if (result instanceof Error) {
      expect(result.message).not.toContain(presignedUrl);
    }
    expect(onProgress).not.toHaveBeenCalled();
  });

  it("S3 업로드 성공 시 파일 MIME 타입을 전송하고 파일 키와 완료 진행률을 반환한다", async () => {
    const presignedUrl = "https://bucket.example/upload";
    const file = new File(["image"], "dish.png", { type: "image/png" });
    const fetchMock = jest
      .fn<Promise<Response>, Parameters<typeof fetch>>()
      .mockResolvedValue(new Response(null, { status: 200 }));
    const onProgress = jest.fn();
    global.fetch = fetchMock;

    const fileKey = await uploadFileToS3(
      file,
      { presignedUrl, fileKey: "records/dish.png" },
      onProgress
    );

    expect(fetchMock).toHaveBeenCalledWith(presignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": "image/png" },
    });
    expect(fileKey).toBe("records/dish.png");
    expect(onProgress).toHaveBeenCalledWith("records/dish.png", 100);
  });

  it("HTTP 상태가 같으면 숫자와 문자열 오류 코드를 같은 코드로 판별한다", () => {
    const numericCodeError = new ApiError(409, "Conflict", {
      code: 807,
      message: "already exists",
    });
    const stringCodeError = new ApiError(409, "Conflict", {
      code: "807",
      message: "already exists",
    });

    expect(isApiErrorWithCode).toBeDefined();
    expect(isApiErrorWithCode(numericCodeError, 409, "807")).toBe(true);
    expect(isApiErrorWithCode(stringCodeError, 409, 807)).toBe(true);
  });

  it("상태나 코드가 다르거나 API 오류 데이터가 없으면 일치하지 않는다", () => {
    const apiError = new ApiError(409, "Conflict", {
      code: 807,
      message: "already exists",
    });

    expect(isApiErrorWithCode(apiError, 400, 807)).toBe(false);
    expect(isApiErrorWithCode(apiError, 409, 808)).toBe(false);
    expect(isApiErrorWithCode(new ApiError(409, "Conflict"), 409, 807)).toBe(
      false
    );
    expect(isApiErrorWithCode(new Error("Conflict"), 409, 807)).toBe(false);
  });
});
