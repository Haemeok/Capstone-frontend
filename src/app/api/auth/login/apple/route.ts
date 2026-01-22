import { NextResponse } from "next/server";

import crypto from "crypto";

import { getBaseUrl } from "@/shared/lib/env/getBaseUrl";

export async function GET() {
  try {
    const state = crypto.randomBytes(16).toString("hex");

    const appleAuthUrl = new URL("https://appleid.apple.com/auth/authorize");

    const baseUrl = getBaseUrl();
    const appleClientId = process.env.APPLE_CLIENT_ID;

    if (!appleClientId) {
      throw new Error("환경 변수가 설정되지 않았습니다.");
    }

    appleAuthUrl.searchParams.append("client_id", appleClientId);
    appleAuthUrl.searchParams.append(
      "redirect_uri",
      `${baseUrl}api/auth/callback/apple`
    );
    appleAuthUrl.searchParams.append("response_type", "code");
    appleAuthUrl.searchParams.append("scope", "name email");
    appleAuthUrl.searchParams.append("state", state);
    appleAuthUrl.searchParams.append("response_mode", "form_post");

    const response = NextResponse.redirect(appleAuthUrl);

    response.cookies.set("state", state, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
    });

    return response;
  } catch (error) {
    console.error("Apple login initiation error:", error);
    return new NextResponse("Error initiating login", { status: 500 });
  }
}
