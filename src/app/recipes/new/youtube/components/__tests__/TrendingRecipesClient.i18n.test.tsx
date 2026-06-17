import { render, screen } from "@testing-library/react";

jest.mock("@/shared/ui/image/Image", () => ({
  __esModule: true,
  Image: ({ alt }: { alt?: string }) => <img alt={alt ?? ""} />,
}));

import { youtube as ja } from "@/shared/i18n/messages/ja/youtube";
import { youtube as ko } from "@/shared/i18n/messages/ko/youtube";

import { TrendingRecipesClient } from "../TrendingRecipesClient";
import { YoutubeUrlProvider } from "../YoutubeUrlProvider";

const RECIPE = {
  videoId: "v1",
  title: "親子丼",
  channelName: "ch",
  thumbnailUrl: "https://example.com/t.jpg",
  viewCount: 23000,
  videoUrl: "https://youtube.com/watch?v=v1",
};

const renderClient = (
  recipes: (typeof RECIPE)[],
  dict: typeof ja,
  locale: "ko" | "ja" | "en"
) =>
  render(
    <YoutubeUrlProvider initialUrl="">
      <TrendingRecipesClient recipes={recipes} dict={dict} locale={locale} />
    </YoutubeUrlProvider>
  );

it("T-10: ja 헤더가 현지어다", () => {
  renderClient([RECIPE], ja, "ja");
  expect(screen.getByText("話題のレシピ")).toBeInTheDocument();
});
it("T-11: recipes=[]면 빈 상태 메시지가 ja로 보인다", () => {
  renderClient([], ja, "ja");
  expect(
    screen.getByText("おすすめのレシピがありません。")
  ).toBeInTheDocument();
});
it("T-12: 이전/다음 버튼 aria가 ja다", () => {
  renderClient([RECIPE], ja, "ja");
  expect(screen.getByLabelText("前へ")).toBeInTheDocument();
  expect(screen.getByLabelText("次へ")).toBeInTheDocument();
});
it("T-13: ko 조회수 포맷이 기존(만/천)과 동일하다", () => {
  renderClient([RECIPE], ko, "ko");
  expect(screen.getByText("조회수 2.3만회")).toBeInTheDocument();
});
