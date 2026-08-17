import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { deleteCookingRecord } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: { delete: jest.fn() },
}));

const apiDelete = jest.mocked(api.delete);

it("기록 DELETE는 레코드 경로만 독립적으로 호출합니다", async () => {
  apiDelete.mockResolvedValue({ message: "deleted" });

  const response = await deleteCookingRecord("record-String");

  expect(apiDelete).toHaveBeenCalledWith(END_POINTS.MY_RECORD("record-String"));
  expect(response).toEqual({ message: "deleted" });
});
