import { render, screen } from "@testing-library/react";

import { youtubeMessages } from "@/shared/i18n";

import type { YoutubeMeta } from "../../model/types";
import { YoutubePreviewCard } from "../YoutubePreviewCard";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const HANGUL = /[가-힣]/;
const meta: YoutubeMeta = {
  url: "https://www.youtube.com/watch?v=abc123",
  title: "Original Video Title",
  channelName: "Some Channel",
  thumbnailUrl: "https://img.youtube.com/vi/abc123/0.jpg",
  videoId: "abc123",
};

describe("YoutubePreviewCard i18n", () => {
  it.each([
    ["/ja/recipes/new/youtube", "ja"] as const,
    ["/en/recipes/new/youtube", "en"] as const,
    ["/recipes/new/youtube", "ko"] as const,
  ])("T-04: %s 에서 disclaimer/확인 버튼이 dict[%s]", (path, loc) => {
    mockPathname.mockReturnValue(path);
    const m = youtubeMessages[loc];
    render(<YoutubePreviewCard meta={meta} onConfirm={jest.fn()} />);
    expect(screen.getByText(m.previewAiDisclaimer)).toBeInTheDocument();
    expect(screen.getByText(m.previewConfirmButton)).toBeInTheDocument();
  });

  it("T-04: ja/en 트리에 한글이 없다(영상 제목 제외)", () => {
    mockPathname.mockReturnValue("/ja/x");
    const { container } = render(
      <YoutubePreviewCard meta={meta} onConfirm={jest.fn()} />
    );
    expect(container.textContent ?? "").not.toMatch(HANGUL);
  });

  it("T-05: isLoading 이면 버튼이 previewImporting 라벨", () => {
    mockPathname.mockReturnValue("/ja/x");
    render(<YoutubePreviewCard meta={meta} onConfirm={jest.fn()} isLoading />);
    expect(
      screen.getByText(youtubeMessages.ja.previewImporting)
    ).toBeInTheDocument();
  });
});
