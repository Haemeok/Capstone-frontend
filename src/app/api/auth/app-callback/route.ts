import { NextRequest, NextResponse } from "next/server";

import { decryptTokenData } from "@/shared/lib/auth/crypto";
import { getBaseUrlFromRequest } from "@/shared/lib/env/getBaseUrl";

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrlFromRequest(request);

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      console.error("[App Callback] 토큰 코드가 없음");
      return NextResponse.redirect(`${baseUrl}login/error?reason=invalid`);
    }

    let cookies: string[];

    try {
      cookies = decryptTokenData(code);
    } catch (decryptError) {
      console.error("[App Callback] 토큰 복호화 실패:", decryptError);
      return NextResponse.redirect(`${baseUrl}login/error?reason=invalid_token`);
    }

    const response = NextResponse.redirect(baseUrl);

    cookies.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (error) {
    console.error("[App Callback] 에러 발생:", error);
    return NextResponse.redirect(`${baseUrl}login/error`);
  }
}
