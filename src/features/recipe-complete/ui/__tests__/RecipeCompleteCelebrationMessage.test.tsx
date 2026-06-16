import { act, render, screen } from "@testing-library/react";

import { COOKING_COMPLETION_MESSAGE_DURATION_MS } from "@/shared/config/constants/recipe";

import RecipeCompleteCelebrationMessage from "../RecipeCompleteCelebrationMessage";

describe("RecipeCompleteCelebrationMessage", () => {
  it("T-06: title/body 렌더, 절약액·캘린더 없음", () => {
    render(
      <RecipeCompleteCelebrationMessage
        title="おつかれさまでした！🎉"
        body="召し上がれ"
        isOpen
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText("おつかれさまでした！🎉")).toBeInTheDocument();
    expect(screen.getByText("召し上がれ")).toBeInTheDocument();
    expect(screen.queryByText(/절약|캘린더/)).toBeNull();
  });

  it("T-05: duration 경과 후 onClose 1회 호출", () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    render(
      <RecipeCompleteCelebrationMessage
        title="t"
        body="b"
        isOpen
        onClose={onClose}
      />
    );
    act(() => {
      jest.advanceTimersByTime(COOKING_COMPLETION_MESSAGE_DURATION_MS);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
