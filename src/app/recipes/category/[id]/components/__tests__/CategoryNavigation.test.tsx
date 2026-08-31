import type { HTMLAttributes, ReactNode } from "react";

import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CATEGORY_ICON_CONFIG } from "@/shared/config/categoryNavigation";
import type { TagCode } from "@/shared/config/constants/recipe";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";
import { triggerHaptic } from "@/shared/lib/bridge";

import CategoryNavigation from "../CategoryNavigation";
import { useCategoryNavigation } from "../useCategoryNavigation";

const EXPECTED_CODES: readonly TagCode[] = [
  "CHEF_RECIPE",
  "HOME_PARTY",
  "BRUNCH",
  "QUICK",
  "LATE_NIGHT",
  "LUNCHBOX",
  "PICNIC",
  "CAMPING",
  "HEALTHY",
  "KIDS",
  "SOLO",
  "HOLIDAY",
  "DRINK",
  "AIR_FRYER",
  "HANGOVER",
];
const HANGUL = /[가-힣]/;
const jaTags = taxonomyMessages.ja.tags;

let mockPathname = "/ja/recipes/category/CHEF_RECIPE";
let mockReducedMotion = false;
const mockedTriggerHaptic = jest.mocked(triggerHaptic);
let resizeObserverCallback: ResizeObserverCallback | undefined;
let resizeObserverInstance: ResizeObserver | undefined;
let animationFrameCallback: FrameRequestCallback | undefined;
let mockScrollerClientWidth = 390;
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const INITIAL_MEASUREMENT_FRAME_ID = 17;
const SCROLLER_CONTENT_PADDING_PX = 12;
const mockRequestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  animationFrameCallback = callback;
  return INITIAL_MEASUREMENT_FRAME_ID;
});
const mockCancelAnimationFrame = jest.fn();

const ControllableResizeObserver = jest.fn(
  (callback: ResizeObserverCallback) => {
    const observer: ResizeObserver = {
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: mockDisconnect,
    };
    resizeObserverCallback = callback;
    resizeObserverInstance = observer;
    return observer;
  }
);

type ScrollerMetrics = {
  clientWidth: number;
  scrollWidth: number;
  scrollLeft: number;
};

const setScrollerMetrics = (
  element: HTMLElement,
  { clientWidth, scrollWidth, scrollLeft }: ScrollerMetrics
) => {
  Object.defineProperties(element, {
    clientWidth: { configurable: true, value: clientWidth },
    scrollWidth: { configurable: true, value: scrollWidth },
    scrollLeft: { configurable: true, value: scrollLeft, writable: true },
  });
};

const notifyResize = () => {
  const callback = resizeObserverCallback;
  const observer = resizeObserverInstance;
  if (!callback || !observer) {
    throw new Error("ResizeObserver가 생성되지 않았습니다.");
  }

  act(() => {
    callback([], observer);
  });
};

const runInitialMeasurement = () => {
  const callback = animationFrameCallback;
  if (!callback) {
    throw new Error("초기 측정 RAF가 예약되지 않았습니다.");
  }

  act(() => {
    callback(0);
  });
};

const preventAnchorNavigationAfterReact = () => {
  const handleClick = (event: MouseEvent) => {
    if (event.target instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
  };

  document.addEventListener("click", handleClick, { once: true });
};

const getRenderedCategoryCodes = () =>
  within(screen.getByRole("navigation"))
    .getAllByRole("link")
    .map((link) => link.getAttribute("href")?.split("/").at(-1));

const getSiblingIndex = (element: HTMLElement | null) => {
  if (!element?.parentElement) {
    return -1;
  }

  return Array.from(element.parentElement.children).indexOf(element);
};

const installNavigationGeometry = () => {
  const originalGetBoundingClientRect =
    HTMLElement.prototype.getBoundingClientRect;
  const descriptors = {
    clientWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientWidth"
    ),
    scrollWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollWidth"
    ),
    offsetLeft: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetLeft"
    ),
    offsetWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetWidth"
    ),
  };

  Object.defineProperties(HTMLElement.prototype, {
    clientWidth: {
      configurable: true,
      get() {
        return this.dataset.testid === "category-scroller"
          ? mockScrollerClientWidth
          : 0;
      },
    },
    scrollWidth: {
      configurable: true,
      get() {
        return this.dataset.testid === "category-scroller" ? 1072 : 0;
      },
    },
    offsetLeft: {
      configurable: true,
      get() {
        const itemIndex = this.dataset.categoryCode
          ? getSiblingIndex(this)
          : -1;
        return itemIndex >= 0 ? itemIndex * 70 : 0;
      },
    },
    offsetWidth: {
      configurable: true,
      get() {
        return this.dataset.categoryCode ? 68 : 0;
      },
    },
  });
  HTMLElement.prototype.getBoundingClientRect = function () {
    if (this.dataset.testid === "category-scroller") {
      return new DOMRect(0, 0, mockScrollerClientWidth, 82);
    }

    const scroller = this.closest('[data-testid="category-scroller"]');
    const scrollLeft =
      scroller instanceof HTMLElement ? scroller.scrollLeft : 0;
    if (this.dataset.categoryCode) {
      const itemIndex = getSiblingIndex(this);
      return new DOMRect(
        SCROLLER_CONTENT_PADDING_PX + itemIndex * 70 - scrollLeft,
        0,
        68,
        74
      );
    }

    if (this.hasAttribute("data-category-indicator")) {
      const currentLink = this.parentElement?.querySelector(
        'a[aria-current="page"]'
      );
      const activeItem = currentLink?.closest("li");
      const activeIndex =
        activeItem instanceof HTMLElement ? getSiblingIndex(activeItem) : -1;
      return new DOMRect(
        SCROLLER_CONTENT_PADDING_PX + activeIndex * 70 + 8 - scrollLeft,
        0,
        52,
        3
      );
    }

    return originalGetBoundingClientRect.call(this);
  };

  return () => {
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    Object.entries(descriptors).forEach(([property, descriptor]) => {
      if (descriptor) {
        Object.defineProperty(HTMLElement.prototype, property, descriptor);
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, property);
      }
    });
  };
};

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true,
    entry: undefined,
  }),
}));

type MotionSpanProps = HTMLAttributes<HTMLSpanElement> & {
  animate?: unknown;
  children?: ReactNode;
  initial?: boolean;
  transition?: unknown;
};

jest.mock("framer-motion", () => ({
  useReducedMotion: () => mockReducedMotion,
  motion: {
    span: ({ animate, initial, transition, ...props }: MotionSpanProps) => (
      <span
        data-animate={JSON.stringify(animate)}
        data-initial={String(initial)}
        data-transition={JSON.stringify(transition)}
        {...props}
      />
    ),
  },
}));

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

describe("CategoryNavigation", () => {
  const originalResizeObserver = Object.getOwnPropertyDescriptor(
    globalThis,
    "ResizeObserver"
  );
  const originalRequestAnimationFrame = Object.getOwnPropertyDescriptor(
    globalThis,
    "requestAnimationFrame"
  );
  const originalCancelAnimationFrame = Object.getOwnPropertyDescriptor(
    globalThis,
    "cancelAnimationFrame"
  );

  beforeAll(() => {
    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      value: ControllableResizeObserver,
    });
    Object.defineProperty(globalThis, "requestAnimationFrame", {
      configurable: true,
      value: mockRequestAnimationFrame,
    });
    Object.defineProperty(globalThis, "cancelAnimationFrame", {
      configurable: true,
      value: mockCancelAnimationFrame,
    });
  });

  beforeEach(() => {
    mockPathname = "/ja/recipes/category/CHEF_RECIPE";
    mockReducedMotion = false;
    mockedTriggerHaptic.mockClear();
    resizeObserverCallback = undefined;
    resizeObserverInstance = undefined;
    animationFrameCallback = undefined;
    mockScrollerClientWidth = 390;
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    mockRequestAnimationFrame.mockClear();
    mockCancelAnimationFrame.mockClear();
  });

  afterAll(() => {
    if (originalResizeObserver) {
      Object.defineProperty(
        globalThis,
        "ResizeObserver",
        originalResizeObserver
      );
    } else {
      Reflect.deleteProperty(globalThis, "ResizeObserver");
    }
    if (originalRequestAnimationFrame) {
      Object.defineProperty(
        globalThis,
        "requestAnimationFrame",
        originalRequestAnimationFrame
      );
    } else {
      Reflect.deleteProperty(globalThis, "requestAnimationFrame");
    }
    if (originalCancelAnimationFrame) {
      Object.defineProperty(
        globalThis,
        "cancelAnimationFrame",
        originalCancelAnimationFrame
      );
    } else {
      Reflect.deleteProperty(globalThis, "cancelAnimationFrame");
    }
  });

  it("T-02: 일본어 경로에서 15개 카테고리를 정의 순서와 현지화된 링크로 렌더링한다", () => {
    const { container } = render(
      <CategoryNavigation currentCode="CHEF_RECIPE" />
    );

    const navigation = screen.getByRole("navigation");
    const links = within(navigation).getAllByRole("link");

    expect(links).toHaveLength(15);
    expect(links.map((link) => link.textContent)).toEqual(
      EXPECTED_CODES.map((code) => jaTags[code])
    );

    links.forEach((link, index) => {
      const code = EXPECTED_CODES[index];
      expect(link).toHaveAttribute("href", `/ja/recipes/category/${code}`);

      const images = link.querySelectorAll("img");
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute("alt", "");
      expect(images[0]).toHaveAttribute(
        "src",
        CATEGORY_ICON_CONFIG[code].imageSrc
      );
      expect(images[0]).toHaveAttribute("loading", "lazy");
    });

    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-04: 현재 경로와 시각 선택을 분리하면서 앱형 아이콘 탭 위계를 유지한다", () => {
    render(<CategoryNavigation currentCode="CHEF_RECIPE" />);

    const routeCurrentLink = screen.getByRole("link", { current: "page" });
    const inactiveLink = screen.getByRole("link", {
      name: jaTags.HOME_PARTY,
    });
    const activeLabel = within(routeCurrentLink).getByText(jaTags.CHEF_RECIPE);
    const inactiveLabel = within(inactiveLink).getByText(jaTags.HOME_PARTY);
    const iconShells = screen.getAllByTestId("category-icon-shell");
    const list = screen.getByRole("list");

    expect(routeCurrentLink).toHaveAttribute(
      "href",
      "/ja/recipes/category/CHEF_RECIPE"
    );
    expect(screen.getAllByRole("link", { current: "page" })).toHaveLength(1);
    expect(activeLabel).toHaveClass("text-ink", "font-bold");
    expect(inactiveLabel).toHaveClass("text-ink-sub", "font-medium");
    expect(list.children).toHaveLength(15);
    Array.from(list.children).forEach((child) => {
      expect(child.tagName).toBe("LI");
    });

    const navigation = screen.getByRole("navigation");
    const indicator = navigation.querySelector("[data-category-indicator]");
    expect(indicator).toHaveClass("h-[3px]", "bg-black");
    expect(
      routeCurrentLink.querySelector("[data-category-indicator]")
    ).toBeNull();
    expect(indicator).toHaveAttribute("data-initial", "false");
    expect(indicator).toHaveAttribute("data-animate", JSON.stringify({ x: 0 }));
    expect(indicator).toHaveAttribute(
      "data-transition",
      JSON.stringify({ type: "spring", stiffness: 700, damping: 40 })
    );

    expect(iconShells).toHaveLength(15);
    iconShells.forEach((iconShell) => {
      expect(iconShell).toHaveClass("h-11", "w-11");
      expect(iconShell.className).not.toMatch(/\bbg-/);
      expect(iconShell.className).not.toMatch(/\brounded/);
    });

    within(screen.getByRole("navigation"))
      .getAllByRole("link")
      .forEach((link) => {
        expect(link).toHaveClass(
          "min-h-[74px]",
          "cursor-pointer",
          "focus-visible:ring-2"
        );
      });

    preventAnchorNavigationAfterReact();
    fireEvent.click(inactiveLink);

    expect(screen.getByRole("link", { current: "page" })).toBe(
      routeCurrentLink
    );
    expect(inactiveLabel).toHaveClass("text-ink", "font-bold");
    expect(within(routeCurrentLink).getByText(jaTags.CHEF_RECIPE)).toHaveClass(
      "text-ink-sub",
      "font-medium"
    );
    expect(
      navigation.querySelector("[data-category-indicator]")
    ).toHaveAttribute("data-animate", JSON.stringify({ x: 70 }));
  });
  it("T-05: selecting another category moves the active indicator with the profile spring and sends one Light haptic", async () => {
    const user = userEvent.setup();
    render(<CategoryNavigation currentCode="CHEF_RECIPE" />);

    const navigation = screen.getByRole("navigation");
    const indicator = navigation.querySelector("[data-category-indicator]");
    const targetLink = screen.getByRole("link", { name: jaTags.HOME_PARTY });

    preventAnchorNavigationAfterReact();
    await user.click(targetLink);

    expect(targetLink.querySelector("span:last-child")).toHaveClass(
      "text-ink",
      "font-bold"
    );
    expect(indicator).toHaveAttribute(
      "data-animate",
      JSON.stringify({ x: 70 })
    );
    expect(indicator).toHaveAttribute(
      "data-transition",
      JSON.stringify({ type: "spring", stiffness: 700, damping: 40 })
    );
    expect(mockedTriggerHaptic).toHaveBeenCalledTimes(1);
    expect(mockedTriggerHaptic).toHaveBeenCalledWith("Light");
  });

  it("T-06: selecting the current category keeps the indicator node and sends no haptic", async () => {
    const user = userEvent.setup();
    render(<CategoryNavigation currentCode="CHEF_RECIPE" />);

    const navigation = screen.getByRole("navigation");
    const indicator = navigation.querySelector("[data-category-indicator]");
    const activeLink = screen.getByRole("link", { current: "page" });

    preventAnchorNavigationAfterReact();
    await user.click(activeLink);

    expect(screen.getByRole("link", { current: "page" })).toBe(activeLink);
    expect(navigation.querySelector("[data-category-indicator]")).toBe(
      indicator
    );
    expect(indicator).toHaveAttribute("data-animate", JSON.stringify({ x: 0 }));
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
  });

  it("T-06: scrolling and route prop synchronization never send haptic", () => {
    const { result, rerender } = renderHook(
      ({ currentCode }: { currentCode: TagCode }) =>
        useCategoryNavigation(currentCode),
      { initialProps: { currentCode: "CHEF_RECIPE" } }
    );

    act(() => {
      result.current.handleScroll();
    });
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();

    act(() => {
      rerender({ currentCode: "HOME_PARTY" });
    });

    expect(result.current.activeCode).toBe("HOME_PARTY");
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
  });

  it("T-07: reduced motion uses an immediate transition while still selecting and sending one haptic", async () => {
    mockReducedMotion = true;
    const user = userEvent.setup();
    render(<CategoryNavigation currentCode="CHEF_RECIPE" />);

    const navigation = screen.getByRole("navigation");
    const targetLink = screen.getByRole("link", { name: jaTags.HOME_PARTY });
    const indicator = navigation.querySelector("[data-category-indicator]");

    preventAnchorNavigationAfterReact();
    await user.click(targetLink);

    expect(targetLink.querySelector("span:last-child")).toHaveClass(
      "text-ink",
      "font-bold"
    );
    expect(indicator).toHaveAttribute(
      "data-animate",
      JSON.stringify({ x: 70 })
    );
    expect(indicator).toHaveAttribute(
      "data-transition",
      JSON.stringify({ duration: 0 })
    );
    expect(mockedTriggerHaptic).toHaveBeenCalledTimes(1);
  });

  it("T-11: starts the HANGOVER route with the current category", () => {
    render(<CategoryNavigation currentCode="HANGOVER" />);

    const links = within(screen.getByRole("navigation")).getAllByRole("link");

    expect(getRenderedCategoryCodes().slice(0, 3)).toEqual([
      "HANGOVER",
      "CHEF_RECIPE",
      "HOME_PARTY",
    ]);
    expect(links[0]).toHaveAttribute("aria-current", "page");
  });

  it("T-12: rotates all categories without mutating the canonical order", () => {
    const drinkOrder: readonly TagCode[] = [
      "DRINK",
      "AIR_FRYER",
      "HANGOVER",
      "CHEF_RECIPE",
      "HOME_PARTY",
      "BRUNCH",
      "QUICK",
      "LATE_NIGHT",
      "LUNCHBOX",
      "PICNIC",
      "CAMPING",
      "HEALTHY",
      "KIDS",
      "SOLO",
      "HOLIDAY",
    ];
    const { unmount } = render(<CategoryNavigation currentCode="DRINK" />);
    const renderedDrinkOrder = getRenderedCategoryCodes();

    expect(renderedDrinkOrder).toEqual(drinkOrder);
    expect(new Set(renderedDrinkOrder).size).toBe(EXPECTED_CODES.length);

    unmount();
    render(<CategoryNavigation currentCode="CHEF_RECIPE" />);

    expect(getRenderedCategoryCodes()).toEqual(EXPECTED_CODES);
  });

  it("T-13: reorders only after the route prop confirms the selection", () => {
    const { rerender } = render(
      <CategoryNavigation currentCode="CHEF_RECIPE" />
    );
    const drinkLink = screen.getByRole("link", { name: jaTags.DRINK });
    preventAnchorNavigationAfterReact();

    fireEvent.click(drinkLink);

    expect(getRenderedCategoryCodes()).toEqual(EXPECTED_CODES);
    expect(drinkLink.querySelector("span:last-child")).toHaveClass("font-bold");
    expect(mockedTriggerHaptic).toHaveBeenCalledTimes(1);

    rerender(<CategoryNavigation currentCode="DRINK" />);

    const navigation = screen.getByRole("navigation");
    const links = within(navigation).getAllByRole("link");
    expect(getRenderedCategoryCodes()[0]).toBe("DRINK");
    expect(links[0]).toHaveAttribute("aria-current", "page");
    expect(
      navigation.querySelector("[data-category-indicator]")
    ).toHaveAttribute("data-animate", JSON.stringify({ x: 0 }));
    expect(mockedTriggerHaptic).toHaveBeenCalledTimes(1);
  });

  it("HANGOVER 직접 진입 시 현재 카테고리를 첫 위치에 두고 오른쪽 페이드를 표시한다", () => {
    const restoreGeometry = installNavigationGeometry();

    try {
      render(<CategoryNavigation currentCode="HANGOVER" />);

      const activeItem = screen
        .getByRole("link", { current: "page" })
        .closest("li");
      const indicator = screen
        .getByRole("navigation")
        .querySelector("[data-category-indicator]");

      expect(screen.getByTestId("category-scroller")).toHaveProperty(
        "scrollLeft",
        0
      );
      expect(activeItem?.getBoundingClientRect().left).toBe(12);
      expect(indicator?.getBoundingClientRect().left).toBe(20);
      expect(screen.getByTestId("category-fade")).toBeInTheDocument();
    } finally {
      restoreGeometry();
    }
  });

  it("첫 카테고리 직접 진입은 scroller의 12px content padding 정렬을 유지한다", () => {
    const restoreGeometry = installNavigationGeometry();

    try {
      render(<CategoryNavigation currentCode="CHEF_RECIPE" />);

      const activeItem = screen
        .getByRole("link", { current: "page" })
        .closest("li");
      const indicator = screen
        .getByRole("navigation")
        .querySelector("[data-category-indicator]");

      expect(screen.getByTestId("category-scroller")).toHaveProperty(
        "scrollLeft",
        0
      );
      expect(activeItem?.getBoundingClientRect().left).toBe(12);
      expect(indicator?.getBoundingClientRect().left).toBe(20);
    } finally {
      restoreGeometry();
    }
  });

  it("DRINK 직접 진입 시 현재 카테고리를 첫 위치에 두고 뒤 항목을 페이드로 예고한다", () => {
    const restoreGeometry = installNavigationGeometry();

    try {
      render(<CategoryNavigation currentCode="DRINK" />);

      const scroller = screen.getByTestId("category-scroller");
      const activeLink = screen.getByRole("link", { current: "page" });
      const activeItem = activeLink.closest("li");
      const indicator = screen
        .getByRole("navigation")
        .querySelector("[data-category-indicator]");

      expect(screen.getByTestId("category-fade")).toBeInTheDocument();
      expect(scroller.scrollLeft).toBe(0);
      expect(activeItem?.getBoundingClientRect().left).toBe(12);
      expect(indicator?.getBoundingClientRect().left).toBe(20);
    } finally {
      restoreGeometry();
    }
  });

  it("route prop이 바뀌면 현재 카테고리를 첫 위치로 옮기되 같은 prop 재렌더는 수동 스크롤을 유지한다", () => {
    const restoreGeometry = installNavigationGeometry();

    try {
      const { rerender } = render(
        <CategoryNavigation currentCode="CHEF_RECIPE" />
      );
      const scroller = screen.getByTestId("category-scroller");

      rerender(<CategoryNavigation currentCode="HANGOVER" />);
      expect(scroller.scrollLeft).toBe(0);

      scroller.scrollLeft = 240;
      rerender(<CategoryNavigation currentCode="HANGOVER" />);
      expect(scroller.scrollLeft).toBe(240);
    } finally {
      restoreGeometry();
    }
  });

  it("같은 HANGOVER route에서 rail 너비가 줄면 ResizeObserver가 활성 항목과 인디케이터를 다시 노출한다", () => {
    mockScrollerClientWidth = 1200;
    const restoreGeometry = installNavigationGeometry();

    try {
      render(<CategoryNavigation currentCode="HANGOVER" />);
      const scroller = screen.getByTestId("category-scroller");
      const activeItem = screen
        .getByRole("link", { current: "page" })
        .closest("li");
      const indicator = screen
        .getByRole("navigation")
        .querySelector("[data-category-indicator]");
      expect(scroller.scrollLeft).toBe(0);

      mockScrollerClientWidth = 390;
      notifyResize();

      const fadeWidth = screen.queryByTestId("category-fade") ? 48 : 0;
      const safeRight = scroller.getBoundingClientRect().right - fadeWidth;
      expect(activeItem?.getBoundingClientRect().right).toBeLessThanOrEqual(
        safeRight
      );
      expect(indicator?.getBoundingClientRect().right).toBeLessThanOrEqual(
        safeRight
      );
    } finally {
      restoreGeometry();
    }
  });

  it("ResizeObserver 측정 시 숨겨진 첫 활성 항목을 다시 노출한다", () => {
    const restoreGeometry = installNavigationGeometry();

    try {
      render(<CategoryNavigation currentCode="BRUNCH" />);
      const scroller = screen.getByTestId("category-scroller");
      scroller.scrollLeft = 40;

      notifyResize();

      expect(scroller.scrollLeft).toBe(0);
    } finally {
      restoreGeometry();
    }
  });

  it.each([
    ["Ctrl 클릭", { ctrlKey: true }],
    ["Meta 클릭", { metaKey: true }],
    ["Shift 클릭", { shiftKey: true }],
    ["Alt 클릭", { altKey: true }],
    ["중간 버튼 클릭", { button: 1 }],
  ])("%s은 optimistic 선택과 haptic을 발생시키지 않는다", (_label, init) => {
    render(<CategoryNavigation currentCode="CHEF_RECIPE" />);
    const targetLink = screen.getByRole("link", { name: jaTags.HOME_PARTY });

    fireEvent.click(targetLink, init);

    expect(within(targetLink).getByText(jaTags.HOME_PARTY)).toHaveClass(
      "text-ink-sub",
      "font-medium"
    );
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
  });

  it("이미 preventDefault된 클릭은 optimistic 선택과 haptic을 발생시키지 않는다", () => {
    render(<CategoryNavigation currentCode="CHEF_RECIPE" />);
    const targetLink = screen.getByRole("link", { name: jaTags.HOME_PARTY });
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      button: 0,
    });
    clickEvent.preventDefault();

    targetLink.dispatchEvent(clickEvent);

    expect(within(targetLink).getByText(jaTags.HOME_PARTY)).toHaveClass(
      "text-ink-sub",
      "font-medium"
    );
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
  });

  it("T-08: 오른쪽에 숨은 항목이 있으면 스크롤을 막지 않는 페이드를 표시한다", () => {
    const { unmount } = render(
      <CategoryNavigation currentCode="CHEF_RECIPE" />
    );

    const scroller = screen.getByTestId("category-scroller");
    setScrollerMetrics(scroller, {
      clientWidth: 390,
      scrollWidth: 960,
      scrollLeft: 0,
    });
    runInitialMeasurement();

    const fade = screen.getByTestId("category-fade");
    expect(fade).toHaveAttribute("aria-hidden", "true");
    expect(fade).toHaveClass(
      "pointer-events-none",
      "absolute",
      "inset-y-0",
      "right-0",
      "w-12",
      "bg-gradient-to-l",
      "from-white",
      "via-white/85",
      "to-transparent"
    );
    expect(mockObserve).toHaveBeenCalledTimes(1);
    expect(mockObserve).toHaveBeenCalledWith(scroller);
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();

    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(
      INITIAL_MEASUREMENT_FRAME_ID
    );
  });

  it("T-09: 오른쪽 끝과 1px 이내에 도달하면 페이드를 제거한다", () => {
    render(<CategoryNavigation currentCode="CHEF_RECIPE" />);

    const scroller = screen.getByTestId("category-scroller");
    setScrollerMetrics(scroller, {
      clientWidth: 390,
      scrollWidth: 960,
      scrollLeft: 0,
    });
    notifyResize();
    expect(screen.getByTestId("category-fade")).toBeInTheDocument();

    scroller.scrollLeft = 570;
    fireEvent.scroll(scroller);
    expect(screen.queryByTestId("category-fade")).not.toBeInTheDocument();

    scroller.scrollLeft = 0;
    fireEvent.scroll(scroller);
    expect(screen.getByTestId("category-fade")).toBeInTheDocument();

    scroller.scrollLeft = 569.5;
    fireEvent.scroll(scroller);
    expect(screen.queryByTestId("category-fade")).not.toBeInTheDocument();
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
  });

  it("T-09: 가로 overflow가 없으면 처음부터 페이드를 표시하지 않는다", () => {
    render(<CategoryNavigation currentCode="CHEF_RECIPE" />);

    const scroller = screen.getByTestId("category-scroller");
    setScrollerMetrics(scroller, {
      clientWidth: 960,
      scrollWidth: 960,
      scrollLeft: 0,
    });
    notifyResize();

    expect(screen.queryByTestId("category-fade")).not.toBeInTheDocument();
    expect(mockedTriggerHaptic).not.toHaveBeenCalled();
  });

  it("T-09: ResizeObserver가 없어도 RAF로 초기 overflow를 측정하고 정리한다", () => {
    const resizeObserverDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "ResizeObserver"
    );
    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      value: undefined,
    });

    try {
      const { unmount } = render(
        <CategoryNavigation currentCode="CHEF_RECIPE" />
      );
      const scroller = screen.getByTestId("category-scroller");
      setScrollerMetrics(scroller, {
        clientWidth: 390,
        scrollWidth: 960,
        scrollLeft: 0,
      });

      runInitialMeasurement();

      expect(screen.getByTestId("category-fade")).toBeInTheDocument();
      expect(mockObserve).not.toHaveBeenCalled();
      unmount();
      expect(mockDisconnect).not.toHaveBeenCalled();
      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(
        INITIAL_MEASUREMENT_FRAME_ID
      );
    } finally {
      if (resizeObserverDescriptor) {
        Object.defineProperty(
          globalThis,
          "ResizeObserver",
          resizeObserverDescriptor
        );
      } else {
        Reflect.deleteProperty(globalThis, "ResizeObserver");
      }
    }
  });
});
