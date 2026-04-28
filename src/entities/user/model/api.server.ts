import { cookies } from "next/headers";

import { BASE_API_URL } from "@/shared/config/constants/api";

import { User } from "./types";

export const getMeOnServer = async (): Promise<User | null> => {
  const API_URL = `${BASE_API_URL}/me`;

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
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("[getMeOnServer] Failed to fetch current user:", error);
    return null;
  }
};
