import { api } from "@/shared/api/client";

import { reportCookingReview } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: {
    post: jest.fn(),
  },
}));

const postMock = jest.mocked(api.post);

describe("cooking-review report API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(["INAPPROPRIATE", "SPAM", "COPYRIGHT", "ETC"] as const)(
    "%s 사유와 선택적 상세를 그대로 신고 body로 보냅니다",
    async (reasonType) => {
      postMock.mockResolvedValue({ message: "reported" });

      await reportCookingReview("review-report", {
        reasonType,
        detail: "음식 사진이 아님",
      });

      expect(postMock).toHaveBeenCalledWith("/reviews/review-report/reports", {
        reasonType,
        detail: "음식 사진이 아님",
      });
    }
  );

  it("detail이 200자를 넘으면 네트워크 전에 거절합니다", async () => {
    await expect(
      reportCookingReview("review-long", {
        reasonType: "ETC",
        detail: "가".repeat(201),
      })
    ).rejects.toThrow("신고 상세는 200자 이하여야 합니다.");

    expect(postMock).not.toHaveBeenCalled();
  });

  it("중복 신고의 HTTP 200 no-op 응답도 성공으로 반환합니다", async () => {
    const response = { message: "already reported" };
    postMock.mockResolvedValue(response);

    await expect(
      reportCookingReview("review-duplicate", { reasonType: "SPAM" })
    ).resolves.toEqual(response);
  });
});
