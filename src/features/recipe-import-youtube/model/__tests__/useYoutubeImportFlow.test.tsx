import { act, renderHook } from "@testing-library/react";

import { useYoutubeImportFlow } from "../useYoutubeImportFlow";

type MockUser = { id: string; remainingYoutubeQuota?: number } | undefined;
type MockJob = { state: "creating" | "polling" | "completed" | "failed" };

let mockUser: MockUser;
let mockExistingJob: MockJob | undefined;
let mockMetaResult: {
  data:
    | {
        url: string;
        title: string;
        channelName: string;
        thumbnailUrl: string;
      }
    | undefined;
  isLoading: boolean;
  isFetching: boolean;
};
let mockDuplicateResult: {
  data: { recipeId?: string } | undefined;
  isLoading: boolean;
  isFetching: boolean;
};

const mockPush = jest.fn();
const mockOnLoginRequired = jest.fn();
const mockAddToast = jest.fn();
const mockCreateJob = jest.fn(() => "idem-1");
const mockSetJobId = jest.fn();
const mockFailJob = jest.fn();
const mockCreateExtractionJobV2 = jest.fn();
const mockSelectorByUrl = "__BY_URL__";

jest.mock("@/shared/i18n", () => ({
  useApiLocale: () => "en",
  useLocalizedRouter: () => ({ push: mockPush }),
  useYoutubeDict: () => ({
    sectionAnalyzingToast: "Analyzing",
    sectionExtractionFailed: "Extraction failed",
  }),
}));

jest.mock("@/shared/ui/toast", () => ({
  useToastStore: (selector: (state: { addToast: jest.Mock }) => unknown) =>
    selector({ addToast: mockAddToast }),
}));

jest.mock("@/entities/user/model/hooks", () => ({
  useMyInfoQuery: () => ({ user: mockUser }),
}));

jest.mock("../api", () => ({
  createExtractionJobV2: (...args: unknown[]) =>
    mockCreateExtractionJobV2(...args),
}));

jest.mock("../hooks", () => ({
  useYoutubeMeta: () => mockMetaResult,
  useYoutubeDuplicateCheck: () => mockDuplicateResult,
}));

jest.mock("../storeSelectors", () => ({
  jobByUrlSelector: () => mockSelectorByUrl,
}));

jest.mock("../store", () => ({
  useYoutubeImportStoreV2: (selectorOrMarker: unknown) => {
    if (selectorOrMarker === mockSelectorByUrl) return mockExistingJob;
    if (typeof selectorOrMarker === "function") {
      return selectorOrMarker({
        createJob: mockCreateJob,
        setJobId: mockSetJobId,
        failJob: mockFailJob,
      });
    }
    return undefined;
  },
}));

const validatedUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const meta = {
  url: validatedUrl,
  title: "Tomato pasta",
  channelName: "Kitchen",
  thumbnailUrl: "https://example.com/thumb.jpg",
};

const renderFlow = () =>
  renderHook(() =>
    useYoutubeImportFlow({
      validatedUrl,
      videoId: "dQw4w9WgXcQ",
      onLoginRequired: mockOnLoginRequired,
    })
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockUser = undefined;
  mockExistingJob = undefined;
  mockMetaResult = { data: meta, isLoading: false, isFetching: false };
  mockDuplicateResult = {
    data: {},
    isLoading: false,
    isFetching: false,
  };
  mockCreateExtractionJobV2.mockResolvedValue({ jobId: "job-123" });
});

it("로그아웃 사용자는 미리보기를 보되 확인 시 로그인 안내만 엽니다", async () => {
  const { result } = renderFlow();

  expect(result.current.hasYoutubeData).toBe(true);

  await act(async () => {
    await result.current.confirmImport();
  });

  expect(mockOnLoginRequired).toHaveBeenCalledTimes(1);
  expect(mockCreateJob).not.toHaveBeenCalled();
  expect(mockCreateExtractionJobV2).not.toHaveBeenCalled();
  expect(mockPush).not.toHaveBeenCalled();
});

it("로그인하고 쿼터가 충분하면 작업과 요청을 한 번 만들고 저장됨 탭으로 이동합니다", async () => {
  mockUser = { id: "user-1", remainingYoutubeQuota: 5 };
  const { result } = renderFlow();

  await act(async () => {
    await result.current.confirmImport();
  });

  expect(mockCreateJob).toHaveBeenCalledWith(validatedUrl, meta, "en");
  expect(mockCreateExtractionJobV2).toHaveBeenCalledWith(
    validatedUrl,
    "idem-1",
    undefined,
    "en"
  );
  expect(mockSetJobId).toHaveBeenCalledWith("idem-1", "job-123");
  expect(mockPush).toHaveBeenCalledWith("/users/user-1?tab=saved", undefined);
  expect(mockAddToast).toHaveBeenCalledWith({
    message: "Analyzing",
    variant: "info",
  });
});

it("추출 확인을 빠르게 연속 호출해도 작업과 요청을 한 번만 만듭니다", async () => {
  mockUser = { id: "user-1", remainingYoutubeQuota: 5 };
  let resolveRequest: ((value: { jobId: string }) => void) | undefined;
  mockCreateExtractionJobV2.mockImplementation(
    () =>
      new Promise<{ jobId: string }>((resolve) => {
        resolveRequest = resolve;
      })
  );
  const { result } = renderFlow();

  let requests: Promise<void>[] = [];
  await act(async () => {
    requests = [result.current.confirmImport(), result.current.confirmImport()];
    resolveRequest?.({ jobId: "job-123" });
    await Promise.all(requests);
  });

  expect(mockCreateJob).toHaveBeenCalledTimes(1);
  expect(mockCreateExtractionJobV2).toHaveBeenCalledTimes(1);
});

it("쿼터가 2 미만이면 작업과 추출 요청을 막습니다", async () => {
  mockUser = { id: "user-1", remainingYoutubeQuota: 1 };
  const { result } = renderFlow();

  expect(result.current.hasNoQuota).toBe(true);

  await act(async () => {
    await result.current.confirmImport();
  });

  expect(mockCreateJob).not.toHaveBeenCalled();
  expect(mockCreateExtractionJobV2).not.toHaveBeenCalled();
  expect(mockPush).not.toHaveBeenCalled();
});

it("동일 URL의 작업이 있으면 새 작업 없이 저장됨 탭으로 이동합니다", async () => {
  mockUser = { id: "user-1", remainingYoutubeQuota: 5 };
  mockExistingJob = { state: "polling" };
  const { result } = renderFlow();

  expect(result.current.isImporting).toBe(false);

  await act(async () => {
    await result.current.confirmImport();
  });

  expect(mockPush).toHaveBeenCalledWith("/users/user-1?tab=saved", undefined);
  expect(mockCreateJob).not.toHaveBeenCalled();
  expect(mockCreateExtractionJobV2).not.toHaveBeenCalled();
});

it("추출 요청이 실패하면 등록한 작업을 실패 처리하고 오류를 알립니다", async () => {
  mockUser = { id: "user-1", remainingYoutubeQuota: 5 };
  mockCreateExtractionJobV2.mockRejectedValue(new Error("network"));
  const { result } = renderFlow();

  await act(async () => {
    await result.current.confirmImport();
  });

  expect(mockFailJob).toHaveBeenCalledWith(
    "idem-1",
    undefined,
    "Extraction failed"
  );
  expect(mockAddToast).toHaveBeenLastCalledWith({
    message: "Extraction failed",
    variant: "error",
  });
});
