import { api } from "@/shared/api/client";
import { uploadFileToS3 } from "@/shared/api/file";

import { createRecordStickerSession } from "../createRecordStickerSession";

jest.mock("@/shared/api/client", () => ({ api: { post: jest.fn() } }));
jest.mock("@/shared/api/file", () => ({ uploadFileToS3: jest.fn() }));

const result = {
  stickerKey: "sticker",
  imageUrl: "/sticker.webp",
  imageSize: { width: 700, height: 900 },
};
beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(api.post).mockResolvedValue([
    {
      presignedUrl: "https://upload.example/image",
      imageKey: "original",
      uploadKey: "upload",
    },
  ]);
  jest.mocked(uploadFileToS3).mockResolvedValue("original");
});

test("concurrent preview and later reuse upload and process the same File once", async () => {
  const process = jest.fn().mockResolvedValue(result);
  const session = createRecordStickerSession(process);
  const file = new File(["photo"], "food.jpg", { type: "image/jpeg" });
  const [first, second] = await Promise.all([
    session.prepare(file),
    session.prepare(file),
  ]);
  expect(await session.prepare(file)).toEqual(first);
  expect(second).toEqual({ ...result, originalKey: "original" });
  expect(api.post).toHaveBeenCalledTimes(1);
  expect(uploadFileToS3).toHaveBeenCalledTimes(1);
  expect(process).toHaveBeenCalledTimes(1);
  expect(process).toHaveBeenCalledWith("original");
});

test("retry after processing failure reuses the successful original upload", async () => {
  const process = jest
    .fn()
    .mockRejectedValueOnce(new Error("failed"))
    .mockResolvedValue(result);
  const session = createRecordStickerSession(process);
  const file = new File(["photo"], "food.jpg", { type: "image/jpeg" });
  await expect(session.prepare(file)).rejects.toThrow("failed");
  await expect(session.prepare(file)).resolves.toEqual({
    ...result,
    originalKey: "original",
  });
  expect(api.post).toHaveBeenCalledTimes(1);
  expect(process).toHaveBeenCalledTimes(2);
});

test("different files with the same name never share a sticker result", async () => {
  const process = jest.fn().mockResolvedValue(result);
  const session = createRecordStickerSession(process);
  await session.prepare(
    new File(["first"], "food.jpg", { type: "image/jpeg" })
  );
  await session.prepare(
    new File(["other"], "food.jpg", { type: "image/jpeg" })
  );
  expect(process).toHaveBeenCalledTimes(2);
});

test("an incomplete upload response fails before starting sticker processing", async () => {
  jest.mocked(api.post).mockResolvedValue([]);
  const process = jest.fn();
  await expect(
    createRecordStickerSession(process).prepare(
      new File(["photo"], "food.jpg", { type: "image/jpeg" })
    )
  ).rejects.toThrow("count");
  expect(process).not.toHaveBeenCalled();
});
