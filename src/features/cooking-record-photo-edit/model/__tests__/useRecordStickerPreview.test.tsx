import { act, renderHook, waitFor } from "@testing-library/react";

import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";
import { createEmptyPhotoDraft } from "@/entities/recipe/model/recordPhotoView";

import type { PreparedRecordSticker } from "../recordStickerPreview.types";
import { useRecordStickerPreview } from "../useRecordStickerPreview";

const photo = (name: string): RecordPhotoDraft => ({
  ...createEmptyPhotoDraft(),
  shape: { kind: "sticker" },
  originalUrl: `/${name}.jpg`,
  originalFile: new File([name], `${name}.jpg`),
});
const result: PreparedRecordSticker = {
  originalKey: "original",
  stickerKey: "sticker",
  imageUrl: "/result.webp",
  imageSize: { width: 200, height: 300 },
};

test("late result from a replaced photo cannot overwrite the current photo", async () => {
  let finishA: (result: PreparedRecordSticker) => void = () => undefined;
  const session = {
    prepare: jest
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<PreparedRecordSticker>((resolve) => {
            finishA = resolve;
          })
      )
      .mockResolvedValue(result),
  };
  const onChange = jest.fn();
  const first = photo("first");
  const second = photo("second");
  const hook = renderHook(
    ({ value }) => useRecordStickerPreview({ photo: value, session, onChange }),
    { initialProps: { value: first } }
  );
  expect(hook.result.current.isPending).toBe(true);
  hook.rerender({ value: second });
  await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
  await act(async () => {
    finishA({ ...result, imageUrl: "/obsolete.webp" });
  });
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      originalFile: second.originalFile,
      stickerUrl: result.imageUrl,
      preparedImage: { originalKey: "original", stickerKey: "sticker" },
    })
  );
});

test("mask choice does not request a sticker, missing processor blocks sticker saving", () => {
  const session = { prepare: jest.fn() };
  const value = photo("food");
  const mask = renderHook(() =>
    useRecordStickerPreview({
      photo: { ...value, shape: { kind: "mask", value: "CIRCLE" } },
      session,
      onChange: jest.fn(),
    })
  );
  expect(session.prepare).not.toHaveBeenCalled();
  expect(mask.result.current.isBlocked).toBe(false);
  const unavailable = renderHook(() =>
    useRecordStickerPreview({ photo: value, onChange: jest.fn() })
  );
  expect(unavailable.result.current.isUnavailable).toBe(true);
  expect(unavailable.result.current.isBlocked).toBe(true);
});

test("failure stays blocked and explicit retry can recover", async () => {
  const session = {
    prepare: jest
      .fn()
      .mockRejectedValueOnce(new Error("failed"))
      .mockResolvedValue(result),
  };
  const value = photo("food");
  const onChange = jest.fn();
  const hook = renderHook(() =>
    useRecordStickerPreview({ photo: value, session, onChange })
  );
  await waitFor(() => expect(hook.result.current.hasError).toBe(true));
  expect(hook.result.current.isBlocked).toBe(true);
  act(() => hook.result.current.retry());
  await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
  expect(session.prepare).toHaveBeenCalledTimes(2);
});
