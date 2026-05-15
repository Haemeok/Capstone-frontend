import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

import ChatEmptyState from "../ChatEmptyState";

describe("ChatEmptyState", () => {
  it("quick prompt chips are not visually disabled when onQuickQuestion is provided", () => {
    render(<ChatEmptyState onQuickQuestion={jest.fn()} />);
    const storageChip = screen.getByText("보관 방법 알려주세요");
    const button = storageChip.closest("button");
    expect(button).not.toBeDisabled();
  });

  it("tapping a chip invokes onQuickQuestion with the chip label", () => {
    const onQuickQuestion = jest.fn();
    render(<ChatEmptyState onQuickQuestion={onQuickQuestion} />);
    fireEvent.click(screen.getByText("보관 방법 알려주세요"));
    expect(onQuickQuestion).toHaveBeenCalledWith("보관 방법 알려주세요");
  });

  it("when onQuickQuestion is undefined, chips are disabled (locked state)", () => {
    render(<ChatEmptyState />);
    const button = screen.getByText("보관 방법 알려주세요").closest("button");
    expect(button).toBeDisabled();
  });
});
