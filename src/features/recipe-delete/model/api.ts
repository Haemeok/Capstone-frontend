import { api } from "@/shared/api/client";

export const deleteRecipe = async (id: string) => {
  const response = await api.delete(`/bff/recipes/${id}`);
  return response;
};
