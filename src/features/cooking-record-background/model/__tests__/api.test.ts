import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { updateStickerBookBackground } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: { patch: jest.fn() },
}));

it("목록에서 받은 backgroundKey를 전용 변경 경로에 그대로 전달합니다", async () => {
  const response = {
    backgroundKey: "PAPER_BEIGE",
    imageUrl: "https://cdn.example.com/paper-beige.webp",
  };
  jest.mocked(api.patch).mockResolvedValue(response);

  await expect(
    updateStickerBookBackground({ backgroundKey: "PAPER_BEIGE" })
  ).resolves.toEqual(response);
  expect(api.patch).toHaveBeenCalledWith(END_POINTS.STICKER_BOOK_BACKGROUND, {
    backgroundKey: "PAPER_BEIGE",
  });
});
