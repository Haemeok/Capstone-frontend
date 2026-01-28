import { NextRequest, NextResponse } from "next/server";

import { retrieveAndDeleteToken } from "@/shared/lib/auth/tokenExchangeCache";
import { getBaseUrlFromRequest } from "@/shared/lib/env/getBaseUrl";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const baseUrl = getBaseUrlFromRequest(request);

    if (!code) {
      console.error("[App Callback] 교환 코드가 없음");
      return NextResponse.redirect(`${baseUrl}login/error?reason=invalid`);
    }

    const cookies = retrieveAndDeleteToken(code);

    if (!cookies) {
      console.error("[App Callback] 교환 코드가 만료되었거나 존재하지 않음");
      return NextResponse.redirect(`${baseUrl}login/error?reason=expired`);
    }

    const response = NextResponse.redirect(baseUrl);

    cookies.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (error) {
    console.error("[App Callback] 에러 발생:", error);
    const baseUrl = getBaseUrlFromRequest(request);
    return NextResponse.redirect(`${baseUrl}login/error`);
  }
}
