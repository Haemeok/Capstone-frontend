import { cookies } from "next/headers";

import { BASE_API_URL } from "@/shared/config/constants/api";

import type { IngredientDetailApiResponse } from "./types";

export const getIngredientDetailOnServer = async (
  id: string
): Promise<IngredientDetailApiResponse | null> => {
  const API_URL = `${BASE_API_URL}/ingredients/${encodeURIComponent(id)}`;

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const res = await fetch(API_URL, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as IngredientDetailApiResponse;
  } catch (error) {
    console.error(
      `[getIngredientDetailOnServer] Failed to fetch ingredient ${id}:`,
      error
    );
    return null;
  }
};
