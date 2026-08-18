import type { CSSProperties, RefObject } from "react";

import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { triggerHaptic } from "@/shared/lib/bridge";
import { ScrollContext } from "@/shared/lib/ScrollContext";

import type {
  CookingRecordCalendarDateItem,
  CookingRecordDetailResponse,
} from "@/entities/recipe";
import {
  useCookingRecordCalendarDateQuery,
  useCookingRecordDetailQuery,
} from "@/entities/recipe";
import { useUserStore } from "@/entities/user";

import CalendarDetailPage from "./page";

let mockPathname = "/calendar/2026-08-17";
const mockBack = jest.fn();
const mockRefetch = jest.fn();
const mockScrollIntoView = jest.fn();
let scrollContainer: HTMLDivElement;
let animationFrames: Map<number, FrameRequestCallback>;
let nextAnimationFrameId: number;

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  writable: true,
  value: mockScrollIntoView,
});

Object.defineProperty(window, "requestAnimationFrame", {
  configurable: true,
  writable: true,
  value: (callback: FrameRequestCallback) => {
    const frameId = nextAnimationFrameId;
    nextAnimationFrameId += 1;
    animationFrames.set(frameId, callback);
    return frameId;
  },
});

Object.defineProperty(window, "cancelAnimationFrame", {
  configurable: true,
  writable: true,
  value: (frameId: number) => {
    animationFrames.delete(frameId);
  },
});

jest.mock("next/navigation", () => ({
  useParams: () => ({ date: "2026-08-17" }),
  usePathname: () => mockPathname,
  useRouter: () => ({
    back: mockBack,
    push: jest.fn(),
    replace: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("@/entities/recipe", () => ({
  useCookingRecordCalendarDateQuery: jest.fn(),
  useCookingRecordDetailQuery: jest.fn(),
}));

jest.mock("@/entities/recipe/model/hooks", () => ({
  useRecipeHistoryItemsQuery: () => ({ data: [] }),
}));

jest.mock("@/shared/lib/bridge", () => ({
  ...jest.requireActual("@/shared/lib/bridge"),
  triggerHaptic: jest.fn(),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({
    src,
    alt,
    aspectRatio,
    wrapperClassName,
  }: {
    src: string;
    alt: string;
    aspectRatio?: string;
    wrapperClassName?: string;
  }) => (
    <div className={wrapperClassName} style={{ aspectRatio } as CSSProperties}>
      <img src={src} alt={alt} />
    </div>
  ),
}));

jest.mock("@/shared/ui/toast/model/store", () => ({
  useToastStore: () => ({ addToast: jest.fn() }),
}));

jest.mock("@/features/auth/ui/LoginEncourageDrawer/model/store", () => ({
  useLoginEncourageDrawerStore: (
    selector: (state: { openDrawer: jest.Mock }) => unknown
  ) => selector({ openDrawer: jest.fn() }),
}));

const mockedUseDateQuery = jest.mocked(useCookingRecordCalendarDateQuery);
const mockedUseDetailQuery = jest.mocked(useCookingRecordDetailQuery);
const mockedTriggerHaptic = jest.mocked(triggerHaptic);

const createDateRecord = (
  overrides: Partial<CookingRecordCalendarDateItem> = {}
): CookingRecordCalendarDateItem => ({
  recordId: "record-dongporou",
  recipeId: "recipe-dongporou",
  displayTitle: "청경채 동파육",
  originalImageUrl: "/records/dongporou.webp",
  savings: 13200,
  ingredientCost: 8800,
  marketPrice: 22000,
  nutrition: { carbohydrate: 48, protein: 42, fat: 38, sodium: 890, sugar: 8 },
  calories: 720,
  visibility: "PUBLIC",
  isRemix: false,
  cookedAt: "2026-08-17T12:00:00+09:00",
  sourceType: "RECIPE",
  ...overrides,
});

const createDetail = (
  record: CookingRecordCalendarDateItem,
  recordMemo: string | null
): CookingRecordDetailResponse => ({
  recordId: record.recordId,
  recipeId: record.recipeId,
  displayTitle: record.displayTitle,
  recordMemo,
  originalImageUrl: record.originalImageUrl,
  stickerImageUrl: null,
  stickerStatus: "NONE",
  cookedAt: record.cookedAt,
  sourceType: record.sourceType,
  reviewId: null,
  recipeAvailable: record.recipeId !== null,
  ingredientCost: record.ingredientCost,
  marketPrice: record.marketPrice,
  nutrition: record.nutrition,
  calories: record.calories,
  savings: record.savings,
  visibility: record.visibility,
  isRemix: record.isRemix,
  createdAt: "2026-08-17T13:00:00+09:00",
});

const threeRecords = [
  createDateRecord(),
  createDateRecord({
    recordId: "record-fried-rice",
    recipeId: "recipe-fried-rice",
    displayTitle: "대파 계란볶음밥",
    originalImageUrl: "/records/fried-rice.webp",
    savings: 8400,
    ingredientCost: 3600,
    marketPrice: 12000,
    nutrition: {
      carbohydrate: 76,
      protein: 19,
      fat: 17,
      sodium: 610,
      sugar: 6,
    },
    calories: 540,
  }),
  createDateRecord({
    recordId: "record-eggplant",
    recipeId: "recipe-eggplant",
    displayTitle: "가지 튀김 덮밥",
    originalImageUrl: "/records/eggplant.webp",
    savings: 8800,
    ingredientCost: 2200,
    marketPrice: 11000,
    nutrition: {
      carbohydrate: 71,
      protein: 16,
      fat: 29,
      sodium: 740,
      sugar: 9,
    },
    calories: 610,
  }),
];

const setDateQuery = ({
  data = threeRecords,
  isPending = false,
  isError = false,
}: {
  data?: CookingRecordCalendarDateItem[];
  isPending?: boolean;
  isError?: boolean;
} = {}) => {
  mockedUseDateQuery.mockReturnValue({
    data,
    isPending,
    isError,
    refetch: mockRefetch,
  } as unknown as ReturnType<typeof useCookingRecordCalendarDateQuery>);
};

const setDetails = (memos: Record<string, string | null> = {}) => {
  mockedUseDetailQuery.mockImplementation(({ recordId }) => {
    const record = threeRecords.find((item) => item.recordId === recordId);
    return {
      data: record ? createDetail(record, memos[recordId] ?? null) : undefined,
      isError: false,
      isPending: false,
    } as ReturnType<typeof useCookingRecordDetailQuery>;
  });
};

const renderPage = (): ReturnType<typeof render> => {
  scrollContainer = document.createElement("div");
  const motionRef = {
    current: scrollContainer,
  } as RefObject<HTMLDivElement | null>;

  return render(
    <ScrollContext.Provider value={{ motionRef }}>
      <CalendarDetailPage />
    </ScrollContext.Provider>
  );
};

const createRect = (top: number, height: number): DOMRect => ({
  x: 0,
  y: top,
  top,
  right: 390,
  bottom: top + height,
  left: 0,
  width: 390,
  height,
  toJSON: () => ({}),
});

const setRecordLayout = () => {
  const recordTops = new Map([
    ["record-dongporou", 300],
    ["record-fried-rice", 600],
    ["record-eggplant", 900],
  ]);

  Object.defineProperties(scrollContainer, {
    clientHeight: { configurable: true, value: 800 },
    scrollHeight: { configurable: true, value: 1600 },
  });
  jest
    .spyOn(scrollContainer, "getBoundingClientRect")
    .mockImplementation(() => createRect(0, 800));

  for (const [recordId, contentTop] of recordTops) {
    const element = document.querySelector(`[data-record-id="${recordId}"]`);
    if (!(element instanceof HTMLElement)) {
      throw new Error(`${recordId} 기록 요소가 없습니다.`);
    }
    jest
      .spyOn(element, "getBoundingClientRect")
      .mockImplementation(() =>
        createRect(contentTop - scrollContainer.scrollTop, 240)
      );
  }
};

const runAnimationFrame = (timestamp: number) => {
  const callbacks = Array.from(animationFrames.values());
  animationFrames.clear();
  callbacks.forEach((callback) => callback(timestamp));
};

describe("CalendarDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    animationFrames = new Map();
    nextAnimationFrameId = 1;
    mockPathname = "/calendar/2026-08-17";
    useUserStore.setState({ isAuthReady: true, isAuthenticated: true });
    setDateQuery();
    setDetails();
  });

  it("T-01 날짜 제목과 기록 순서를 표시하고 실제 요리 시각은 노출하지 않습니다", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: "8월 17일 월요일" })
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("article")
        .map((item) => item.getAttribute("aria-label"))
    ).toEqual([
      "청경채 동파육 요리 기록",
      "대파 계란볶음밥 요리 기록",
      "가지 튀김 덮밥 요리 기록",
    ]);
    expect(screen.getByText("1번째 요리")).toBeInTheDocument();
    expect(screen.getByText("720 kcal")).toBeInTheDocument();
    expect(screen.queryByText(/12:00|오전 12|오후 12/)).not.toBeInTheDocument();

    const image = screen.getByRole("img", { name: "청경채 동파육" });
    expect(image.parentElement).toHaveClass("rounded-xl");
    expect(image.parentElement).toHaveStyle({ aspectRatio: "1 / 1" });
  });

  it("T-02 날짜 조회 중에는 합계 0 대신 로딩 상태를 표시합니다", () => {
    setDateQuery({ data: [], isPending: true });

    renderPage();

    expect(screen.getByRole("status")).toHaveTextContent(
      "요리 기록을 불러오는 중입니다."
    );
    expect(screen.queryByText("0 kcal")).not.toBeInTheDocument();
  });

  it("T-03 날짜 조회 실패 상태에서 다시 시도할 수 있습니다", async () => {
    const user = userEvent.setup();
    setDateQuery({ data: [], isError: true });

    renderPage();
    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(
      screen.getByText("요리 기록을 불러오지 못했습니다.")
    ).toBeInTheDocument();
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("T-04 기록이 없는 날에는 빈 상태만 표시합니다", () => {
    setDateQuery({ data: [] });

    renderPage();

    expect(
      screen.getByText("이날은 아직 요리 기록이 없습니다.")
    ).toBeInTheDocument();
    expect(screen.queryByText("오늘의 요리 요약")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "요리 기록 이동" })
    ).not.toBeInTheDocument();
  });

  it("T-05 인증 확인 전과 로그아웃 상태에서는 날짜 조회를 활성화하지 않습니다", () => {
    useUserStore.setState({ isAuthReady: false, isAuthenticated: false });

    renderPage();

    expect(screen.getByRole("status")).toHaveTextContent(
      "로그인 상태를 확인하는 중입니다."
    );
    expect(mockedUseDateQuery).toHaveBeenLastCalledWith({
      date: "2026-08-17",
      enabled: false,
    });

    act(() => {
      useUserStore.setState({ isAuthReady: true, isAuthenticated: false });
    });

    expect(
      screen.getByText("로그인하고 이날의 요리를 확인해보세요.")
    ).toBeInTheDocument();
    expect(mockedUseDateQuery).toHaveBeenLastCalledWith({
      date: "2026-08-17",
      enabled: false,
    });
  });

  it("T-06 사진과 영양이 null인 기록은 0 수치 없이 안전하게 표시합니다", () => {
    setDateQuery({
      data: [
        createDateRecord({
          originalImageUrl: null,
          calories: null,
          nutrition: null,
        }),
      ],
    });

    renderPage();

    expect(
      screen.getByRole("img", { name: "청경채 동파육 사진 없음" })
    ).toBeInTheDocument();
    expect(screen.queryByText("0 kcal")).not.toBeInTheDocument();
    expect(screen.queryByText("탄수 0g")).not.toBeInTheDocument();
  });

  it("T-20 계산 가능한 값이 없는 MANUAL 기록만 있으면 요약을 숨기고 사진은 표시합니다", () => {
    setDateQuery({
      data: [
        createDateRecord({
          recordId: "manual-cookie",
          recipeId: null,
          displayTitle: "쿠키",
          originalImageUrl: "/records/cookie.webp",
          savings: null,
          ingredientCost: null,
          marketPrice: null,
          nutrition: null,
          calories: null,
          visibility: null,
          isRemix: false,
          sourceType: "MANUAL",
        }),
      ],
    });

    renderPage();

    expect(screen.getByRole("img", { name: "쿠키" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "오늘의 요리 요약" })
    ).not.toBeInTheDocument();
  });

  it("T-07 상세 조회에서 받은 간단한 후기를 해당 요리 기록에 표시합니다", () => {
    setDetails({
      "record-dongporou": "청경채가 아삭해서 동파육과 잘 어울렸어요.",
    });

    renderPage();

    expect(
      screen.getByText("청경채가 아삭해서 동파육과 잘 어울렸어요.")
    ).toBeInTheDocument();
  });

  it("T-08 후기가 비어 있으면 안내 문구를 만들지 않고 제목을 사진 중앙에 맞춥니다", () => {
    setDetails({ "record-dongporou": "   " });

    renderPage();

    const title = screen.getByRole("heading", { name: "청경채 동파육" });
    expect(title.parentElement).toHaveClass("self-center");
    expect(
      screen.queryByText(/후기가 없습니다|후기를 남겨/)
    ).not.toBeInTheDocument();
  });

  it("T-09 한 기록의 상세 조회가 실패해도 기본 정보와 다른 기록의 후기는 유지합니다", () => {
    mockedUseDetailQuery.mockImplementation(({ recordId }) => {
      if (recordId === "record-dongporou") {
        return {
          data: undefined,
          isError: true,
          isPending: false,
        } as ReturnType<typeof useCookingRecordDetailQuery>;
      }

      const record = threeRecords.find((item) => item.recordId === recordId);
      return {
        data: record
          ? createDetail(
              record,
              recordId === "record-fried-rice"
                ? "파를 오래 볶으니 향이 더 좋았어요."
                : null
            )
          : undefined,
        isError: false,
        isPending: false,
      } as ReturnType<typeof useCookingRecordDetailQuery>;
    });

    renderPage();

    expect(
      screen.getByRole("heading", { name: "청경채 동파육" })
    ).toBeInTheDocument();
    expect(screen.getByText("720 kcal")).toBeInTheDocument();
    expect(
      screen.getByText("파를 오래 볶으니 향이 더 좋았어요.")
    ).toBeInTheDocument();
  });

  it("T-10 기본 요약은 핵심 합계와 하단 구분선만 표시합니다", () => {
    renderPage();

    expect(screen.getByText("1,870")).toBeInTheDocument();
    expect(screen.getByText("30,400원")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "자세히" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByText("배달·외식 예상")).not.toBeInTheDocument();
    expect(screen.getByLabelText("오늘의 요리 요약")).toHaveClass("border-b");
  });

  it("T-11 요약을 열고 닫을 때 상세 정보와 Light 햅틱을 상태별 한 번만 바꿉니다", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "자세히" }));

    const summary = within(screen.getByLabelText("오늘의 요리 요약"));
    expect(summary.getByText("탄수화물")).toBeInTheDocument();
    expect(summary.getByText("단백질")).toBeInTheDocument();
    expect(summary.getByText("지방")).toBeInTheDocument();
    expect(summary.getByText("좋음 · 적정 섭취량이에요")).toBeInTheDocument();
    expect(summary.getByText("배달·외식 예상")).toBeInTheDocument();
    expect(summary.getByText("45,000원")).toBeInTheDocument();
    expect(summary.getByText("14,600원")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "간략히" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "간략히" }));

    expect(screen.queryByText("배달·외식 예상")).not.toBeInTheDocument();
    expect(mockedTriggerHaptic).toHaveBeenNthCalledWith(1, "Light");
    expect(mockedTriggerHaptic).toHaveBeenNthCalledWith(2, "Light");
  });

  it("T-13 부분 합계를 알리고 모든 칼로리가 null이면 대시를 표시합니다", () => {
    setDateQuery({
      data: [
        createDateRecord({ calories: null }),
        createDateRecord({
          recordId: "record-null",
          calories: null,
          nutrition: null,
        }),
      ],
    });

    renderPage();

    expect(screen.getByText("정보가 있는 기록 기준")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByText("0 kcal")).not.toBeInTheDocument();
  });

  it.each([
    ["/en/calendar/2026-08-17", "Monday, Aug 17", "Today's cooking summary"],
    ["/ja/calendar/2026-08-17", "8月17日 月曜日", "今日の料理まとめ"],
  ])(
    "T-14 %s에서는 현지화된 영양 요약만 표시합니다",
    async (pathname, heading, summaryTitle) => {
      const user = userEvent.setup();
      mockPathname = pathname;

      renderPage();
      await user.click(
        screen.getByRole("button", {
          name: pathname.startsWith("/en") ? "Details" : "詳しく",
        })
      );

      expect(
        screen.getByRole("heading", { name: heading })
      ).toBeInTheDocument();
      expect(screen.getByText(summaryTitle)).toBeInTheDocument();
      expect(
        screen.queryByText(
          /오늘 아낀 금액|Saved today|今日の節約額|Estimated delivery|デリバリー/
        )
      ).not.toBeInTheDocument();
    }
  );

  it("T-15 단일 기록에는 칩이 없고 복수 기록에는 첫 칩이 선택됩니다", () => {
    setDateQuery({ data: [threeRecords[0]] });
    const view = renderPage();

    expect(
      screen.queryByRole("group", { name: "요리 기록 이동" })
    ).not.toBeInTheDocument();

    view.unmount();
    setDateQuery();
    renderPage();

    expect(
      screen.getByRole("button", { name: "청경채 동파육" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("T-16 다른 칩을 누르면 즉시 선택하고 300ms보다 느리고 500ms 안에 이동합니다", async () => {
    const user = userEvent.setup();
    renderPage();
    setRecordLayout();

    await user.click(screen.getByRole("button", { name: "가지 튀김 덮밥" }));

    expect(
      screen.getByRole("button", { name: "가지 튀김 덮밥" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(mockScrollIntoView).not.toHaveBeenCalled();

    act(() => {
      runAnimationFrame(0);
    });
    expect(scrollContainer.scrollTop).toBe(0);

    act(() => {
      runAnimationFrame(300);
    });
    expect(scrollContainer.scrollTop).toBeGreaterThan(0);
    expect(scrollContainer.scrollTop).toBeLessThan(748);

    act(() => {
      runAnimationFrame(500);
    });
    expect(scrollContainer.scrollTop).toBe(748);
    expect(mockedTriggerHaptic).toHaveBeenCalledTimes(1);
    expect(mockedTriggerHaptic).toHaveBeenCalledWith("Light");
  });

  it("T-22 세 번째 칩 이동 중 두 번째 기록이 보여도 클릭한 칩을 유지합니다", async () => {
    const user = userEvent.setup();
    renderPage();
    setRecordLayout();

    await user.click(screen.getByRole("button", { name: "가지 튀김 덮밥" }));
    act(() => {
      scrollContainer.scrollTop = 450;
      scrollContainer.dispatchEvent(new Event("scroll"));
      runAnimationFrame(200);
    });

    expect(
      screen.getByRole("button", { name: "가지 튀김 덮밥" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("T-23 칩 이동이 끝나면 직접 스크롤에 맞춰 선택 칩을 다시 바꿉니다", async () => {
    const user = userEvent.setup();
    renderPage();
    setRecordLayout();

    await user.click(screen.getByRole("button", { name: "가지 튀김 덮밥" }));
    act(() => {
      runAnimationFrame(0);
      runAnimationFrame(500);
      scrollContainer.scrollTop = 450;
      scrollContainer.dispatchEvent(new Event("scroll"));
      runAnimationFrame(600);
    });

    expect(
      screen.getByRole("button", { name: "대파 계란볶음밥" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("T-17 선택된 칩을 다시 누르면 스크롤과 햅틱이 없습니다", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "청경채 동파육" }));

    expect(mockScrollIntoView).not.toHaveBeenCalled();
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
  });

  it("T-18 아래로 직접 스크롤할 때 기준선을 지난 기록으로만 전진합니다", () => {
    renderPage();
    setRecordLayout();

    act(() => {
      scrollContainer.scrollTop = 450;
      scrollContainer.dispatchEvent(new Event("scroll"));
      runAnimationFrame(0);
    });

    expect(
      screen.getByRole("button", { name: "대파 계란볶음밥" })
    ).toHaveAttribute("aria-pressed", "true");

    act(() => {
      scrollContainer.scrollTop = 500;
      scrollContainer.dispatchEvent(new Event("scroll"));
      runAnimationFrame(16);
    });

    expect(
      screen.getByRole("button", { name: "대파 계란볶음밥" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(mockScrollIntoView).not.toHaveBeenCalled();
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
  });

  it("T-19 칩 버튼은 터치 영역과 선택 상태 접근성 규칙을 지킵니다", () => {
    renderPage();

    const group = screen.getByRole("group", { name: "요리 기록 이동" });
    for (const button of within(group).getAllByRole("button")) {
      expect(button).toHaveClass("min-h-11", "cursor-pointer");
      expect(button).toHaveAttribute("aria-pressed");
    }
  });

  it("T-21 날짜와 요리 기록 탐색 영역이 순서대로 고정되고 기록을 가리지 않습니다", () => {
    renderPage();

    const dateHeading = screen.getByRole("heading", {
      name: "8월 17일 월요일",
    });
    const listHeading = screen.getByRole("heading", {
      level: 2,
      name: "요리 기록",
    });
    const chipGroup = screen.getByRole("group", { name: "요리 기록 이동" });
    const recordNavigation = chipGroup.parentElement?.parentElement;

    const dateStickyClasses = dateHeading.parentElement?.classList;
    const navigationStickyClasses = recordNavigation?.classList;
    const dateHeightToken = Array.from(dateStickyClasses ?? []).find((token) =>
      token.startsWith("h-")
    );
    const navigationTopToken = Array.from(navigationStickyClasses ?? []).find(
      (token) => token.startsWith("top-")
    );

    expect(dateHeading.parentElement).toHaveClass(
      "sticky",
      "top-0",
      "z-header"
    );
    expect(dateHeading.parentElement).not.toHaveClass("sticky-optimized");
    expect(recordNavigation).toContainElement(listHeading);
    expect(recordNavigation).toHaveClass("sticky", "top-[47px]");
    expect(recordNavigation).not.toHaveClass("sticky-optimized", "border-t");
    expect(dateHeightToken).toBe("h-12");
    expect(navigationTopToken).toBe("top-[47px]");
    expect(screen.getAllByRole("article")[0]?.className).toMatch(
      /(?:^|\s)scroll-mt-/
    );
  });
});
