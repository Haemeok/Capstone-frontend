import { NextResponse } from "next/server";

import crypto from "crypto";

import { getBaseUrl } from "@/shared/lib/env/getBaseUrl";

export async function GET() {
  try {
    const state = crypto.randomBytes(16).toString("hex");

    const kakaoAuthUrl = new URL("https://kauth.kakao.com/oauth/authorize");

    const baseUrl = getBaseUrl();
    const kakaoClientId = process.env.KAKAO_CLIENT_ID;

    if (!kakaoClientId) {
      throw new Error("환경 변수가 설정되지 않았습니다.");
    }

    kakaoAuthUrl.searchParams.append("client_id", kakaoClientId);
    kakaoAuthUrl.searchParams.append(
      "redirect_uri",
      `${baseUrl}api/auth/callback/kakao`
    );
    kakaoAuthUrl.searchParams.append("response_type", "code");
    kakaoAuthUrl.searchParams.append(
      "scope",
      "profile_nickname, account_email"
    );
    kakaoAuthUrl.searchParams.append("state", state);

    const response = NextResponse.redirect(kakaoAuthUrl);

    response.cookies.set("state", state, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
    });

    return response;
  } catch (error) {
    console.error("Kakao login initiation error:", error);
    return new NextResponse("Error initiating login", { status: 500 });
  }
}
