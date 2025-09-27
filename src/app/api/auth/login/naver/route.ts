import { NextResponse } from "next/server";

import crypto from "crypto";

export async function GET() {
  try {
    const state = crypto.randomBytes(16).toString("hex");

    const naverAuthUrl = new URL("https://nid.naver.com/oauth2.0/authorize");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const naverClientId = process.env.NAVER_CLIENT_ID;

    if (!baseUrl || !naverClientId) {
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

    response.cookies.set("state", state, {
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
