"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function markLandingVisited() {
  const cookieStore = await cookies();

  cookieStore.set("landing_visited", "true", {
    path: "/",
    maxAge: 31536000,
    httpOnly: false,
    sameSite: "lax",
  });

  redirect("/");
}
