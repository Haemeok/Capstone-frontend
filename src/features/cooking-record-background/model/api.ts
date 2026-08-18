import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  StickerBookBackground,
  StickerBookBackgroundUpdateInput,
} from "@/entities/recipe";

export const updateStickerBookBackground = (
  input: StickerBookBackgroundUpdateInput
): Promise<StickerBookBackground> =>
  api.patch<StickerBookBackground>(END_POINTS.STICKER_BOOK_BACKGROUND, input);
