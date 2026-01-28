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

    const naverAuthUrl = new URL("https://nid.naver.com/oauth2.0/authorize");

    const baseUrl = getBaseUrlFromRequest(request);
    const naverClientId = process.env.NAVER_CLIENT_ID;

    if (!naverClientId) {
      throw new Error("환경 변수가 설정되지 않았습니다.");
    }

    naverAuthUrl.searchParams.append("client_id", naverClientId);
    naverAuthUrl.searchParams.append(
      "redirect_uri",
      `${baseUrl}api/auth/callback/naver`
    );
    naverAuthUrl.searchParams.append("response_type", "code");
    naverAuthUrl.searchParams.append("scope", "name, email");
    naverAuthUrl.searchParams.append("state", state);

    const response = NextResponse.redirect(naverAuthUrl);

    response.cookies.set("state", csrfToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
    });

    return response;
  } catch (error) {
    console.error("Naver login initiation error:", error);
    return new NextResponse("Error initiating login", { status: 500 });
  }
}
