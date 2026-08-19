import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import { userPages as enUserPages } from "@/shared/i18n/messages/en/userPages";
import { userPages as jaUserPages } from "@/shared/i18n/messages/ja/userPages";
import { useToastStore } from "@/shared/ui/toast";

import { useUserStore } from "@/entities/user";

import { MonthlyCookingRecordSharePageClient } from "../_components/MonthlyCookingRecordSharePageClient";

const getCookingRecords = jest.fn();
const mockedDownloadImage = jest.fn();
const mockedShareImage = jest.fn();
const mockedUseImage = jest.fn();
const retryImage = jest.fn();
const mockedIsAppWebView = jest.fn();
const mockedRequestNativeImageAction = jest.fn();
const mockedTriggerHaptic = jest.fn();
const mockedCaptureAnalyticsEvent = jest.fn();

jest.mock("@/features/monthly-cooking-record-share", () => {
  const actual = jest.requireActual("@/features/monthly-cooking-record-share");
  return {
    ...actual,
    downloadMonthlyCookingRecordImage: (...args: unknown[]) =>
      mockedDownloadImage(...args),
    shareMonthlyCookingRecordImage: (...args: unknown[]) =>
      mockedShareImage(...args),
    useMonthlyCookingRecordImage: (...args: unknown[]) =>
      mockedUseImage(...args),
  };
});

jest.mock("@/shared/lib/bridge", () => ({
  isAppWebView: () => mockedIsAppWebView(),
  isNativeImageActionUnsupportedError: (error: unknown) =>
    error instanceof Error &&
    error.name === "NativeImageActionUnsupportedError",
  requestNativeImageAction: (...args: unknown[]) =>
    mockedRequestNativeImageAction(...args),
  triggerHaptic: (...args: unknown[]) => mockedTriggerHaptic(...args),
}));

jest.mock("@/shared/lib/analytics", () => ({
  captureAnalyticsEvent: (...args: unknown[]) =>
    mockedCaptureAnalyticsEvent(...args),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/calendar/timeline/share",
  useSearchParams: () => new URLSearchParams("month=2026-08"),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("@/entities/recipe/model/recordApi", () => ({
  getCookingRecords: (...args: unknown[]) => getCookingRecords(...args),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => ({
  useResponsiveSheet: () => ({
    isMobile: true,
    Container: ({ children, open }: { children: ReactNode; open: boolean }) =>
      open ? <div>{children}</div> : null,
    Content: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Header: ({ children }: { children: ReactNode }) => (
      <header>{children}</header>
    ),
    Title: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
    Description: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "MonthlyCookingRecordShareTestWrapper";
  return Wrapper;
};

describe("MonthlyCookingRecordSharePageClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsAppWebView.mockReturnValue(false);
    mockedRequestNativeImageAction.mockResolvedValue({
      v: 1,
      actionId: "action-1",
      action: "saveImage",
      status: "saved",
    });
    useToastStore.setState({ toastList: [] });
    useUserStore.setState({ isAuthReady: true, isAuthenticated: true });
    mockedUseImage.mockReturnValue({
      captureRef: jest.fn(),
      status: "ready",
      blob: new Blob(["png"], { type: "image/png" }),
      error: null,
      retry: retryImage,
    });
    mockedShareImage.mockResolvedValue("shared");
    getCookingRecords.mockResolvedValue({
      background: {
        backgroundKey: "PAPER_BEIGE",
        backgroundType: "PRESET",
        imageUrl: "/backgrounds/paper-beige.webp",
      },
      groups: [
        {
          date: "2026-08-18",
          records: [
            {
              recordId: "record-1",
              recipeId: "recipe-1",
              displayTitle: "동파육",
              ingredientCost: 8_000,
              marketPrice: 25_000,
              nutrition: null,
              calories: null,
              imageUrl: "/records/original.webp",
              visibility: "PRIVATE",
              stickerImageUrl: "/records/sticker.webp",
              stickerStatus: "READY",
              cookedAt: "2026-08-18T12:00:00+09:00",
              createdAt: "2026-08-18T12:00:00+09:00",
              sourceType: "RECIPE",
              reviewId: null,
              recipeAvailable: true,
              savings: 17_000,
              isRemix: false,
            },
          ],
        },
      ],
      hasNext: false,
    });
  });

  it("성과 수치 없이 선택 월의 1대1 스티커북을 보여줍니다", async () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <MonthlyCookingRecordSharePageClient />
      </Wrapper>
    );

    const card = await screen.findByRole("img", {
      name: "2026년 8월 요리 기록 공유 이미지",
    });
    expect(within(card).getByText("2026년 8월")).toBeInTheDocument();
    expect(within(card).getByText("1개의 요리")).toBeInTheDocument();
    expect(within(card).getByText("RECIPIO")).toHaveClass("text-xs");
    expect(within(card).queryByText("아낀 금액")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "이미지 저장" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "공유하기" })
    ).toBeInTheDocument();
  });

  it("선택 월에 기록이 없으면 공유할 이미지가 없다고 안내합니다", async () => {
    getCookingRecords.mockResolvedValueOnce({
      background: null,
      groups: [],
      hasNext: false,
    });
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <MonthlyCookingRecordSharePageClient />
      </Wrapper>
    );

    expect(
      await screen.findByRole("heading", { name: "공유할 요리 기록이 없어요" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "이미지 저장" })
    ).not.toBeInTheDocument();
  });

  it("준비된 이미지를 저장하거나 OS 공유로 전달합니다", async () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <MonthlyCookingRecordSharePageClient />
      </Wrapper>
    );
    await screen.findByRole("img", {
      name: "2026년 8월 요리 기록 공유 이미지",
    });

    fireEvent.click(screen.getByRole("button", { name: "이미지 저장" }));
    fireEvent.click(screen.getByRole("button", { name: "공유하기" }));

    expect(mockedDownloadImage).toHaveBeenCalledWith(
      expect.any(Blob),
      "2026-08"
    );
    await waitFor(() =>
      expect(mockedShareImage).toHaveBeenCalledWith(
        expect.objectContaining({
          blob: expect.any(Blob),
          monthKey: "2026-08",
        })
      )
    );
  });

  it("이미지 생성에 실패하면 하단 액션 대신 다시 만들기를 제공합니다", async () => {
    mockedUseImage.mockReturnValue({
      captureRef: jest.fn(),
      status: "error",
      blob: null,
      error: new Error("capture failed"),
      retry: retryImage,
    });
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <MonthlyCookingRecordSharePageClient />
      </Wrapper>
    );

    await screen.findByRole("img", {
      name: "2026년 8월 요리 기록 공유 이미지",
    });
    expect(screen.getByText("이미지를 만들지 못했어요.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "이미지 다시 만들기" }));

    expect(retryImage).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: "공유하기" })
    ).not.toBeInTheDocument();
  });

  it("한국어 공유 화면은 기록 완성과 저장·공유 행동을 안내합니다", async () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <MonthlyCookingRecordSharePageClient />
      </Wrapper>
    );

    expect(
      await screen.findByText("이번 달 요리 기록이 완성됐어요")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "직접 만든 요리를 한 장의 이미지로 저장하거나 공유해보세요."
      )
    ).toBeInTheDocument();
  });

  it("영어와 일본어 공유 문구는 기존 값을 유지합니다", () => {
    expect(enUserPages.calendar.cookingRecord.share.lead).toBe(
      "Your month of cooking, in one image"
    );
    expect(jaUserPages.calendar.cookingRecord.share.lead).toBe(
      "今月の料理を一枚にまとめました"
    );
  });

  it("WebView 이미지 저장은 현재 PNG를 네이티브 saveImage 작업으로 보냅니다", async () => {
    mockedIsAppWebView.mockReturnValue(true);
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <MonthlyCookingRecordSharePageClient />
      </Wrapper>
    );

    fireEvent.click(await screen.findByRole("button", { name: "이미지 저장" }));

    await waitFor(() =>
      expect(mockedRequestNativeImageAction).toHaveBeenCalledWith({
        action: "saveImage",
        blob: expect.any(Blob),
        fileName: "recipio-cooking-record-2026-08.png",
      })
    );
    expect(mockedDownloadImage).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(useToastStore.getState().toastList).toEqual([
        expect.objectContaining({
          message: "요리 기록 이미지를 저장했습니다.",
          variant: "success",
        }),
      ])
    );
    expect(mockedTriggerHaptic).toHaveBeenCalledTimes(1);
    expect(mockedTriggerHaptic).toHaveBeenCalledWith("Success");
    expect(mockedCaptureAnalyticsEvent).toHaveBeenCalledWith(
      "monthly_share_native_action_diagnostic",
      {
        action: "saveImage",
        blobSize: 3,
        captureVersion: 1,
        status: "saved",
      }
    );
  });

  it("구버전 WebView는 저장 성공으로 표시하지 않고 앱 업데이트를 안내합니다", async () => {
    mockedIsAppWebView.mockReturnValue(true);
    const unsupportedError = new Error("unsupported");
    unsupportedError.name = "NativeImageActionUnsupportedError";
    mockedRequestNativeImageAction.mockRejectedValueOnce(unsupportedError);
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <MonthlyCookingRecordSharePageClient />
      </Wrapper>
    );

    fireEvent.click(await screen.findByRole("button", { name: "이미지 저장" }));

    await waitFor(() =>
      expect(useToastStore.getState().toastList).toEqual([
        expect.objectContaining({
          message: "이미지를 저장하거나 공유하려면 앱을 업데이트해 주세요.",
          variant: "error",
        }),
      ])
    );
    expect(mockedDownloadImage).not.toHaveBeenCalled();
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
  });

  it("WebView 공유는 PNG 네이티브 작업만 요청하고 완료 안내를 추정하지 않습니다", async () => {
    mockedIsAppWebView.mockReturnValue(true);
    mockedRequestNativeImageAction.mockResolvedValueOnce({
      v: 1,
      actionId: "action-2",
      action: "shareImage",
      status: "presented",
    });
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <MonthlyCookingRecordSharePageClient />
      </Wrapper>
    );

    fireEvent.click(await screen.findByRole("button", { name: "공유하기" }));

    await waitFor(() =>
      expect(mockedRequestNativeImageAction).toHaveBeenCalledWith({
        action: "shareImage",
        blob: expect.any(Blob),
        fileName: "recipio-cooking-record-2026-08.png",
      })
    );
    expect(mockedShareImage).not.toHaveBeenCalled();
    expect(mockedDownloadImage).not.toHaveBeenCalled();
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
    expect(useToastStore.getState().toastList).toHaveLength(0);
    expect(mockedCaptureAnalyticsEvent).toHaveBeenCalledWith(
      "monthly_share_native_action_diagnostic",
      {
        action: "shareImage",
        blobSize: 3,
        captureVersion: 1,
        status: "presented",
      }
    );
  });

  it("WebView 공유 실패는 다운로드로 바꾸지 않고 재시도 가능한 오류를 안내합니다", async () => {
    mockedIsAppWebView.mockReturnValue(true);
    mockedRequestNativeImageAction.mockRejectedValueOnce(
      new Error("share failed")
    );
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <MonthlyCookingRecordSharePageClient />
      </Wrapper>
    );

    fireEvent.click(await screen.findByRole("button", { name: "공유하기" }));

    await waitFor(() =>
      expect(useToastStore.getState().toastList).toEqual([
        expect.objectContaining({
          message: "이미지를 처리하지 못했습니다. 다시 시도해 주세요.",
          variant: "error",
        }),
      ])
    );
    expect(mockedDownloadImage).not.toHaveBeenCalled();
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
    expect(mockedCaptureAnalyticsEvent).toHaveBeenCalledWith(
      "monthly_share_native_action_diagnostic",
      {
        action: "shareImage",
        blobSize: 3,
        captureVersion: 1,
        errorName: "Error",
        status: "failed",
      }
    );
  });
});
