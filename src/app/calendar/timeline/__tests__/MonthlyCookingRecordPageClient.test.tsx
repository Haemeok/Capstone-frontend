import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { useUserStore } from "@/entities/user";

import { useLoginEncourageDrawerStore } from "@/features/auth/ui/LoginEncourageDrawer/model/store";

import { MonthlyCookingRecordPageClient } from "../_components/MonthlyCookingRecordPageClient";

const replace = jest.fn();
const push = jest.fn();
const getCookingRecords = jest.fn();
const getStickerBookBackgrounds = jest.fn();
const updateStickerBookBackground = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/calendar/timeline",
  useSearchParams: () => new URLSearchParams("month=2026-08"),
  useRouter: () => ({
    push,
    replace,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/features/cooking-record-create", () => ({
  ManualCookingRecordDrawer: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>수동 기록 폼</div> : null,
}));

jest.mock("@/entities/recipe/model/recordApi", () => ({
  getCookingRecords: (...args: unknown[]) => getCookingRecords(...args),
  getCookingRecord: jest.fn(),
  getStickerBookBackgrounds: (...args: unknown[]) =>
    getStickerBookBackgrounds(...args),
}));

jest.mock("@/features/cooking-record-background/model/api", () => ({
  updateStickerBookBackground: (...args: unknown[]) =>
    updateStickerBookBackground(...args),
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

const makeRecord = (recordId: string, title: string, imageUrl: string) => ({
  recordId,
  recipeId: `recipe-${recordId}`,
  displayTitle: title,
  ingredientCost: null,
  marketPrice: null,
  nutrition: null,
  calories: null,
  imageUrl,
  visibility: null,
  stickerImageUrl: imageUrl,
  stickerStatus: "READY" as const,
  cookedAt: null,
  createdAt: "2026-08-11T12:00:00+09:00",
  sourceType: "RECIPE" as const,
  reviewId: null,
  recipeAvailable: true,
  savings: null,
  isRemix: null,
});

describe("MonthlyCookingRecordPageClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ isAuthReady: true, isAuthenticated: true });
    useLoginEncourageDrawerStore.setState({ isOpen: false });
    getCookingRecords.mockResolvedValue({
      background: {
        backgroundKey: "PAPER_BEIGE",
        imageUrl: "/backgrounds/paper-beige.webp",
      },
      groups: [
        {
          date: "2026-08-11",
          records: [makeRecord("august", "동파육", "/august.webp")],
        },
        {
          date: "2026-07-20",
          records: [makeRecord("july", "냉면", "/july.webp")],
        },
      ],
      hasNext: false,
    });
    getStickerBookBackgrounds.mockResolvedValue({
      items: [
        { backgroundKey: "DEFAULT", imageUrl: null, selected: true },
        {
          backgroundKey: "PAPER_BEIGE",
          imageUrl: "/backgrounds/paper-beige.webp",
          selected: false,
        },
      ],
    });
    updateStickerBookBackground.mockResolvedValue({
      backgroundKey: "PAPER_BEIGE",
      imageUrl: "/backgrounds/paper-beige.webp",
    });
  });

  it("month 쿼리에 해당하는 이미지 스티커만 월별 보드에 보여줍니다", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );

    expect(
      await screen.findByRole("img", { name: "동파육" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "냉면" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "2026년 8월" })
    ).toBeInTheDocument();
  });

  it("완성된 월간 성과를 보여주고 선택 월을 유지한 공유 페이지로 이동합니다", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );

    expect(
      await screen.findByRole("heading", {
        level: 2,
        name: "이번 달 1번 요리했어요",
      })
    ).toBeInTheDocument();
    expect(screen.getByText("1일")).toBeInTheDocument();
    expect(screen.getByText("1가지")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "2026년 8월 요리 기록 공유" })
    );

    expect(push).toHaveBeenCalledWith(
      "/calendar/timeline/share?month=2026-08",
      undefined
    );
  });

  it("기록 목록이 반환한 전역 배경을 기록판에 표시합니다", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );

    await screen.findByRole("img", { name: "동파육" });

    expect(
      container.querySelector('img[src="/backgrounds/paper-beige.webp"]')
    ).toBeInTheDocument();
  });

  it("다음 달을 누르면 locale을 보존하는 month 쿼리로 이동합니다", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );
    await screen.findByRole("img", { name: "동파육" });

    fireEvent.click(screen.getByRole("button", { name: "다음 달" }));

    expect(replace).toHaveBeenCalledWith(
      "/calendar/timeline?month=2026-09",
      undefined
    );
  });

  it("인증 확인이 끝난 비회원에게는 로딩 대신 로그인 안내를 보여줍니다", () => {
    useUserStore.setState({ isAuthReady: true, isAuthenticated: false });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );

    expect(
      screen.getByText("로그인하고 요리 기록을 모아보세요.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("요리 기록을 불러오는 중입니다.")
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "2026년 8월 요리 기록 공유" })
    );
    expect(useLoginEncourageDrawerStore.getState().isOpen).toBe(true);
    expect(push).not.toHaveBeenCalled();
  });

  it("요리 기록 추가 버튼을 누르면 검색 페이지 대신 수동 기록 폼을 엽니다", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );
    await screen.findByRole("img", { name: "동파육" });

    fireEvent.click(screen.getByRole("button", { name: "요리 기록 추가" }));

    expect(screen.getByText("수동 기록 폼")).toBeInTheDocument();
  });

  it("기록이 없는 달은 0회 성과와 공유를 숨기고 배경 위 안내와 추가 버튼만 보여줍니다", async () => {
    getCookingRecords.mockResolvedValue({
      background: {
        backgroundKey: "PAPER_BEIGE",
        imageUrl: "/backgrounds/paper-beige.webp",
      },
      groups: [],
      hasNext: false,
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );

    const emptyTitle = await screen.findByText("아직 이달의 요리가 없습니다.");
    expect(
      screen.queryByText("이번 달 0번 요리했어요")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("0개의 요리")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "2026년 8월 요리 기록 공유" })
    ).not.toBeInTheDocument();
    expect(emptyTitle.parentElement).toHaveClass("bg-white/88", "rounded-card");
    expect(
      screen.getByRole("button", { name: "요리 기록 추가" })
    ).toBeInTheDocument();
  });

  it("배경 선택창을 열 때 서버 목록을 조회하고 선택한 전역 배경을 적용합니다", async () => {
    getCookingRecords.mockResolvedValueOnce({
      background: { backgroundKey: "DEFAULT", imageUrl: null },
      groups: [
        {
          date: "2026-08-11",
          records: [makeRecord("august", "동파육", "/august.webp")],
        },
      ],
      hasNext: false,
    });
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );
    await screen.findByRole("img", { name: "동파육" });

    expect(getStickerBookBackgrounds).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "배경 바꾸기" }));

    const secondBackground = await screen.findByRole("button", {
      name: "배경 2",
    });
    expect(getStickerBookBackgrounds).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText("내 사진으로 배경 만들기")
    ).not.toBeInTheDocument();

    fireEvent.click(secondBackground);
    fireEvent.click(screen.getByRole("button", { name: "이 배경 적용" }));

    await waitFor(() =>
      expect(updateStickerBookBackground).toHaveBeenCalledWith({
        backgroundKey: "PAPER_BEIGE",
      })
    );
    await waitFor(() =>
      expect(
        container.querySelector('img[src="/backgrounds/paper-beige.webp"]')
      ).toBeInTheDocument()
    );
  });
});
