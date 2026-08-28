import { fireEvent, render, screen } from "@testing-library/react";

import { getDictionary, type Locale } from "@/shared/i18n";

import { DesktopYoutubeImportHero } from "../DesktopYoutubeImportHero";

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () =>
    function MockDesktopYoutubeImportFlow({ isOpen }: { isOpen: boolean }) {
      return isOpen ? <div data-testid="active-youtube-import-flow" /> : null;
    },
}));

const validUrl = "https://youtu.be/dQw4w9WgXcQ";

const renderHero = (locale: Locale = "ko") =>
  render(
    <DesktopYoutubeImportHero
      messages={getDictionary(locale).home.desktopYoutubeImport}
    />
  );

describe("DesktopYoutubeImportHero", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("T-03: 지원하지 않는 링크는 오류를 보여주고 추출 화면을 열지 않습니다", () => {
    renderHero();
    const input = screen.getByRole("textbox", { name: "유튜브 URL" });

    fireEvent.paste(input, {
      clipboardData: { getData: () => "https://example.com/recipe" },
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "올바른 유튜브 링크를 입력해주세요"
    );
    expect(
      screen.queryByTestId("active-youtube-import-flow")
    ).not.toBeInTheDocument();
  });

  it("T-01: 유효한 링크를 붙여 넣으면 같은 홈에서 추출 모달을 엽니다", () => {
    renderHero();

    fireEvent.paste(screen.getByRole("textbox", { name: "유튜브 URL" }), {
      clipboardData: { getData: () => validUrl },
    });

    expect(
      screen.getByTestId("active-youtube-import-flow")
    ).toBeInTheDocument();
  });

  it("T-04: 변환 예시는 영상 카드, 화살표, 같은 높이의 레시피 카드 순서입니다", () => {
    renderHero();
    const source = screen.getByTestId("youtube-source-card");
    const arrow = screen.getByTestId("youtube-transform-arrow");
    const recipe = screen.getByTestId("youtube-recipe-card");

    expect(
      source.compareDocumentPosition(arrow) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      arrow.compareDocumentPosition(recipe) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(source).toHaveClass("h-56");
    expect(recipe).toHaveClass("h-56");
  });

  it("T-05: 히어로는 모바일에서 숨고 데스크톱에서 표시됩니다", () => {
    renderHero();

    expect(screen.getByTestId("desktop-youtube-import-hero")).toHaveClass(
      "hidden",
      "md:block"
    );
  });

  it("T-05: 데스크톱 예시 이미지는 데스크톱 미디어 조건에서만 요청됩니다", () => {
    renderHero();

    const image = screen.getByRole("img", {
      name: getDictionary("ko").home.desktopYoutubeImport.previewAlt,
    });
    const picture = image.parentElement;
    const source = picture?.querySelector("source");

    expect(picture?.tagName).toBe("PICTURE");
    expect(source).toHaveAttribute("media", "(min-width: 768px)");
    expect(source).toHaveAttribute(
      "srcset",
      "/events/cooking-record/food-cluster.webp"
    );
    expect(image.getAttribute("src")).toMatch(/^data:image\/gif;base64,/);
  });

  it.each([{ locale: "ko" }, { locale: "en" }, { locale: "ja" }] as const)(
    "T-10: $locale 문구를 유지합니다",
    ({ locale }) => {
      const { container } = renderHero(locale);
      const messages = getDictionary(locale).home.desktopYoutubeImport;

      expect(
        screen.getByRole("heading", {
          name: (accessibleName) =>
            accessibleName.includes(messages.titleLine1),
        })
      ).toBeInTheDocument();
      if (locale !== "ko") {
        expect(container.textContent).not.toMatch(/[가-힣]/);
      }
    }
  );
});
