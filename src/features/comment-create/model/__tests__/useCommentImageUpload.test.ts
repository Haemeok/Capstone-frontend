import {
  MAX_COMMENT_IMAGE_SIZE,
  validateCommentImage,
} from "../useCommentImageUpload";

const makeFile = (type: string, size: number): File => {
  const blob = new Blob([new Uint8Array(size)], { type });
  return new File([blob], "x", { type });
};

describe("validateCommentImage", () => {
  it("returns null for a valid jpeg under the size cap", () => {
    expect(validateCommentImage(makeFile("image/jpeg", 1024))).toBeNull();
  });

  it("returns null for png and webp", () => {
    expect(validateCommentImage(makeFile("image/png", 1024))).toBeNull();
    expect(validateCommentImage(makeFile("image/webp", 1024))).toBeNull();
  });

  it("rejects unsupported MIME types", () => {
    expect(validateCommentImage(makeFile("image/gif", 1024))).toMatch(/JPG/);
    expect(validateCommentImage(makeFile("application/pdf", 1024))).toMatch(/JPG/);
  });

  it("rejects files larger than the cap", () => {
    expect(
      validateCommentImage(makeFile("image/jpeg", MAX_COMMENT_IMAGE_SIZE + 1))
    ).toMatch(/10MB/);
  });
});

import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";
import { END_POINTS } from "@/shared/config/constants/api";

import { uploadCommentImages } from "../useCommentImageUpload";

jest.mock("@/shared/api/client", () => ({
  api: { post: jest.fn() },
}));
jest.mock("@/shared/api/file", () => ({
  uploadFileToS3: jest.fn(),
}));

const apiPost = api.post as jest.Mock;
const putS3 = uploadFileToS3 as jest.Mock;

describe("uploadCommentImages", () => {
  beforeEach(() => {
    apiPost.mockReset();
    putS3.mockReset();
  });

  it("returns [] without calling network when files is empty", async () => {
    const keys = await uploadCommentImages("r1", []);
    expect(keys).toEqual([]);
    expect(apiPost).not.toHaveBeenCalled();
  });

  it("requests one presigned URL per file and returns imageKeys in order", async () => {
    apiPost.mockResolvedValue([
      { uploadKey: "u1", imageKey: "k1", presignedUrl: "p1" },
    ]);
    putS3.mockResolvedValue(undefined);

    const file = new File([new Uint8Array(10)], "a.jpg", { type: "image/jpeg" });
    const keys = await uploadCommentImages("r1", [file]);

    expect(apiPost).toHaveBeenCalledWith(
      END_POINTS.COMMENT_IMAGE_UPLOAD_URLS("r1"),
      { files: [{ contentType: "image/jpeg" }] }
    );
    expect(putS3).toHaveBeenCalledWith(file, {
      presignedUrl: "p1",
      fileKey: "k1",
    });
    expect(keys).toEqual(["k1"]);
  });
});
