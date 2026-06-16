"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function markLandingVisited(formData: FormData) {
  const cookieStore = await cookies();

  cookieStore.set("landing_visited", "true", {
    path: "/",
    maxAge: 31536000,
    httpOnly: false,
    sameSite: "lax",
  });

  const target = formData.get("localeHome");
  redirect(typeof target === "string" && target ? target : "/");
}
