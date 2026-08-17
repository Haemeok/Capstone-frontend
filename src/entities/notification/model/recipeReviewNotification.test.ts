import { getNotificationMessage } from "./constants";
import type { Notification } from "./type";

describe("recipe review notification contract", () => {
  it("RECIPE relatedType과 문자열 relatedId를 사용하는 RECIPE_REVIEW를 허용합니다", () => {
    const notification: Notification = {
      id: "notification-A",
      userId: "user-A",
      actorId: "user-B",
      actorNickname: "민지",
      imageUrl: "",
      type: "RECIPE_REVIEW",
      relatedType: "RECIPE",
      relatedId: "recipe-string-id",
      relatedUrl: "/recipes/recipe-string-id",
      createdAt: "2026-08-17T12:00:00+09:00",
      read: false,
    };

    expect(notification.relatedType).toBe("RECIPE");
    expect(notification.relatedId).toBe("recipe-string-id");
    expect(
      getNotificationMessage(notification.type, notification.actorNickname)
    ).toContain("민지");
  });
});
