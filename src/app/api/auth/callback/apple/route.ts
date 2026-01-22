import { NextRequest, NextResponse } from "next/server";

import { getBaseUrlFromRequest } from "@/shared/lib/env/getBaseUrl";
import { getEnvHeader } from "@/shared/lib/env/getEnvHeader";

// Apple 취소/에러 시 GET으로 오는 경우 처리
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  console.log("🍎 [Apple OAuth GET] 요청 수신");
  console.log("🍎 [Apple OAuth GET] URL:", request.url);
  console.log("🍎 [Apple OAuth GET] error:", error);
  console.log("🍎 [Apple OAuth GET] error_description:", errorDescription);
  console.log("🍎 [Apple OAuth GET] 모든 params:", Object.fromEntries(searchParams));

  const baseUrl = getBaseUrlFromRequest(request);

  // GET으로 온 경우 = 취소 또는 에러 → 로그인 에러 페이지로
  return NextResponse.redirect(`${baseUrl}login/error`);
}

// Apple 성공 시 POST로 오는 경우 처리
export async function POST(request: NextRequest) {
  try {
    console.log("🍎 [Apple OAuth POST] 요청 수신");
    console.log("🍎 [Apple OAuth POST] URL:", request.url);
    console.log("🍎 [Apple OAuth POST] Host:", request.headers.get("host"));

    const formData = await request.formData();
    const stateFromApple = formData.get("state") as string | null;
    const code = formData.get("code") as string | null;
    const user = formData.get("user") as string | null;
    const error = formData.get("error") as string | null;

    console.log("🍎 [Apple OAuth POST] formData 파싱 결과:");
    console.log("  - code:", code ? `${code.substring(0, 20)}...` : null);
    console.log("  - state:", stateFromApple);
    console.log("  - user:", user ? "(있음)" : "(없음)");
    console.log("  - error:", error);

    // POST로 왔는데 error가 있으면 실패
    if (error) {
      console.error("🍎 [Apple OAuth POST] Apple에서 에러 반환:", error);
      const baseUrl = getBaseUrlFromRequest(request);
      return NextResponse.redirect(`${baseUrl}login/error`);
    }

    const stateFromCookie = request.cookies.get("state")?.value;
    console.log("🍎 [Apple OAuth POST] Cookie state:", stateFromCookie);

    if (
      !stateFromApple ||
      !stateFromCookie ||
      stateFromApple !== stateFromCookie
    ) {
      console.error("🍎 [Apple OAuth POST] State 불일치!");
      console.error("  - Apple state:", stateFromApple);
      console.error("  - Cookie state:", stateFromCookie);
      throw new Error("Invalid state parameter. CSRF attack detected.");
    }

    if (!code) {
      console.error("🍎 [Apple OAuth POST] code가 없음!");
      throw new Error("Authorization code not found.");
    }

    const xEnv = getEnvHeader();
    const baseUrl = getBaseUrlFromRequest(request);

    console.log("🍎 [Apple OAuth POST] 백엔드 요청 준비:");
    console.log("  - X-Env:", xEnv);
    console.log("  - baseUrl:", baseUrl);

    const requestBody: { code: string; state: string; user?: string } = {
      code,
      state: stateFromApple,
    };

    if (user) {
      requestBody.user = user;
    }

    console.log("🍎 [Apple OAuth POST] 백엔드 호출: https://api.recipio.kr/login/oauth2/code/apple");

    const backendRes = await fetch(
      `https://api.recipio.kr/login/oauth2/code/apple`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Env": xEnv,
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("🍎 [Apple OAuth POST] 백엔드 응답:");
    console.log("  - status:", backendRes.status);
    console.log("  - statusText:", backendRes.statusText);

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => undefined);
      console.error("🍎 [Apple OAuth POST] 백엔드 에러 응답:", JSON.stringify(errorBody, null, 2));
      throw new Error("Failed to exchange token with backend.");
    }

    const setCookieHeaders = backendRes.headers.getSetCookie();
    console.log("🍎 [Apple OAuth POST] Set-Cookie 헤더 수:", setCookieHeaders.length);

    const redirectUrl = new URL(baseUrl);
    const finalResponse = NextResponse.redirect(redirectUrl);

    finalResponse.cookies.set("state", "", { maxAge: 0 });

    setCookieHeaders.forEach((cookie) => {
      finalResponse.headers.append("Set-Cookie", cookie);
    });

    console.log("🍎 [Apple OAuth POST] ✅ 성공! 리다이렉트:", baseUrl);
    return finalResponse;
  } catch (error) {
    console.error("🍎 [Apple OAuth POST] ❌ 에러 발생:", error);
    const baseUrl = getBaseUrlFromRequest(request);
    return NextResponse.redirect(`${baseUrl}login/error`);
  }
}
