import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const postRecipeLike = async (id: string): Promise<void> => {
  await api.post<void>(END_POINTS.RECIPE_LIKE(id));
};
