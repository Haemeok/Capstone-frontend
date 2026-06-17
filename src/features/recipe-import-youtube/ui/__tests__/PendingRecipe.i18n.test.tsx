import { render, screen } from "@testing-library/react";

import { youtubeMessages } from "@/shared/i18n";

const HANGUL = /[가-힣]/;

import { useYoutubeImportStoreV2 } from "../../model/store";
import type { ActiveJob, YoutubeMeta } from "../../model/types";
import { PendingRecipeCard } from "../PendingRecipeCard";
import { PendingRecipeSection } from "../PendingRecipeSection";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const meta: YoutubeMeta = {
  url: "https://www.youtube.com/watch?v=abc123",
  title: "Original Video Title",
  channelName: "Some Channel",
  thumbnailUrl: "https://img.youtube.com/vi/abc123/0.jpg",
  videoId: "abc123",
};

const baseJob = {
  idempotencyKey: "k1",
  url: meta.url,
  meta,
  jobId: "j1",
  startTime: 1_000,
  lastPollTime: 1_000,
  retryCount: 0,
  locale: "ja" as const,
};

const seed = (job: ActiveJob) =>
  useYoutubeImportStoreV2.setState({ jobs: { k1: job } });

beforeEach(() => {
  useYoutubeImportStoreV2.setState({ jobs: {} });
});

describe("PendingRecipe i18n", () => {
  it.each([
    ["/ja/users/u1", "ja"] as const,
    ["/en/users/u1", "en"] as const,
    ["/users/u1", "ko"] as const,
  ])("T-09: %s 섹션 제목이 dict[%s]", (path, loc) => {
    mockPathname.mockReturnValue(path);
    seed({ ...baseJob, state: "polling", progress: 10 });
    render(<PendingRecipeSection pendingJobKeys={["k1"]} />);
    expect(
      screen.getByText(youtubeMessages[loc].pendingSectionTitle)
    ).toBeInTheDocument();
  });

  it.each([["/ja/users/u1"] as const, ["/en/users/u1"] as const])(
    "T-09: %s 섹션 렌더 트리에 한글이 없다(placeholder 포함)",
    (path) => {
      mockPathname.mockReturnValue(path);
      seed({ ...baseJob, state: "polling", progress: 10 });
      const { container } = render(
        <PendingRecipeSection pendingJobKeys={["k1"]} />
      );
      expect(container.textContent ?? "").not.toMatch(HANGUL);
    }
  );

  it("T-10: pending 진행 라벨이 `<extractingStatus> · N%` 형식", () => {
    mockPathname.mockReturnValue("/en/users/u1");
    seed({ ...baseJob, state: "polling", progress: 42 });
    render(<PendingRecipeCard idempotencyKey="k1" />);
    const re = new RegExp(`${youtubeMessages.en.extractingStatus} · \\d+%`);
    expect(screen.getByText(re)).toBeInTheDocument();
  });

  it("T-11: success → 완료 라벨 dict[locale]", () => {
    mockPathname.mockReturnValue("/ja/users/u1");
    seed({
      ...baseJob,
      state: "completed",
      progress: 100,
      resultRecipeId: "r1",
    });
    render(<PendingRecipeCard idempotencyKey="k1" />);
    expect(
      screen.getByText(youtubeMessages.ja.extractionSuccessStatus)
    ).toBeInTheDocument();
  });

  it("T-11: failed(빈 message) → 실패 기본 라벨 dict[locale]", () => {
    mockPathname.mockReturnValue("/en/users/u1");
    seed({
      ...baseJob,
      state: "failed",
      progress: 0,
      code: undefined,
      message: "",
    });
    render(<PendingRecipeCard idempotencyKey="k1" />);
    expect(
      screen.getByText(youtubeMessages.en.extractionFailureDefault)
    ).toBeInTheDocument();
  });

  it("T-12: failed → 닫기 버튼 텍스트 + aria-label dict[locale]", () => {
    mockPathname.mockReturnValue("/en/users/u1");
    seed({
      ...baseJob,
      state: "failed",
      progress: 0,
      code: undefined,
      message: "boom",
    });
    render(<PendingRecipeCard idempotencyKey="k1" />);
    expect(
      screen.getByText(youtubeMessages.en.errorCloseButton)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(youtubeMessages.en.errorCloseLabel)
    ).toBeInTheDocument();
  });
});
