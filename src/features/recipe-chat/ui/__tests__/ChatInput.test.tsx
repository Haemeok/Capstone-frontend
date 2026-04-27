import { fireEvent, render, screen } from "@testing-library/react";

const mockOpenDrawer = jest.fn();

jest.mock("@/widgets/LoginEncourageDrawer/model/store", () => ({
  useLoginEncourageDrawerStore: () => ({ openDrawer: mockOpenDrawer }),
}));
jest.mock("@/shared/store/useInputFocusStore", () => ({
  useInputFocusStore: () => ({ setInputFocused: jest.fn() }),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

import { triggerHaptic } from "@/shared/lib/bridge";

import ChatInput from "../ChatInput";

const mockHaptic = triggerHaptic as jest.Mock;

describe("ChatInput", () => {
  beforeEach(() => {
    mockOpenDrawer.mockClear();
    mockHaptic.mockClear();
  });

  it("when unauthenticated, clicking the disabled input opens login drawer", () => {
    render(
      <ChatInput
        isAuthenticated={false}
        isPending={false}
        isLocked={false}
        lockedReason={null}
        onSubmit={jest.fn()}
      />
    );
    fireEvent.click(screen.getByTestId("chat-input-wrapper"));
    expect(mockOpenDrawer).toHaveBeenCalledTimes(1);
  });

  it("when authenticated, submitting calls onSubmit with text", () => {
    const onSubmit = jest.fn();
    render(
      <ChatInput
        isAuthenticated={true}
        isPending={false}
        isLocked={false}
        lockedReason={null}
        onSubmit={onSubmit}
      />
    );
    const textarea = screen.getByPlaceholderText(/궁금한 걸 물어보세요/);
    fireEvent.change(textarea, { target: { value: "이거 매워요?" } });
    fireEvent.click(screen.getByLabelText("질문 전송"));
    expect(onSubmit).toHaveBeenCalledWith("이거 매워요?");
    expect(mockHaptic).toHaveBeenCalledWith("Light");
  });

  it("when locked (quota exhausted), submit button is disabled", () => {
    render(
      <ChatInput
        isAuthenticated={true}
        isPending={false}
        isLocked={true}
        lockedReason="오늘 한도를 다 썼어요"
        onSubmit={jest.fn()}
      />
    );
    const button = screen.getByLabelText("질문 전송");
    expect(button).toBeDisabled();
  });
});
