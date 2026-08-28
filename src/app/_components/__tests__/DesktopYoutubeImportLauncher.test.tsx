import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getDictionary } from "@/shared/i18n";

import { DesktopYoutubeImportLauncher } from "../DesktopYoutubeImportLauncher";

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () =>
    function MockDesktopYoutubeImportFlow({
      initialUrl,
      initialVideoId,
      isOpen,
      onOpenChange,
    }: {
      initialUrl: string;
      initialVideoId: string;
      isOpen: boolean;
      onOpenChange: (open: boolean) => void;
    }) {
      if (!isOpen) return null;

      return (
        <div role="dialog" data-testid="active-youtube-import-flow">
          <span>{initialUrl}</span>
          <span>{initialVideoId}</span>
          <button type="button" onClick={() => onOpenChange(false)}>
            모달 닫기
          </button>
        </div>
      );
    },
}));

const messages = getDictionary("ko").home.desktopYoutubeImport;
const validUrl = "https://youtu.be/dQw4w9WgXcQ";
const normalizedUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const renderLauncher = () =>
  render(
    <DesktopYoutubeImportLauncher
      messages={messages}
      copy={<div>정적 카피</div>}
      initialPreview={<div data-testid="initial-preview">초기 예시</div>}
    />
  );

const pasteUrl = (url: string) => {
  fireEvent.paste(screen.getByRole("textbox", { name: messages.inputLabel }), {
    clipboardData: { getData: () => url },
  });
};

it("T-01: 유효한 링크를 붙여 넣으면 추가 클릭 없이 모달을 엽니다", () => {
  renderLauncher();

  pasteUrl(validUrl);

  const flow = screen.getByRole("dialog");
  expect(flow).toHaveTextContent(normalizedUrl);
  expect(flow).toHaveTextContent("dQw4w9WgXcQ");
});

it("T-02: 입력 버튼을 없애고 모달이 열려도 우측 변환 예시를 유지합니다", () => {
  renderLauncher();

  expect(
    screen.queryByRole("button", { name: messages.submit })
  ).not.toBeInTheDocument();

  pasteUrl(validUrl);

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByTestId("initial-preview")).toBeInTheDocument();
});

it("T-03: 지원하지 않는 링크를 붙여 넣으면 오류만 표시합니다", () => {
  renderLauncher();

  pasteUrl("https://example.com/recipe");

  expect(screen.getByRole("alert")).toHaveTextContent(messages.invalidUrl);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("T-04: 모달을 닫아도 링크를 유지하고 입력창 포커스로 다시 엽니다", async () => {
  const user = userEvent.setup();
  renderLauncher();
  const input = screen.getByRole("textbox", { name: messages.inputLabel });

  pasteUrl(validUrl);
  await user.click(screen.getByRole("button", { name: "모달 닫기" }));

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(input).toHaveValue(normalizedUrl);

  await user.click(input);

  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
