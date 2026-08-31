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
  beforeEach(() => {
    mockPathname = "/ja/recipes/category/CHEF_RECIPE";
    mockReducedMotion = false;
    mockedTriggerHaptic.mockClear();
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
});
