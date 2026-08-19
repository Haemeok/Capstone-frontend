import { act, renderHook } from "@testing-library/react";

import { ApiError } from "@/shared/api/errors";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { StickerBookBackgroundOption } from "@/entities/recipe";
import { useStickerBookBackgroundsQuery } from "@/entities/recipe";

import {
  useCreateCustomStickerBookBackground,
  useDeleteCustomStickerBookBackground,
  useUpdateStickerBookBackground,
} from "@/features/cooking-record-background";

import { useCookingRecordBackground } from "../_components/useCookingRecordBackground";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/entities/recipe", () => ({
  useStickerBookBackgroundsQuery: jest.fn(),
}));
jest.mock("@/features/cooking-record-background", () => ({
  getCustomBackgroundErrorKind: jest.requireActual(
    "@/features/cooking-record-background/model/customBackgroundError"
  ).getCustomBackgroundErrorKind,
  useCreateCustomStickerBookBackground: jest.fn(),
  useDeleteCustomStickerBookBackground: jest.fn(),
  useUpdateStickerBookBackground: jest.fn(),
}));

it("등록한 CUSTOM을 미리보기로 선택하지만 적용 PATCH는 호출하지 않습니다", async () => {
  const backgrounds: StickerBookBackgroundOption[] = [
    {
      backgroundKey: "DEFAULT",
      backgroundType: "PRESET" as const,
      imageUrl: null,
      selected: true,
    },
  ];
  const customBackground = {
    backgroundKey: "C_custom1",
    backgroundType: "CUSTOM" as const,
    imageUrl: "https://cdn.example.com/custom.webp",
  };
  const createCustomBackground = jest.fn(async () => {
    backgrounds.unshift({ ...customBackground, selected: false });
    return customBackground;
  });
  const updateBackground = jest.fn();
  const onCustomAdded = jest.fn();
  jest.mocked(useStickerBookBackgroundsQuery).mockReturnValue({
    data: { items: backgrounds },
    isPending: false,
    isError: false,
    refetch: jest.fn(),
  } as never);
  jest.mocked(useCreateCustomStickerBookBackground).mockReturnValue({
    createCustomBackground,
    reset: jest.fn(),
    isPending: false,
    error: null,
  } as never);
  jest.mocked(useUpdateStickerBookBackground).mockReturnValue({
    mutateAsync: updateBackground,
    isPending: false,
  } as never);
  jest.mocked(useDeleteCustomStickerBookBackground).mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
  } as never);
  const { result, rerender } = renderHook(() =>
    useCookingRecordBackground({
      enabled: true,
      currentBackground: {
        backgroundKey: "DEFAULT",
        backgroundType: "PRESET",
        imageUrl: null,
      },
      onApplied: jest.fn(),
      onError: jest.fn(),
      onCustomAdded,
      onCustomDeleted: jest.fn(),
      onCustomDeleteError: jest.fn(),
    })
  );
  const file = new File(["image"], "custom.jpg", { type: "image/jpeg" });

  await act(async () => {
    await result.current.addCustomBackground(file);
  });
  rerender();

  expect(result.current.selectedBackgroundKey).toBe("C_custom1");
  expect(result.current.previewBackground).toMatchObject(customBackground);
  expect(updateBackground).not.toHaveBeenCalled();
  expect(triggerHaptic).toHaveBeenCalledWith("Success");
  expect(onCustomAdded).toHaveBeenCalledTimes(1);
});

it("커스텀 배경 20개 제한 오류를 복구 가능한 화면 상태로 노출합니다", async () => {
  const limitError = new ApiError(400, "Bad Request", { code: 810 });
  jest.mocked(useStickerBookBackgroundsQuery).mockReturnValue({
    data: { items: [] },
    isPending: false,
    isError: false,
    refetch: jest.fn(),
  } as never);
  jest.mocked(useCreateCustomStickerBookBackground).mockReturnValue({
    createCustomBackground: jest.fn().mockRejectedValue(limitError),
    retryRegistration: jest.fn(),
    reset: jest.fn(),
    isPending: false,
    isImageProcessing: false,
    error: limitError,
  } as never);
  jest.mocked(useUpdateStickerBookBackground).mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
  } as never);
  jest.mocked(useDeleteCustomStickerBookBackground).mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
  } as never);
  const { result } = renderHook(() =>
    useCookingRecordBackground({
      enabled: true,
      currentBackground: null,
      onApplied: jest.fn(),
      onError: jest.fn(),
      onCustomAdded: jest.fn(),
      onCustomDeleted: jest.fn(),
      onCustomDeleteError: jest.fn(),
    })
  );

  await act(async () => {
    await result.current.addCustomBackground(
      new File(["image"], "custom.jpg", { type: "image/jpeg" })
    );
  });

  expect(result.current.customBackgroundErrorKind).toBe("LIMIT_REACHED");
  expect(triggerHaptic).toHaveBeenCalledWith("Error");
});

it("선택한 CUSTOM을 적용하면 해당 backgroundKey로 기존 변경 요청을 보냅니다", async () => {
  const updateBackground = jest.fn().mockResolvedValue({
    backgroundKey: "C_custom1",
    imageUrl: "https://cdn.example.com/custom.webp",
  });
  const onApplied = jest.fn();
  jest.mocked(useStickerBookBackgroundsQuery).mockReturnValue({
    data: {
      items: [
        {
          backgroundKey: "DEFAULT",
          backgroundType: "PRESET",
          imageUrl: null,
          selected: true,
        },
        {
          backgroundKey: "C_custom1",
          backgroundType: "CUSTOM",
          imageUrl: "https://cdn.example.com/custom.webp",
          selected: false,
        },
      ],
    },
    isPending: false,
    isError: false,
    refetch: jest.fn(),
  } as never);
  jest.mocked(useCreateCustomStickerBookBackground).mockReturnValue({
    createCustomBackground: jest.fn(),
    retryRegistration: jest.fn(),
    reset: jest.fn(),
    isPending: false,
    isImageProcessing: false,
    error: null,
  } as never);
  jest.mocked(useUpdateStickerBookBackground).mockReturnValue({
    mutateAsync: updateBackground,
    isPending: false,
  } as never);
  jest.mocked(useDeleteCustomStickerBookBackground).mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
  } as never);
  const { result } = renderHook(() =>
    useCookingRecordBackground({
      enabled: true,
      currentBackground: {
        backgroundKey: "DEFAULT",
        backgroundType: "PRESET",
        imageUrl: null,
      },
      onApplied,
      onError: jest.fn(),
      onCustomAdded: jest.fn(),
      onCustomDeleted: jest.fn(),
      onCustomDeleteError: jest.fn(),
    })
  );

  act(() => result.current.selectBackground("C_custom1"));
  await act(async () => {
    await result.current.apply();
  });

  expect(updateBackground).toHaveBeenCalledWith({
    backgroundKey: "C_custom1",
  });
  expect(triggerHaptic).toHaveBeenCalledWith("Success");
  expect(onApplied).toHaveBeenCalledTimes(1);
});

it("선택한 CUSTOM 삭제를 확인하면 적용 여부와 함께 삭제하고 선택을 초기화합니다", async () => {
  const deleteBackground = jest.fn().mockResolvedValue(undefined);
  const onCustomDeleted = jest.fn();
  jest.mocked(useStickerBookBackgroundsQuery).mockReturnValue({
    data: {
      items: [
        {
          backgroundKey: "C_custom1",
          backgroundType: "CUSTOM",
          imageUrl: "https://cdn.example.com/custom.webp",
          selected: true,
        },
      ],
    },
    isPending: false,
    isError: false,
    refetch: jest.fn(),
  } as never);
  jest.mocked(useCreateCustomStickerBookBackground).mockReturnValue({
    createCustomBackground: jest.fn(),
    retryRegistration: jest.fn(),
    reset: jest.fn(),
    isPending: false,
    isImageProcessing: false,
    error: null,
  } as never);
  jest.mocked(useUpdateStickerBookBackground).mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
  } as never);
  jest.mocked(useDeleteCustomStickerBookBackground).mockReturnValue({
    mutateAsync: deleteBackground,
    isPending: false,
  } as never);
  const { result } = renderHook(() =>
    useCookingRecordBackground({
      enabled: true,
      currentBackground: {
        backgroundKey: "DEFAULT",
        backgroundType: "PRESET",
        imageUrl: null,
      },
      onApplied: jest.fn(),
      onError: jest.fn(),
      onCustomAdded: jest.fn(),
      onCustomDeleted,
      onCustomDeleteError: jest.fn(),
    })
  );

  act(() => result.current.requestDeleteCustomBackground());
  expect(result.current.isDeleteCustomBackgroundOpen).toBe(true);

  await act(async () => {
    await result.current.confirmDeleteCustomBackground();
  });

  expect(deleteBackground).toHaveBeenCalledWith({
    backgroundKey: "C_custom1",
    wasApplied: true,
  });
  expect(result.current.isDeleteCustomBackgroundOpen).toBe(false);
  expect(triggerHaptic).toHaveBeenCalledWith("Success");
  expect(onCustomDeleted).toHaveBeenCalledTimes(1);
});

it("이미 사라진 CUSTOM 삭제 오류면 확인창과 로컬 선택을 정리합니다", async () => {
  const missingError = new ApiError(404, "Not Found", { code: 808 });
  jest.mocked(useStickerBookBackgroundsQuery).mockReturnValue({
    data: {
      items: [
        {
          backgroundKey: "C_missing",
          backgroundType: "CUSTOM",
          imageUrl: "https://cdn.example.com/missing.webp",
          selected: false,
        },
      ],
    },
    isPending: false,
    isError: false,
    refetch: jest.fn(),
  } as never);
  jest.mocked(useCreateCustomStickerBookBackground).mockReturnValue({
    createCustomBackground: jest.fn(),
    retryRegistration: jest.fn(),
    reset: jest.fn(),
    isPending: false,
    isImageProcessing: false,
    error: null,
  } as never);
  jest.mocked(useUpdateStickerBookBackground).mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
  } as never);
  jest.mocked(useDeleteCustomStickerBookBackground).mockReturnValue({
    mutateAsync: jest.fn().mockRejectedValue(missingError),
    isPending: false,
  } as never);
  const { result } = renderHook(() =>
    useCookingRecordBackground({
      enabled: true,
      currentBackground: null,
      onApplied: jest.fn(),
      onError: jest.fn(),
      onCustomAdded: jest.fn(),
      onCustomDeleted: jest.fn(),
      onCustomDeleteError: jest.fn(),
    })
  );

  act(() => result.current.selectBackground("C_missing"));
  act(() => result.current.requestDeleteCustomBackground());
  await act(async () => {
    await result.current.confirmDeleteCustomBackground();
  });

  expect(result.current.isDeleteCustomBackgroundOpen).toBe(false);
  expect(result.current.selectedBackgroundKey).not.toBe("C_missing");
  expect(triggerHaptic).toHaveBeenCalledWith("Error");
});
