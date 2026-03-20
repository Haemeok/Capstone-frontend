import { NextRequest, NextResponse } from "next/server";

import { decryptTokenData } from "@/shared/lib/auth/crypto";
import { retrieveTempToken } from "@/shared/lib/auth/tempToken";
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
      if (process.env.USE_TEMP_TOKEN === "true") {
        cookies = await retrieveTempToken(code);
      } else {
        cookies = decryptTokenData(code);
      }
    } catch (error) {
      console.error("[App Callback] 토큰 처리 실패:", error);
      return NextResponse.redirect(
        `${baseUrl}login/error?reason=invalid_token`
      );
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
