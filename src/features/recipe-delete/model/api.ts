import { api } from "@/shared/api/client";

export const deleteRecipe = async (id: number) => {
  const response = await api.delete(`/recipes/${id}`);
  return response;
};
