import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getDictionary, youtubeMessages } from "@/shared/i18n";

import { DesktopYoutubeImportFlow } from "../DesktopYoutubeImportFlow";

const mockConfirmImport = jest.fn();
const mockOpenLoginDrawer = jest.fn();
const mockOnOpenChange = jest.fn();
let mockLoginRequiredHandler: () => void = jest.fn();
let mockFlow: {
  youtubeMeta?: {
    url: string;
    title: string;
    channelName: string;
    thumbnailUrl: string;
  };
  duplicateCheck?: { recipeId?: string };
  isLoading: boolean;
  isDuplicate: boolean;
  hasYoutubeData: boolean;
  isMetaError: boolean;
  hasNoQuota: boolean;
  isImporting: boolean;
  confirmImport: jest.Mock;
};

jest.mock("@/features/auth/ui/LoginEncourageDrawer/model/store", () => ({
  useLoginEncourageDrawerStore: (
    selector: (state: { openDrawer: jest.Mock }) => unknown
  ) => selector({ openDrawer: mockOpenLoginDrawer }),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock(
  "@/features/recipe-import-youtube/model/useYoutubeImportFlow",
  () => ({
    useYoutubeImportFlow: ({
      onLoginRequired,
    }: {
      onLoginRequired: () => void;
    }) => {
      mockLoginRequiredHandler = onLoginRequired;
      return mockFlow;
    },
  })
);

jest.mock("@/features/recipe-import-youtube/ui/DuplicateRecipeSection", () => ({
  __esModule: true,
  default: ({
    recipeId,
    isEmbedded,
  }: {
    recipeId: string;
    isEmbedded?: boolean;
  }) =>
    isEmbedded ? <div data-testid="duplicate-recipe">{recipeId}</div> : null,
}));

jest.mock("@/widgets/AIRecipeForm/UsageLimitBanner", () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid="usage-limit-banner">{message}</div>
  ),
}));

const messages = getDictionary("ko").home.desktopYoutubeImport;
const normalizedUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const meta = {
  url: normalizedUrl,
  title: "김치볶음밥 만드는 법",
  channelName: "오늘의 주방",
  thumbnailUrl: "https://example.com/kimchi.jpg",
};

const renderFlow = (isOpen = true) =>
  render(
    <DesktopYoutubeImportFlow
      messages={messages}
      initialUrl={normalizedUrl}
      initialVideoId="dQw4w9WgXcQ"
      isOpen={isOpen}
      onOpenChange={mockOnOpenChange}
    />
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockLoginRequiredHandler = jest.fn();
  mockFlow = {
    youtubeMeta: undefined,
    duplicateCheck: {},
    isLoading: true,
    isDuplicate: false,
    hasYoutubeData: false,
    isMetaError: false,
    hasNoQuota: false,
    isImporting: false,
    confirmImport: mockConfirmImport,
  };
});

it("T-05: 영상 정보를 확인하는 동안 모달에 로딩 화면을 표시합니다", () => {
  renderFlow();

  const dialog = screen.getByRole("dialog");
  expect(dialog).toBeInTheDocument();
  const closeButtons = within(dialog).getAllByRole("button", {
    name: /^(닫기|Close)$/,
  });
  expect(closeButtons).toHaveLength(1);
  expect(closeButtons[0]).toHaveAttribute("data-slot", "dialog-close");
  expect(screen.getByTestId("desktop-youtube-preview-loading")).toBeVisible();
});

it("T-05: 새 영상의 실제 정보와 기존 가져오기 버튼을 모달에 표시합니다", async () => {
  const user = userEvent.setup();
  mockFlow = {
    ...mockFlow,
    youtubeMeta: meta,
    isLoading: false,
    hasYoutubeData: true,
  };
  renderFlow();

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "김치볶음밥 만드는 법" })
  ).toBeVisible();
  expect(screen.getByText("오늘의 주방")).toBeInTheDocument();

  await user.click(
    screen.getByRole("button", {
      name: youtubeMessages.ko.previewConfirmButton,
    })
  );

  expect(mockConfirmImport).toHaveBeenCalledTimes(1);
});

it("T-06: 로그인 안내를 열기 전에 미리보기 모달을 닫습니다", async () => {
  const user = userEvent.setup();
  mockConfirmImport.mockImplementation(() => mockLoginRequiredHandler());
  mockFlow = {
    ...mockFlow,
    youtubeMeta: meta,
    isLoading: false,
    hasYoutubeData: true,
  };
  renderFlow();

  await user.click(
    screen.getByRole("button", {
      name: youtubeMessages.ko.previewConfirmButton,
    })
  );

  expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  expect(mockOpenLoginDrawer).toHaveBeenCalledTimes(1);
});

it("T-07: 이용 한도가 없으면 기존 안내와 비활성 버튼을 표시합니다", () => {
  mockFlow = {
    ...mockFlow,
    youtubeMeta: meta,
    isLoading: false,
    hasYoutubeData: true,
    hasNoQuota: true,
  };
  renderFlow();

  expect(screen.getByTestId("usage-limit-banner")).toHaveTextContent(
    youtubeMessages.ko.sectionQuotaExhausted
  );
  expect(
    screen.getByRole("button", {
      name: youtubeMessages.ko.previewConfirmButton,
    })
  ).toBeDisabled();
});

it("T-05: 영상 정보 조회 실패를 모달 안에서 알립니다", () => {
  mockFlow = { ...mockFlow, isLoading: false, isMetaError: true };
  renderFlow();

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent(
    youtubeMessages.ko.sectionMetaErrorTitle
  );
});

it("닫힌 상태에서는 미리보기 모달을 표시하지 않습니다", () => {
  act(() => renderFlow(false));

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("T-09, T-10: 중복 영상은 미리보기 대신 기존 중복 모달 하나만 표시합니다", () => {
  mockFlow = {
    ...mockFlow,
    youtubeMeta: meta,
    duplicateCheck: { recipeId: "recipe-1" },
    isLoading: false,
    isDuplicate: true,
    hasYoutubeData: true,
  };
  renderFlow();

  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  expect(screen.getByTestId("duplicate-recipe")).toHaveTextContent("recipe-1");
  expect(
    screen.queryByRole("heading", { name: messages.eyebrow })
  ).not.toBeInTheDocument();
});

it("T-13: 로딩에서 중복 결과로 바뀌어도 처음 열린 모달을 유지합니다", () => {
  const { rerender } = render(
    <DesktopYoutubeImportFlow
      messages={messages}
      initialUrl={normalizedUrl}
      initialVideoId="dQw4w9WgXcQ"
      isOpen
      onOpenChange={mockOnOpenChange}
    />
  );
  const initiallyOpenedDialog = screen.getByRole("dialog");

  mockFlow = {
    ...mockFlow,
    youtubeMeta: meta,
    duplicateCheck: { recipeId: "recipe-1" },
    isLoading: false,
    isDuplicate: true,
    hasYoutubeData: true,
  };
  rerender(
    <DesktopYoutubeImportFlow
      messages={messages}
      initialUrl={normalizedUrl}
      initialVideoId="dQw4w9WgXcQ"
      isOpen
      onOpenChange={mockOnOpenChange}
    />
  );

  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  expect(screen.getByRole("dialog")).toBe(initiallyOpenedDialog);
});

it("T-10: 중복 결과에서도 홈 모달 닫기를 유지합니다", async () => {
  const user = userEvent.setup();
  mockFlow = {
    ...mockFlow,
    youtubeMeta: meta,
    duplicateCheck: { recipeId: "recipe-1" },
    isLoading: false,
    isDuplicate: true,
    hasYoutubeData: true,
  };
  renderFlow();

  await user.click(
    screen.getByRole("button", {
      name: getDictionary("ko").common.actions.close,
    })
  );

  expect(mockOnOpenChange).toHaveBeenCalledWith(false);
});
