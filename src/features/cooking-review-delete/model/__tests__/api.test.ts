import { api } from "@/shared/api/client";

import { deleteCookingReview } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: {
    delete: jest.fn(),
  },
}));

const deleteMock = jest.mocked(api.delete);

it("후기 삭제는 연결된 기록을 삭제하지 않고 후기 endpoint만 호출합니다", async () => {
  deleteMock.mockResolvedValue({ message: "deleted" });

  await deleteCookingReview("review-delete");

  expect(deleteMock).toHaveBeenCalledTimes(1);
  expect(deleteMock).toHaveBeenCalledWith("/reviews/review-delete");
});
