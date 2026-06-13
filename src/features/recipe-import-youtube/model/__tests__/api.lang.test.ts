import { api } from "@/shared/api/client";

import { checkYoutubeDuplicate, createExtractionJobV2 } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: {
    get: jest.fn(async () => ({})),
    post: jest.fn(async () => ({ jobId: "job-1" })),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe("youtube extraction api lang (T-09/T-10/T-12)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("T-09: ja 추출 시 extract params에 lang=ja", async () => {
    await createExtractionJobV2("https://youtu.be/x", "key-1", undefined, "ja");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/youtube/extract",
      null,
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja" }),
      })
    );
  });

  it("T-09: en 추출 시 extract params에 lang=en", async () => {
    await createExtractionJobV2("https://youtu.be/x", "key-1", undefined, "en");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/youtube/extract",
      null,
      expect.objectContaining({
        params: expect.objectContaining({ lang: "en" }),
      })
    );
  });

  it("T-12: ko 추출 시 extract params에 lang 없음", async () => {
    await createExtractionJobV2("https://youtu.be/x", "key-1", undefined, "ko");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/youtube/extract",
      null,
      expect.objectContaining({
        params: expect.not.objectContaining({ lang: expect.anything() }),
      })
    );
  });

  it("T-10: ja 중복체크 시 check params에 lang=ja", async () => {
    await checkYoutubeDuplicate("https://youtu.be/x", "ja");
    expect(mockedApi.get).toHaveBeenCalledWith(
      "/dev/recipes/youtube/check",
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja" }),
      })
    );
  });
});
