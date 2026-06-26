import { User } from "@/entities/user/model/types";

export const guestUser: User = {
  id: "0",
  nickname: "게스트",
  profileImage: "",
  username: "@guest",
  introduction: "",
  hasFirstRecord: false,
  remainingAiGenerationQuota: 0,
  remainingYoutubeExtractionCredits: 0,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
};
