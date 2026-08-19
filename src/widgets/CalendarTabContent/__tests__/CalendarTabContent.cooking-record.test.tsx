import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";

import type {
  CookingRecordCalendarMonthResponse,
  CookingRecordListItem,
  CookingRecordListResponse,
} from "@/entities/recipe";
import { useUserStore } from "@/entities/user";
import { getUserStreak } from "@/entities/user/model/api";

import CalendarTabContent from "../index";

const getCookingRecords = jest.fn<Promise<CookingRecordListResponse>, []>();
const getCookingRecordCalendarMonth = jest.fn<
  Promise<CookingRecordCalendarMonthResponse>,
  []
>();
const getRecipeHistory = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/shared/lib/gsap", () => ({
  gsap: {
    context: (callback: () => void) => {
      callback();
      return { revert: jest.fn() };
    },
    to: jest.fn(),
    fromTo: jest.fn(),
    set: jest.fn(),
  },
  ScrollTrigger: { create: jest.fn(), refresh: jest.fn() },
}));

jest.mock("@/shared/hooks/useScrollAnimate", () => () => ({
  targetRef: { current: null },
  playAnimation: jest.fn(),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock("@/widgets/MonthlySavingsSummary", () => ({
  __esModule: true,
  default: () => <div>절약했어요</div>,
}));

jest.mock("@/features/cooking-record-create", () => ({
  ManualCookingRecordDrawer: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div role="dialog">요리 기록 추가 드로어</div> : null,
}));

jest.mock("@/entities/recipe/model/recordApi", () => ({
  getCookingRecords: () => getCookingRecords(),
  getCookingRecordCalendarMonth: () => getCookingRecordCalendarMonth(),
}));

jest.mock("@/entities/recipe/model/api", () => ({
  ...jest.requireActual("@/entities/recipe/model/api"),
  getRecipeHistory: () => getRecipeHistory(),
}));

jest.mock("@/entities/user/model/api", () => ({
  ...jest.requireActual("@/entities/user/model/api"),
  getUserStreak: jest.fn(),
}));

const mockedGetUserStreak = jest.mocked(getUserStreak);

const makeRecord = (index: number): CookingRecordListItem => ({
  recordId: `record-${index}`,
  recipeId: `recipe-${index}`,
  displayTitle: index === 0 ? "동파육" : `요리 ${index + 1}`,
  ingredientCost: null,
  marketPrice: null,
  nutrition: null,
  calories: null,
  imageUrl: `/original-${index}.webp`,
  visibility: null,
  stickerImageUrl: `/sticker-${index}.webp`,
  stickerStatus: "READY",
  cookedAt: "2026-08-17T18:00:00+09:00",
  createdAt: "2026-08-17T18:00:00+09:00",
  sourceType: "RECIPE",
  reviewId: null,
  recipeAvailable: true,
  savings: null,
  isRemix: false,
});

const makeRecordPage = (count: number): CookingRecordListResponse => ({
  background: null,
  groups:
    count === 0
      ? []
      : [
          {
            date: "2026-08-17",
            records: Array.from({ length: count }, (_, index) =>
              makeRecord(index)
            ),
          },
        ],
  hasNext: false,
});

const makeCalendarMonth = (
  count: number
): CookingRecordCalendarMonthResponse => ({
  dailySummaries:
    count === 0
      ? []
      : [
          {
            date: "2026-08-17",
            totalSavings: 0,
            totalCount: count,
            firstImageUrl: "/sticker-0.webp",
          },
        ],
  monthlyTotalSavings: 0,
});

const renderCalendarTab = (pathname = "/users/u1") => {
  (usePathname as jest.Mock).mockReturnValue(pathname);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return render(<CalendarTabContent />, { wrapper: Wrapper });
};

describe("CalendarTabContent cooking record preview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({
      isAuthReady: true,
      isAuthenticated: true,
    });
    getCookingRecords.mockResolvedValue(makeRecordPage(8));
    getCookingRecordCalendarMonth.mockResolvedValue(makeCalendarMonth(8));
    getRecipeHistory.mockResolvedValue(makeCalendarMonth(8));
    mockedGetUserStreak.mockResolvedValue({ streak: 0, cookedToday: false });
  });

  it("T-01 기록 8개 중 스티커 미리보기 7개를 날짜별 기록보다 먼저 보여줍니다", async () => {
    renderCalendarTab();

    expect(
      await screen.findByRole("heading", {
        name: "이번 달 8번 요리했어요",
      })
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId("cooking-record-preview-sticker")
    ).toHaveLength(7);
    expect(screen.queryByText("8개의 요리")).not.toBeInTheDocument();
    expect(screen.queryByText(/절약했어요/)).not.toBeInTheDocument();
    expect(screen.getByText("날짜별 기록")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "기록" })).toBeInTheDocument();
  });

  it("T-02 기록이 하나면 한 스티커와 같은 날짜의 캘린더 기록을 보여줍니다", async () => {
    getCookingRecords.mockResolvedValue(makeRecordPage(1));
    getCookingRecordCalendarMonth.mockResolvedValue(makeCalendarMonth(1));
    getRecipeHistory.mockResolvedValue(makeCalendarMonth(1));

    renderCalendarTab();

    expect(await screen.findByText("동파육")).toBeInTheDocument();
    expect(
      screen.getAllByTestId("cooking-record-preview-sticker")
    ).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "2026-08-17 요리 기록" })
    ).toBeInTheDocument();
  });

  it("T-03 달력의 월을 바꾸면 같은 월의 스티커 미리보기를 보여줍니다", async () => {
    getCookingRecords.mockResolvedValue({
      background: null,
      groups: [
        { date: "2026-08-17", records: [makeRecord(0)] },
        {
          date: "2026-07-20",
          records: [
            { ...makeRecord(1), displayTitle: "가지볶음" },
            { ...makeRecord(2), displayTitle: "된장찌개" },
          ],
        },
      ],
      hasNext: false,
    });

    renderCalendarTab();
    expect(await screen.findByText("동파육")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Go to the Previous Month" })
    );

    expect(
      await screen.findByRole("heading", { name: "7월에 2번 요리했어요" })
    ).toBeInTheDocument();
    expect(screen.getByText("가지볶음")).toBeInTheDocument();
  });

  it("T-04 스티커 미리보기 조회가 실패해도 날짜별 기록은 유지합니다", async () => {
    getCookingRecords.mockRejectedValue(new Error("record list failed"));
    getCookingRecordCalendarMonth.mockResolvedValue(makeCalendarMonth(1));

    renderCalendarTab();

    expect(
      await screen.findByText("요리 기록을 불러오지 못했습니다.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "2026-08-17 요리 기록" })
    ).toBeInTheDocument();
  });

  it("T-05 빈 달에서는 바로 요리 기록 추가 드로어를 열 수 있습니다", async () => {
    getCookingRecords.mockResolvedValue(makeRecordPage(0));
    getCookingRecordCalendarMonth.mockResolvedValue(makeCalendarMonth(0));

    renderCalendarTab();

    expect(
      await screen.findByRole("heading", { name: "이번 달 0번 요리했어요" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "전체보기" })).toHaveClass(
      "text-sm"
    );
    expect(screen.getByText("8월에 만든 요리들을 모아봤어요.")).toHaveClass(
      "text-sm"
    );
    const recordBoard = screen.getByRole("region", { name: "8월 요리 기록" });
    expect(
      within(recordBoard).queryByText("8월 요리 기록")
    ).not.toBeInTheDocument();
    expect(
      within(recordBoard).queryByText("0개의 요리")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("아직 이달의 요리가 없습니다.").parentElement
    ).toHaveClass("p-5");

    fireEvent.click(
      await screen.findByRole("button", { name: "요리 기록 추가" })
    );

    expect(screen.getByRole("dialog")).toHaveTextContent(
      "요리 기록 추가 드로어"
    );
  });

  it("T-06 프로필 요리 기록에 서버에서 선택한 배경을 적용합니다", async () => {
    getCookingRecords.mockResolvedValue({
      ...makeRecordPage(1),
      background: {
        backgroundKey: "WOOD",
        imageUrl: "/backgrounds/wood.webp",
      },
    });

    renderCalendarTab();

    const backgroundLayer = await screen.findByTestId(
      "profile-cooking-record-background-layer"
    );
    expect(backgroundLayer.querySelector("img")).toHaveAttribute(
      "src",
      "/backgrounds/wood.webp"
    );
    expect(screen.queryByText("8월 요리 기록")).not.toBeInTheDocument();
    expect(screen.queryByText("1개의 요리")).not.toBeInTheDocument();
  });
});
