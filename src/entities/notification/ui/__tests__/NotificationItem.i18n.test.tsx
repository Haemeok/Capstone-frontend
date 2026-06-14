import { render, screen } from "@testing-library/react";

import { notificationsMessages } from "@/shared/i18n/notificationsMessages";

import { NotificationItem } from "../NotificationItem";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPath() }));

const base = {
  id: 1,
  userId: 1,
  actorId: 2,
  actorNickname: "Yuki",
  imageUrl: "",
  relatedType: "RECIPE" as const,
  relatedId: 1,
  relatedUrl: "/",
  createdAt: new Date().toISOString(),
  read: true,
};

describe("NotificationItem template i18n", () => {
  it("T-24: ja NEW_COMMENT -> actor substituted, ja template, no Hangul", () => {
    mockPath.mockReturnValue("/ja/notifications");
    const { container } = render(
      <NotificationItem
        notification={{ ...base, type: "NEW_COMMENT" }}
        showActions={false}
      />
    );
    expect(container.textContent).toContain("Yuki");
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-25: unknown type -> generic fallback, no crash", () => {
    mockPath.mockReturnValue("/ja/notifications");
    const unknownNotification = {
      ...base,
      type: "__NEW__" as never,
    };
    expect(() =>
      render(
        <NotificationItem
          notification={unknownNotification}
          showActions={false}
        />
      )
    ).not.toThrow();
    expect(
      screen.getByText(notificationsMessages.ja.genericMessage)
    ).toBeInTheDocument();
  });

  it("T-26: ko NEW_COMMENT preserved (contains 댓글)", () => {
    mockPath.mockReturnValue("/notifications");
    const { container } = render(
      <NotificationItem
        notification={{ ...base, type: "NEW_COMMENT" }}
        showActions={false}
      />
    );
    expect(container.textContent).toContain("댓글");
  });
});
