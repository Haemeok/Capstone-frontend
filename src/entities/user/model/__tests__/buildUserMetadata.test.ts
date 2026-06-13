import { User } from "../types";

jest.mock("../getPublicUserForMetadata");
import { buildUserMetadata } from "../buildUserMetadata";
import { getPublicUserForMetadata } from "../getPublicUserForMetadata";

const mockGetUser = getPublicUserForMetadata as jest.MockedFunction<
  typeof getPublicUserForMetadata
>;

const baseUser: User = {
  id: "u1",
  nickname: "유저",
  introduction: "안녕",
  profileImage: "https://img/x.png",
  hasFirstRecord: false,
  remainingAiGenerationQuota: 0,
  remainingYoutubeExtractionCredits: 0,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
};

describe("buildUserMetadata (T-04~07)", () => {
  afterEach(() => jest.resetAllMocks());

  it("en 로케일 → 영어 폴백 카피 (T-04)", async () => {
    mockGetUser.mockResolvedValue({ ...baseUser, introduction: "" });
    const m = await buildUserMetadata("u1", "en");
    expect(m.title).toBe("유저 - Recipio");
    expect(m.description).toBe("Check out this profile on Recipio.");
  });

  it("ja 로케일 → 일본어 폴백 카피 (T-05)", async () => {
    mockGetUser.mockResolvedValue({ ...baseUser, introduction: "" });
    const m = await buildUserMetadata("u1", "ja");
    expect(m.title).toBe("유저 - Recipio");
    expect(m.description).toBe(
      "Recipioでこのプロフィールをチェックしましょう。"
    );
  });

  it("introduction은 로케일 무관 그대로 description (T-06)", async () => {
    mockGetUser.mockResolvedValue(baseUser);
    for (const locale of ["ko", "ja", "en"] as const) {
      const m = await buildUserMetadata("u1", locale);
      expect(m.description).toBe("안녕");
    }
  });

  it("hreflang ko/ja/en 대체 링크 노출 (T-07)", async () => {
    mockGetUser.mockResolvedValue(baseUser);
    const m = await buildUserMetadata("u1", "en");
    const langs = m.alternates?.languages ?? {};
    expect(Object.keys(langs)).toEqual(
      expect.arrayContaining(["ko", "ja", "en"])
    );
  });
});
