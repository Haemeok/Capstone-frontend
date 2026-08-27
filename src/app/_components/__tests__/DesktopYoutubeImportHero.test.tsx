import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getDictionary, type Locale } from "@/shared/i18n";

import { DesktopYoutubeImportHero } from "../DesktopYoutubeImportHero";

const routerPushMock = jest.fn();
let pathname = "/";

jest.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({
    push: routerPushMock,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const validUrl = "https://youtu.be/dQw4w9WgXcQ";
const normalizedUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const encodedUrl = encodeURIComponent(normalizedUrl);

const renderHero = (locale: Locale = "ko") =>
  render(
    <DesktopYoutubeImportHero
      messages={getDictionary(locale).home.desktopYoutubeImport}
    />
  );

describe("DesktopYoutubeImportHero", () => {
  beforeEach(() => {
    pathname = "/";
    jest.clearAllMocks();
  });

  it.each([validUrl, "https://www.youtube.com/watch?v=dQw4w9WgXcQ"])(
    "T-02: 유효한 링크 %s을 정규화해 추출 페이지로 전달합니다",
    async (url) => {
      const user = userEvent.setup();
      renderHero();

      await user.type(screen.getByRole("textbox", { name: "유튜브 URL" }), url);
      await user.click(screen.getByRole("button", { name: "레시피로 만들기" }));

      expect(routerPushMock).toHaveBeenCalledWith(
        `/recipes/new/youtube?url=${encodedUrl}`,
        undefined
      );
    }
  );

  it.each(["", "https://example.com/recipe"])(
    "T-03: 지원하지 않는 값 %s은 오류를 보여주고 이동하지 않습니다",
    async (url) => {
      const user = userEvent.setup();
      renderHero();

      if (url) {
        await user.type(
          screen.getByRole("textbox", { name: "유튜브 URL" }),
          url
        );
      }
      await user.click(screen.getByRole("button", { name: "레시피로 만들기" }));

      expect(screen.getByRole("alert")).toHaveTextContent(
        "올바른 유튜브 링크를 입력해주세요"
      );
      expect(routerPushMock).not.toHaveBeenCalled();
    }
  );

  it("T-03: 오류 뒤 유효한 링크로 고치면 오류가 사라지고 이동합니다", async () => {
    const user = userEvent.setup();
    renderHero();
    const input = screen.getByRole("textbox", { name: "유튜브 URL" });

    await user.type(input, "https://example.com/recipe");
    await user.click(screen.getByRole("button", { name: "레시피로 만들기" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, validUrl);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "레시피로 만들기" }));

    expect(routerPushMock).toHaveBeenCalledTimes(1);
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

  it.each([
    { locale: "ko", path: "/", prefix: "" },
    { locale: "en", path: "/en", prefix: "/en" },
    { locale: "ja", path: "/ja", prefix: "/ja" },
  ] as const)(
    "T-10: $locale 문구와 추출 경로를 유지합니다",
    async ({ locale, path, prefix }) => {
      pathname = path;
      const user = userEvent.setup();
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

      await user.type(
        screen.getByRole("textbox", { name: messages.inputLabel }),
        validUrl
      );
      await user.click(screen.getByRole("button", { name: messages.submit }));

      expect(routerPushMock).toHaveBeenCalledWith(
        `${prefix}/recipes/new/youtube?url=${encodedUrl}`,
        undefined
      );
    }
  );
});
