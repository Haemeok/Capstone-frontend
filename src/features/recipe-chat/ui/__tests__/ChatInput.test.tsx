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

  it("when unauthenticated, textarea is readOnly and looks enabled (no disabled attribute)", () => {
    render(
      <ChatInput
        isAuthenticated={false}
        isPending={false}
        isLocked={false}
        lockedReason={null}
        onSubmit={jest.fn()}
      />
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("readOnly");
    expect(textarea).not.toBeDisabled();
    expect(textarea).toHaveAttribute(
      "placeholder",
      "이 레시피에 대해서 어떤 게 궁금하신가요?"
    );
  });

  it("when unauthenticated, mousedown on textarea opens login drawer + light haptic", () => {
    render(
      <ChatInput
        isAuthenticated={false}
        isPending={false}
        isLocked={false}
        lockedReason={null}
        onSubmit={jest.fn()}
      />
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.mouseDown(textarea);
    expect(mockOpenDrawer).toHaveBeenCalledTimes(1);
    expect(mockOpenDrawer).toHaveBeenCalledWith({
      message: "레시피 챗봇에게 물어보세요!",
    });
    expect(mockHaptic).toHaveBeenCalledWith("Light");
  });

  it("when unauthenticated, touchStart on textarea opens login drawer + light haptic", () => {
    render(
      <ChatInput
        isAuthenticated={false}
        isPending={false}
        isLocked={false}
        lockedReason={null}
        onSubmit={jest.fn()}
      />
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.touchStart(textarea);
    expect(mockOpenDrawer).toHaveBeenCalledTimes(1);
    expect(mockHaptic).toHaveBeenCalledWith("Light");
  });

  it("when unauthenticated, clicking send button opens drawer (does not submit form)", () => {
    const onSubmit = jest.fn();
    render(
      <ChatInput
        isAuthenticated={false}
        isPending={false}
        isLocked={false}
        lockedReason={null}
        onSubmit={onSubmit}
      />
    );
    fireEvent.click(screen.getByLabelText("질문 전송"));
    expect(mockOpenDrawer).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
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
    const textarea = screen.getByRole("textbox");
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
