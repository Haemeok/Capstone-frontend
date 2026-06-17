import { youtubeMessages } from "@/shared/i18n";

import { JOB_POLLING_CONFIG } from "../../lib/constants";
import {
  completePollingJob,
  type JobPollingDeps,
  recoverZombieJob,
} from "../jobPollingHandlers";
import { useYoutubeImportStoreV2 } from "../store";
import type { YoutubeMeta } from "../types";

const meta: YoutubeMeta = {
  url: "https://www.youtube.com/watch?v=abc123",
  title: "元の動画タイトル",
  channelName: "Ch",
  thumbnailUrl: "https://img.youtube.com/vi/abc123/0.jpg",
  videoId: "abc123",
};

const makeDeps = (): JobPollingDeps => ({
  queryClient: {
    invalidateQueries: jest.fn(),
  } as unknown as JobPollingDeps["queryClient"], // 테스트: 사용 메서드만 stub
  addToast: jest.fn(),
  router: { push: jest.fn() } as unknown as JobPollingDeps["router"], // 테스트: push만 사용
  storeActions: {
    completeJob: jest.fn(),
    failJob: jest.fn(),
    removeJob: jest.fn(),
    setJobId: jest.fn(),
    updateLastPollTime: jest.fn(),
    updateJobProgress: jest.fn(),
    incrementRetryCount: jest.fn(),
  },
});

beforeEach(() => {
  useYoutubeImportStoreV2.setState({ jobs: {} });
  jest.clearAllMocks();
});

describe("jobPollingHandlers i18n", () => {
  it.each(["ja", "en", "ko"] as const)(
    "T-06: completePollingJob 토스트 제목이 dict[%s]",
    (loc) => {
      const key = useYoutubeImportStoreV2
        .getState()
        .createJob(meta.url, meta, loc);
      const deps = makeDeps();
      completePollingJob(deps, key, "recipe-1");
      expect(deps.addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          richContent: expect.objectContaining({
            title: youtubeMessages[loc].extractionCompleteTitle,
          }),
        })
      );
    }
  );

  it("T-08: 토스트 subtitle 은 영상 제목 원문(비번역)", () => {
    const key = useYoutubeImportStoreV2
      .getState()
      .createJob(meta.url, meta, "ja");
    const deps = makeDeps();
    completePollingJob(deps, key, "recipe-1");
    expect(deps.addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        richContent: expect.objectContaining({ subtitle: meta.title }),
      })
    );
  });

  it("T-07: 재시도 초과 시 에러 토스트가 dict[locale].maxRetryExceeded", async () => {
    const key = useYoutubeImportStoreV2
      .getState()
      .createJob(meta.url, meta, "en");
    const job = {
      ...useYoutubeImportStoreV2.getState().jobs[key],
      retryCount: JOB_POLLING_CONFIG.MAX_RETRY_COUNT,
    };
    const deps = makeDeps();
    await recoverZombieJob(deps, job);
    expect(deps.addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: youtubeMessages.en.maxRetryExceeded,
        variant: "error",
      })
    );
  });
});
