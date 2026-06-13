import { User } from "@/entities/user/model/types";

import { generateMetadata } from "../page";

jest.mock("@/entities/user/model/getPublicUserForMetadata");

import { getPublicUserForMetadata } from "@/entities/user/model/getPublicUserForMetadata";

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

const mk = (over: Partial<User>) =>
  mockGetUser.mockResolvedValue({ ...baseUser, ...over });

const params = Promise.resolve({ userId: "u1" });

describe("generateMetadata (T-601~603)", () => {
  afterEach(() => jest.resetAllMocks());

  it("T-601/602/603: 닉네임 제목, 소개 description, 이미지 og", async () => {
    mk({});
    const m = await generateMetadata({ params });
    expect(m.title).toContain("유저");
    expect(m.description).toBe("안녕");
    expect(m.openGraph?.images).toEqual([{ url: "https://img/x.png" }]);
  });

  it("T-602: 소개 없으면 폴백 description", async () => {
    mk({ introduction: "" });
    const m = await generateMetadata({ params });
    expect(m.description).toBe(
      "유저님의 레시피와 요리 활동을 레시피오에서 확인해보세요."
    );
  });

  it("T-603: 이미지 없으면 폴백 이미지", async () => {
    mk({ profileImage: "" });
    const m = await generateMetadata({ params });
    expect(m.openGraph?.images).toEqual([
      { url: expect.stringContaining("og-default") },
    ]);
  });
});
