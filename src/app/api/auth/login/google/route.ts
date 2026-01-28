import { NextRequest, NextResponse } from "next/server";

import { createOAuthState } from "@/shared/lib/auth/oauthState";
import { getBaseUrlFromRequest } from "@/shared/lib/env/getBaseUrl";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");

    const { state, csrfToken } = createOAuthState(
      platform === "app" ? "app" : undefined
    );

    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );

    const baseUrl = getBaseUrlFromRequest(request);
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      throw new Error("환경 변수가 설정되지 않았습니다.");
    }

    googleAuthUrl.searchParams.append("client_id", googleClientId);
    googleAuthUrl.searchParams.append(
      "redirect_uri",
      `${baseUrl}api/auth/callback/google`
    );

    googleAuthUrl.searchParams.append("response_type", "code");
    googleAuthUrl.searchParams.append("scope", "openid profile email");
    googleAuthUrl.searchParams.append("state", state);

    const response = NextResponse.redirect(googleAuthUrl);

    response.cookies.set("state", csrfToken, {
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
