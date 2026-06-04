import { NextRequest, NextResponse } from "next/server";

import { getBaseUrlFromRequest } from "@/shared/lib/env/getBaseUrl";
import { getEnvHeader } from "@/shared/lib/env/getEnvHeader";

export async function GET(request: NextRequest) {
  try {
    const xEnv = getEnvHeader(request);
    console.log("🧪 [Test Login] 요청 시작");
    console.log("🧪 [Test Login] X-Env:", xEnv);

    const backendRes = await fetch(
      "https://api.recipio.kr/api/token/test-login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Env": xEnv,
        },
      }
    );

    console.log("🧪 [Test Login] 백엔드 응답 status:", backendRes.status);
    console.log(
      "🧪 [Test Login] 백엔드 응답 statusText:",
      backendRes.statusText
    );

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => undefined);
      console.error("❌ [Test Login] 백엔드 에러:", errorBody);
      const baseUrl = getBaseUrlFromRequest(request);
      return NextResponse.redirect(`${baseUrl}login/error`);
    }

    const setCookieHeaders = backendRes.headers.getSetCookie();
    console.log("🧪 [Test Login] Set-Cookie 헤더 수:", setCookieHeaders.length);
    console.log("🧪 [Test Login] Set-Cookie 헤더:", setCookieHeaders);

    const baseUrl = getBaseUrlFromRequest(request);
    console.log("🧪 [Test Login] baseUrl:", baseUrl);

    const redirectUrl = new URL(baseUrl);
    const finalResponse = NextResponse.redirect(redirectUrl);

    setCookieHeaders.forEach((cookie) => {
      finalResponse.headers.append("Set-Cookie", cookie);
    });

    console.log("🧪 [Test Login] ✅ 성공! 리다이렉트:", baseUrl);
    return finalResponse;
  } catch (error) {
    console.error("❌ [Test Login] 에러:", error);
    const baseUrl = getBaseUrlFromRequest(request);
    return NextResponse.redirect(`${baseUrl}login/error`);
  }
}
