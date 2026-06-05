import { render, screen } from "@testing-library/react";

import { type Notification } from "@/entities/notification/model/type";

import { NotificationItem } from "../NotificationItem";

const base: Notification = {
  id: 1,
  userId: 1,
  actorId: 2,
  actorNickname: "친구",
  imageUrl: "",
  type: "REFERRAL_REWARD_GRANTED",
  relatedType: "REFERRAL_REDEMPTION",
  relatedId: 1,
  relatedUrl: "",
  createdAt: new Date().toISOString(),
  read: false,
};

describe("REFERRAL_REWARD_GRANTED 알림 (T-701)", () => {
  it("서버 message를 그대로 보여주고 actorNickname은 노출하지 않는다", () => {
    render(
      <NotificationItem
        notification={{ ...base, message: "광고 제거 1개월이 추가됐어요." }}
        showActions={false}
      />
    );
    expect(
      screen.getByText("광고 제거 1개월이 추가됐어요.")
    ).toBeInTheDocument();
    expect(screen.queryByText("친구")).not.toBeInTheDocument();
  });

  it("message가 없으면 폴백 문구를 보여준다", () => {
    render(<NotificationItem notification={base} showActions={false} />);
    expect(
      screen.getByText("추천 보상으로 광고 제거 혜택이 추가됐어요.")
    ).toBeInTheDocument();
  });
});
