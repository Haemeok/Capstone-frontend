import { act, renderHook, waitFor } from "@testing-library/react";

import { createEmptyPhotoDraft } from "@/entities/recipe/model/recordPhotoView";

import { usePhotoEditorDraft } from "../usePhotoEditorDraft";

const decodeImages: HTMLImageElement[] = [];
let imageSpy: jest.SpyInstance;
beforeEach(() => {
  decodeImages.length = 0;
  imageSpy = jest.spyOn(window, "Image").mockImplementation(() => {
    const image = document.createElement("img");
    Object.defineProperty(image, "naturalWidth", { value: 1200 });
    Object.defineProperty(image, "naturalHeight", { value: 900 });
    decodeImages.push(image);
    return image;
  });
});
afterEach(() => imageSpy.mockRestore());
const file = (name: string) => new File(["photo"], name, { type: "image/png" });
const decoded = (image: HTMLImageElement) =>
  image.dispatchEvent(new Event("load"));

test("the latest photo wins when decoding completes out of order", async () => {
  const onChange = jest.fn();
  const { result } = renderHook(() =>
    usePhotoEditorDraft(createEmptyPhotoDraft(), onChange)
  );
  let first: Promise<void> = Promise.resolve();
  let second: Promise<void> = Promise.resolve();
  act(() => {
    first = result.current.replace(file("first.png"));
  });
  await waitFor(() => expect(decodeImages).toHaveLength(1));
  act(() => {
    second = result.current.replace(file("second.png"));
  });
  await waitFor(() => expect(decodeImages).toHaveLength(2));
  await act(async () => {
    decoded(decodeImages[1]);
    await second;
  });
  await act(async () => {
    decoded(decodeImages[0]);
    await first;
  });
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][0].originalFile.name).toBe("second.png");
  expect(onChange.mock.calls[0][0].stickerUrl).toBeNull();
});

test("cancel and unmount invalidate pending photo decoding", async () => {
  const onChange = jest.fn();
  const { result, unmount } = renderHook(() =>
    usePhotoEditorDraft(createEmptyPhotoDraft(), onChange)
  );
  act(() => result.current.open());
  let reading: Promise<void> = Promise.resolve();
  act(() => {
    reading = result.current.replace(file("cancel.png"));
  });
  await waitFor(() => expect(decodeImages).toHaveLength(1));
  act(() => result.current.cancel());
  await act(async () => {
    decoded(decodeImages[0]);
    await reading;
  });
  expect(onChange).not.toHaveBeenCalled();
  expect(result.current.draft).toBeNull();
  act(() => {
    reading = result.current.replace(file("unmount.png"));
  });
  await waitFor(() => expect(decodeImages).toHaveLength(2));
  unmount();
  await act(async () => {
    decoded(decodeImages[1]);
    await reading;
  });
  expect(onChange).not.toHaveBeenCalled();
});

test("invalid photo leaves the committed draft untouched", async () => {
  const onChange = jest.fn();
  const { result } = renderHook(() =>
    usePhotoEditorDraft(createEmptyPhotoDraft(), onChange)
  );
  await act(() =>
    result.current.replace(
      new File(["text"], "note.txt", { type: "text/plain" })
    )
  );
  expect(onChange).not.toHaveBeenCalled();
  expect(result.current.hasError).toBe(true);
  expect(result.current.isReading).toBe(false);
});
