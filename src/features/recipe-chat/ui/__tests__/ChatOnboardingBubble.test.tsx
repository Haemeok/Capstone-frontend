import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

jest.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: {
    div: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      (props, ref) => <div ref={ref} {...props} />
    ),
  },
}));

import ChatOnboardingBubble from "../ChatOnboardingBubble";

const STORAGE_KEY = "recipe-chat:bubble-seen-v1";

describe("ChatOnboardingBubble", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("appears after 800ms delay on first mount", () => {
    render(<ChatOnboardingBubble onClick={jest.fn()} isOpen={false} isAuthenticated={true} />);
    expect(screen.queryByText(/궁금한 게 있으면 물어봐 주세요/)).toBeNull();
    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(screen.getByText(/궁금한 게 있으면 물어봐 주세요/)).toBeInTheDocument();
  });

  it("does not appear when session storage marks it seen", () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    render(<ChatOnboardingBubble onClick={jest.fn()} isOpen={false} isAuthenticated={true} />);
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(screen.queryByText(/궁금한 게 있으면 물어봐 주세요/)).toBeNull();
  });

  it("does not appear while drawer is open", () => {
    render(<ChatOnboardingBubble onClick={jest.fn()} isOpen={true} isAuthenticated={true} />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryByText(/궁금한 게 있으면 물어봐 주세요/)).toBeNull();
  });

  it("clicking the bubble body fires onClick", () => {
    const onClick = jest.fn();
    render(<ChatOnboardingBubble onClick={onClick} isOpen={false} isAuthenticated={true} />);
    act(() => {
      jest.advanceTimersByTime(800);
    });
    fireEvent.click(screen.getByRole("button", { name: /챗봇 열기/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("clicking close X dismisses and sets sessionStorage", () => {
    render(<ChatOnboardingBubble onClick={jest.fn()} isOpen={false} isAuthenticated={true} />);
    act(() => {
      jest.advanceTimersByTime(800);
    });
    fireEvent.click(screen.getByLabelText("말풍선 닫기"));
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("1");
  });

  it("unauth variant shows '로그인 필요' subtext", () => {
    render(<ChatOnboardingBubble onClick={jest.fn()} isOpen={false} isAuthenticated={false} />);
    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(screen.getByText("로그인 필요")).toBeInTheDocument();
  });
});
