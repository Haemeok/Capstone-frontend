import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";

import { User } from "./types";

export const getPublicUserForMetadata = async (
  userId: string
): Promise<User | null> => {
  try {
    const res = await fetch(`${BASE_API_URL}${END_POINTS.USER_INFO(userId)}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as User; // API response shape matches User
  } catch {
    return null;
  }
};
