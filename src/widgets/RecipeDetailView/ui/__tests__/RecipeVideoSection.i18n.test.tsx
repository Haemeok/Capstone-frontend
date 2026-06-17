import { render } from "@testing-library/react";

import {
  DictionaryProvider,
  formatCompactNumber,
  getDictionary,
} from "@/shared/i18n";

import RecipeVideoSection from "../RecipeVideoSection";

const HANGUL = /[가-힣]/;

jest.mock("@/shared/ui/YouTubeVideoPlayer", () => ({
  YouTubeVideoPlayer: () => null,
}));

const meta = {
  channelName: "Test Channel",
  channelProfileUrl: "https://example.com/p.jpg",
  subscriberCount: 12300,
  channelId: "abc",
};

const renderVideo = (locale: "ko" | "ja" | "en") =>
  render(
    <DictionaryProvider dict={getDictionary(locale)}>
      <RecipeVideoSection
        videoUrl="https://youtu.be/x"
        youtubeMetadata={meta}
        locale={locale}
      />
    </DictionaryProvider>
  );

describe("RecipeVideoSection subscriber i18n", () => {
  it("T-13: ja -> 구독자 수 compact 포맷, 한글 없음", () => {
    const { baseElement } = renderVideo("ja");
    expect(baseElement.textContent).toContain(
      formatCompactNumber(meta.subscriberCount, "ja")
    );
    expect(HANGUL.test(baseElement.textContent ?? "")).toBe(false);
  });

  it("T-14(anchor): ko -> 구독자 + 만", () => {
    const { baseElement } = renderVideo("ko");
    expect(baseElement.textContent).toContain("구독자");
    expect(baseElement.textContent).toContain("만");
  });
});
