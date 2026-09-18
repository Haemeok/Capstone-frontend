import { useState } from "react";

import { act, renderHook } from "@testing-library/react";

import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";
import { createEmptyPhotoDraft } from "@/entities/recipe/model/recordPhotoView";

import { useRecordPhotoMode } from "../useRecordPhotoMode";

const useHarness = (initial: RecordPhotoDraft) => {
  const [photo, setPhoto] = useState(initial);
  return { photo, setPhoto, ...useRecordPhotoMode(photo, setPhoto) };
};

test("new records start as dish while saved stickers retain their mode", () => {
  const dish = renderHook(() => useHarness(createEmptyPhotoDraft()));
  expect(dish.result.current.mode).toBe("dish");
  const sticker = renderHook(() =>
    useHarness({ ...createEmptyPhotoDraft(), shape: { kind: "sticker" } })
  );
  expect(sticker.result.current.mode).toBe("sticker");
});

test("switching modes restores each crop and the selected dish style", () => {
  const initial: RecordPhotoDraft = {
    ...createEmptyPhotoDraft(),
    originalUrl: "/food.jpg",
    plateId: "plate-selected",
    shape: { kind: "mask", value: "WAVY_CIRCLE_6" },
    crop: { centerX: 0.6, centerY: 0.4, zoom: 2 },
  };
  const { result } = renderHook(() => useHarness(initial));
  act(() => result.current.selectMode("sticker"));
  expect(result.current.photo.plateId).toBeNull();
  const stickerCrop = { centerX: 0.4, centerY: 0.6, zoom: 3 };
  act(() =>
    result.current.setPhoto({ ...result.current.photo, crop: stickerCrop })
  );
  act(() => result.current.selectMode("dish"));
  expect(result.current.photo).toEqual(initial);
  act(() => result.current.selectMode("sticker"));
  expect(result.current.photo.crop).toEqual(stickerCrop);
});

test("replacing a photo preserves the dish choice without restoring the old photo crop", () => {
  const { result } = renderHook(() =>
    useHarness({
      ...createEmptyPhotoDraft(),
      originalUrl: "/first.jpg",
      plateId: "plate-selected",
      crop: { centerX: 0.6, centerY: 0.4, zoom: 2 },
    })
  );
  act(() => result.current.selectMode("sticker"));
  act(() =>
    result.current.setPhoto({
      ...result.current.photo,
      originalUrl: "/second.jpg",
    })
  );
  act(() => result.current.selectMode("dish"));
  expect(result.current.photo.plateId).toBe("plate-selected");
  expect(result.current.photo.crop).toEqual(createEmptyPhotoDraft().crop);
});
