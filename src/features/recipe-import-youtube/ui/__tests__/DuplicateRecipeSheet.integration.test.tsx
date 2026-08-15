import { render } from "@testing-library/react";

import { youtubeMessages } from "@/shared/i18n";

import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import { DuplicateRecipeSheet } from "../DuplicateRecipeSheet";

const mockPathname = jest.fn();
const mockUseMediaQuery = jest.fn();
let consoleWarnSpy: jest.SpiedFunction<typeof console.warn>;

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

jest.mock("@/shared/lib/hooks/useMediaQuery", () => ({
  useMediaQuery: () => mockUseMediaQuery(),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const getRequiredElement = (selector: string): HTMLElement => {
  const element = document.querySelector<HTMLElement>(selector);
  expect(element).not.toBeNull();
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};

const recipeItem: DetailedRecipeGridItem = {
  id: "recipe-1",
  title: "토마토 파스타",
  imageUrl: "https://example.com/pasta.jpg",
  authorName: "레시피오",
  authorId: "author-1",
  profileImage: "https://example.com/profile.jpg",
  cookingTime: 35,
  createdAt: "2026-08-15T00:00:00.000Z",
  favoriteByCurrentUser: false,
  avgRating: 4.8,
  ratingCount: 24,
  source: "YOUTUBE",
  youtubeChannelName: "주방 채널",
};

const renderSheet = () =>
  render(
    <DuplicateRecipeSheet
      recipeId="recipe-1"
      recipeItem={recipeItem}
      isLoading={false}
      isFavorited={false}
      onSaveClick={jest.fn()}
    />
  );

describe("DuplicateRecipeSheet 실제 responsive primitive 통합", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      value: ResizeObserverMock,
    });
    Object.defineProperty(globalThis, "PointerEvent", {
      configurable: true,
      value: MouseEvent,
    });
    Object.defineProperty(HTMLElement.prototype, "setPointerCapture", {
      configurable: true,
      value: jest.fn(),
    });
    Object.defineProperty(HTMLElement.prototype, "releasePointerCapture", {
      configurable: true,
      value: jest.fn(),
    });
    Object.defineProperty(HTMLElement.prototype, "hasPointerCapture", {
      configurable: true,
      value: jest.fn(() => false),
    });
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: jest.fn(),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname.mockReturnValue("/recipes/new/youtube");
    consoleWarnSpy = jest.spyOn(console, "warn");
  });

  afterEach(() => jest.restoreAllMocks());

  it("데스크톱 Dialog는 description 연결과 viewport 내 스크롤/footer 구조를 유지한다", () => {
    mockUseMediaQuery.mockReturnValue(false);
    renderSheet();

    const content = getRequiredElement('[data-slot="dialog-content"]');
    const descriptionId = content.getAttribute("aria-describedby");
    expect(descriptionId).toBeTruthy();
    if (!descriptionId) throw new Error("Missing aria-describedby");
    expect(
      content.querySelector('[data-slot="dialog-description"]')
    ).toHaveAttribute("id", descriptionId);
    expect(document.getElementById(descriptionId)).toHaveTextContent(
      youtubeMessages.ko.duplicateNoCredit
    );
    expect(content).toHaveClass("max-h-[calc(100dvh-2rem)]");
    expect(
      content.querySelector(".min-h-0.flex-1.overflow-y-auto")
    ).toBeInTheDocument();
    expect(content.querySelector('[data-slot="dialog-footer"]')).toHaveClass(
      "shrink-0"
    );
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("모바일 Drawer도 실제 content와 description, 스크롤/footer를 연결한다", () => {
    mockUseMediaQuery.mockReturnValue(true);
    renderSheet();

    const content = getRequiredElement('[data-slot="drawer-content"]');
    const descriptionId = content.getAttribute("aria-describedby");
    expect(descriptionId).toBeTruthy();
    if (!descriptionId) throw new Error("Missing aria-describedby");
    expect(
      content.querySelector('[data-slot="drawer-description"]')
    ).toHaveAttribute("id", descriptionId);
    expect(document.getElementById(descriptionId)).toHaveTextContent(
      youtubeMessages.ko.duplicateNoCredit
    );
    expect(
      content.querySelector(".min-h-0.flex-1.overflow-y-auto")
    ).toBeInTheDocument();
    expect(content.querySelector('[data-slot="drawer-footer"]')).toHaveClass(
      "shrink-0"
    );
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});
