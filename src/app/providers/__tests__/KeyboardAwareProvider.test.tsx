import { render } from "@testing-library/react";

import { KeyboardAwareProvider } from "../KeyboardAwareProvider";

const mockSetKeyboardState = jest.fn();
const mockUseKeyboardSource = jest.fn();

jest.mock("@/shared/lib/hooks/useKeyboardSource", () => ({
  useKeyboardSource: () => mockUseKeyboardSource(),
}));

jest.mock("@/shared/store/useKeyboardStore", () => ({
  useKeyboardStore: (
    selector: (state: { setKeyboardState: typeof mockSetKeyboardState }) => void
  ) => selector({ setKeyboardState: mockSetKeyboardState }),
}));

describe("KeyboardAwareProvider", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36",
    });
    mockUseKeyboardSource.mockReturnValue({
      height: 320,
      isOpen: true,
      source: "bridge",
    });
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: jest.fn(),
    });
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    });
    Object.defineProperty(window, "cancelAnimationFrame", {
      configurable: true,
      value: jest.fn(),
    });
  });

  it("안드로이드 키보드가 열리면 포커스된 입력칸을 스크롤 영역 안에 유지", () => {
    const { getByRole } = render(
      <KeyboardAwareProvider>
        <textarea aria-label="요리 후기" autoFocus />
      </KeyboardAwareProvider>
    );

    expect(getByRole("textbox")).toHaveFocus();
    expect(getByRole("textbox").scrollIntoView).toHaveBeenCalledWith({
      block: "nearest",
      inline: "nearest",
    });
  });
});
