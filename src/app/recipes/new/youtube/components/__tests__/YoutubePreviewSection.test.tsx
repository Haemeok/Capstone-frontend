import { act, fireEvent, render, screen } from "@testing-library/react";

type MockUser = { id: string; remainingYoutubeQuota?: number } | undefined;
type MockMeta = { title: string; channelTitle: string; thumbnailUrl: string };
type MockJob = { state: "creating" | "polling" | "done" | "failed" };

let mockUser: MockUser;
let mockValidatedUrl: string | null = null;
let mockVideoId: string | null = null;
let mockUrlSource: "direct" | "trending" | null = null;
let mockMetaResult: {
  data: MockMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
} = { data: undefined, isLoading: false, isFetching: false };
let mockDuplicateResult: {
  data: { recipeId: string } | undefined;
  isLoading: boolean;
  isFetching: boolean;
} = { data: undefined, isLoading: false, isFetching: false };
let mockExistingJob: MockJob | undefined;

const mockPush = jest.fn();
const mockOnLoginRequired = jest.fn();
const mockAddToast = jest.fn();
const mockCreateJob = jest.fn(() => "idem-1");
const mockSetJobId = jest.fn();
const mockFailJob = jest.fn();
const mockCreateExtractionJobV2 = jest.fn();

const mockSelectorByUrl = "__BY_URL__";

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const MockDynamic = () => <div data-testid="duplicate-section" />;
    return MockDynamic;
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("motion/react", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  const cleanProps = (props: Record<string, unknown>) => {
    const {
      variants: _v,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      ...rest
    } = props;
    return rest;
  };
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    motion: new Proxy(
      {},
      {
        get: () => (props: Record<string, unknown>) =>
          React.createElement("div", cleanProps(props)),
      }
    ),
  };
});

jest.mock("@/shared/hooks/useAutoScrollOnMobile", () => ({
  useAutoScrollOnMobile: () => ({ current: null }),
}));

jest.mock("@/shared/ui/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("@/shared/ui/shadcn/skeleton", () => ({
  Skeleton: () => <div />,
}));

jest.mock("@/entities/user/model/hooks", () => ({
  useMyInfoQuery: () => ({ user: mockUser }),
}));

jest.mock("@/features/recipe-import-youtube/model/api", () => ({
  createExtractionJobV2: (...args: unknown[]) =>
    mockCreateExtractionJobV2(...args),
}));

jest.mock("@/features/recipe-import-youtube/model/hooks", () => ({
  useYoutubeMeta: () => mockMetaResult,
  useYoutubeDuplicateCheck: () => mockDuplicateResult,
}));

jest.mock("@/features/recipe-import-youtube/model/storeSelectors", () => ({
  jobByUrlSelector: () => mockSelectorByUrl,
}));

jest.mock("@/features/recipe-import-youtube/model/store", () => ({
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

jest.mock("@/features/recipe-import-youtube/ui/YoutubePreviewCard", () => ({
  YoutubePreviewCard: ({
    onConfirm,
    disabled,
    isLoading,
  }: {
    onConfirm: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  }) => (
    <button
      data-testid="confirm-button"
      onClick={onConfirm}
      disabled={disabled}
    >
      {isLoading ? "loading" : "추출하기"}
    </button>
  ),
}));

jest.mock("@/widgets/AIRecipeForm/UsageLimitBanner", () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid="usage-limit-banner">{message}</div>
  ),
}));

jest.mock("@/widgets/Toast", () => ({
  useToastStore: (selector: (state: { addToast: jest.Mock }) => unknown) =>
    selector({ addToast: mockAddToast }),
}));

jest.mock("../YoutubeUrlProvider", () => ({
  useYoutubeUrl: () => ({
    validatedUrl: mockValidatedUrl,
    videoId: mockVideoId,
    urlSource: mockUrlSource,
  }),
}));

import { YoutubePreviewSection } from "../YoutubePreviewSection";

const META: MockMeta = {
  title: "Test Video",
  channelTitle: "Ch",
  thumbnailUrl: "",
};

const setLoadedMeta = () => {
  mockValidatedUrl = "https://youtu.be/test";
  mockVideoId = "test";
  mockMetaResult = { data: META, isLoading: false, isFetching: false };
  mockDuplicateResult = {
    data: undefined,
    isLoading: false,
    isFetching: false,
  };
};

const renderSection = () =>
  render(<YoutubePreviewSection onLoginRequired={mockOnLoginRequired} />);

beforeEach(() => {
  jest.clearAllMocks();
  mockUser = undefined;
  mockValidatedUrl = null;
  mockVideoId = null;
  mockUrlSource = null;
  mockMetaResult = { data: undefined, isLoading: false, isFetching: false };
  mockDuplicateResult = {
    data: undefined,
    isLoading: false,
    isFetching: false,
  };
  mockExistingJob = undefined;
  mockCreateExtractionJobV2.mockResolvedValue({ jobId: "job-123" });
});

describe("YoutubePreviewSection — 비로그인 추출 가드", () => {
  it("비로그인 + 유효 URL 미리보기에서는 만료 배너 미표시, 추출 버튼 활성", () => {
    setLoadedMeta();
    renderSection();

    expect(screen.queryByTestId("usage-limit-banner")).not.toBeInTheDocument();
    expect(screen.getByTestId("confirm-button")).not.toBeDisabled();
  });

  it("비로그인 + 추출 버튼 클릭 → onLoginRequired 호출, mutation 호출 없음", () => {
    setLoadedMeta();
    renderSection();

    fireEvent.click(screen.getByTestId("confirm-button"));

    expect(mockOnLoginRequired).toHaveBeenCalledTimes(1);
    expect(mockCreateJob).not.toHaveBeenCalled();
    expect(mockCreateExtractionJobV2).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("비로그인 + 메타 로딩 중에는 추출 버튼이 렌더되지 않음", () => {
    mockValidatedUrl = "https://youtu.be/test";
    mockVideoId = "test";
    mockMetaResult = { data: undefined, isLoading: true, isFetching: true };

    renderSection();

    expect(screen.queryByTestId("confirm-button")).not.toBeInTheDocument();
  });

  it("비로그인 + 중복 케이스는 DuplicateRecipeSection을 렌더, 일반 카드는 미렌더", () => {
    setLoadedMeta();
    mockDuplicateResult = {
      data: { recipeId: "rec-1" },
      isLoading: false,
      isFetching: false,
    };

    renderSection();

    expect(screen.getByTestId("duplicate-section")).toBeInTheDocument();
    expect(screen.queryByTestId("confirm-button")).not.toBeInTheDocument();
  });

  it("비로그인 + 추출 버튼 두 번 클릭 → onLoginRequired 매번 호출 (state 누수 없음)", () => {
    setLoadedMeta();
    renderSection();

    const button = screen.getByTestId("confirm-button");
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockOnLoginRequired).toHaveBeenCalledTimes(2);
  });
});

describe("YoutubePreviewSection — 로그인 사용자 기존 동작 보존", () => {
  it("로그인 + quota 1 → 만료 배너 표시, 추출 버튼 비활성", () => {
    setLoadedMeta();
    mockUser = { id: "u1", remainingYoutubeQuota: 1 };

    renderSection();

    expect(screen.getByTestId("usage-limit-banner")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-button")).toBeDisabled();
  });

  it("로그인 + quota 충분 + 클릭 → mutation 호출, onLoginRequired 미호출", async () => {
    setLoadedMeta();
    mockUser = { id: "u1", remainingYoutubeQuota: 5 };

    renderSection();

    await act(async () => {
      fireEvent.click(screen.getByTestId("confirm-button"));
    });

    expect(mockOnLoginRequired).not.toHaveBeenCalled();
    expect(mockCreateJob).toHaveBeenCalledTimes(1);
    expect(mockCreateExtractionJobV2).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/users/u1?tab=saved");
  });

  it("로그인 + 진행 중 기존 job + 클릭 → 본인 페이지로 이동, mutation 호출 없음", () => {
    setLoadedMeta();
    mockUser = { id: "u1", remainingYoutubeQuota: 5 };
    mockExistingJob = { state: "polling" };

    renderSection();

    fireEvent.click(screen.getByTestId("confirm-button"));

    expect(mockPush).toHaveBeenCalledWith("/users/u1?tab=saved");
    expect(mockCreateJob).not.toHaveBeenCalled();
    expect(mockCreateExtractionJobV2).not.toHaveBeenCalled();
  });
});
