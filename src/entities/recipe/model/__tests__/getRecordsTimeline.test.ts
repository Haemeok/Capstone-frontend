jest.mock("@/shared/api/client", () => ({
  api: { get: jest.fn().mockResolvedValue({ groups: [], hasNext: false }) },
}));

import { api } from "@/shared/api/client";

import { getRecordsTimeline } from "../api";

describe("getRecordsTimeline lang (T-09)", () => {
  afterEach(() => jest.clearAllMocks());

  it("lang을 params로 전달한다", async () => {
    await getRecordsTimeline({ page: 0, size: 20, lang: "en" });
    expect(api.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ lang: "en" }),
      })
    );
  });
});
