import { render, screen } from "@testing-library/react";

import { recipeCreateMessages } from "@/shared/i18n/recipeCreateMessages";

import { CreationModeSelector } from "../CreationModeSelector";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

jest.mock("@/shared/ui/PrevButton", () => ({
  __esModule: true,
  default: () => <button type="button" aria-label="back" />,
}));

const HANGUL = /[가-힣]/;

const getLink = (name: RegExp): HTMLAnchorElement =>
  screen.getByRole("link", { name }) as HTMLAnchorElement;

describe("CreationModeSelector i18n (T-22/23/25)", () => {
  it("T-22: /ja에서 ja 사전값 렌더 + 한글 미잔존", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    const { container } = render(<CreationModeSelector />);
    const ja = recipeCreateMessages.ja;

    expect(screen.getByText(ja.hubTitle)).toBeInTheDocument();
    expect(screen.getByText(ja.hubSubtitle)).toBeInTheDocument();
    expect(screen.getByText(ja.manualCardTitle)).toBeInTheDocument();
    expect(screen.getByText(ja.manualCardBody)).toBeInTheDocument();
    expect(screen.getByText(ja.youtubeCardTitle)).toBeInTheDocument();
    expect(screen.getByText(ja.youtubeCardBody)).toBeInTheDocument();
    expect(screen.getByAltText(ja.manualCardImageAlt)).toBeInTheDocument();
    expect(screen.getByAltText(ja.youtubeCardImageAlt)).toBeInTheDocument();

    expect(HANGUL.test(container.innerHTML)).toBe(false);
  });

  it("T-23: /ja에서 카드 href에 ja prefix가 붙는다", () => {
    mockPathname.mockReturnValue("/ja");
    const ja = recipeCreateMessages.ja;
    render(<CreationModeSelector />);

    expect(getLink(new RegExp(ja.manualCardTitle)).getAttribute("href")).toBe(
      "/ja/recipes/new/manual"
    );
    expect(getLink(new RegExp(ja.youtubeCardTitle)).getAttribute("href")).toBe(
      "/ja/recipes/new/youtube"
    );
  });

  it("T-22: AI 레시피 카드가 보이고 /recipes/new/ai로 연결된다", () => {
    mockPathname.mockReturnValue("/recipes/new");
    render(<CreationModeSelector />);

    const aiCard = getLink(/AI 레시피/);
    expect(aiCard.getAttribute("href")).toMatch(/\/recipes\/new\/ai$/);
  });

  it("T-25: ko에서 한글 유지 + href에 prefix 없음", () => {
    mockPathname.mockReturnValue("/recipes/new");
    const ko = recipeCreateMessages.ko;
    render(<CreationModeSelector />);

    expect(screen.getByText(ko.hubTitle)).toBeInTheDocument();
    expect(getLink(new RegExp(ko.manualCardTitle)).getAttribute("href")).toBe(
      "/recipes/new/manual"
    );
  });
});
