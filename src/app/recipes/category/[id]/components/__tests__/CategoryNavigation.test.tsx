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
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const INITIAL_MEASUREMENT_FRAME_ID = 17;
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

const preventAnchorNavigation = (anchor: HTMLElement) => {
  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
  };

  anchor.addEventListener("click", handleClick, { capture: true, once: true });
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

    preventAnchorNavigation(inactiveLink);
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

    preventAnchorNavigation(targetLink);
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

    preventAnchorNavigation(activeLink);
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
      { initialProps: { currentCode: "CHEF_RECIPE" as TagCode } }
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

    preventAnchorNavigation(targetLink);
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
