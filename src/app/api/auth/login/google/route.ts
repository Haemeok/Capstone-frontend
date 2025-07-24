import { NextResponse } from "next/server";

import crypto from "crypto";

export async function GET() {
  try {
    const state = crypto.randomBytes(16).toString("hex");

    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!baseUrl || !googleClientId) {
      throw new Error("환경 변수가 설정되지 않았습니다.");
    }

    googleAuthUrl.searchParams.append("client_id", googleClientId);
    googleAuthUrl.searchParams.append(
      "redirect_uri",
      `${baseUrl}api/auth/callback/google`
    );
    console.log(`${baseUrl}api/auth/callback/google`);
    googleAuthUrl.searchParams.append("response_type", "code");
    googleAuthUrl.searchParams.append("scope", "openid profile email");
    googleAuthUrl.searchParams.append("state", state);

    const response = NextResponse.redirect(googleAuthUrl);

    response.cookies.set("state", state, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
    });

    return response;
  } catch (error) {
    console.error("Login initiation error:", error);
    return new NextResponse("Error initiating login", { status: 500 });
  }
}
