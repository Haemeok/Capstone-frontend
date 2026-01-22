import { NextRequest, NextResponse } from "next/server";

import { getBaseUrlFromRequest } from "@/shared/lib/env/getBaseUrl";
import { getEnvHeader } from "@/shared/lib/env/getEnvHeader";

// Apple 취소/에러 시 GET으로 오는 경우 처리
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");

  const baseUrl = getBaseUrlFromRequest(request);

  if (error) {
    console.error("Apple OAuth error (GET):", error);
  }

  // GET으로 온 경우 = 취소 또는 에러 → 로그인 에러 페이지로
  return NextResponse.redirect(`${baseUrl}login/error`);
}

// Apple 성공 시 POST로 오는 경우 처리
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const stateFromApple = formData.get("state") as string | null;
    const code = formData.get("code") as string | null;
    const user = formData.get("user") as string | null;

    const stateFromCookie = request.cookies.get("state")?.value;

    if (
      !stateFromApple ||
      !stateFromCookie ||
      stateFromApple !== stateFromCookie
    ) {
      throw new Error("Invalid state parameter. CSRF attack detected.");
    }

    if (!code) {
      throw new Error("Authorization code not found.");
    }

    const xEnv = getEnvHeader();

    const requestBody: { code: string; state: string; user?: string } = {
      code,
      state: stateFromApple,
    };

    if (user) {
      requestBody.user = user;
    }

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

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => undefined);
      console.error("Backend token exchange failed for Apple:", errorBody);
      throw new Error("Failed to exchange token with backend.");
    }

    const setCookieHeaders = backendRes.headers.getSetCookie();

    const baseUrl = getBaseUrlFromRequest(request);
    const redirectUrl = new URL(baseUrl);
    const finalResponse = NextResponse.redirect(redirectUrl);

    finalResponse.cookies.set("state", "", { maxAge: 0 });

    setCookieHeaders.forEach((cookie) => {
      finalResponse.headers.append("Set-Cookie", cookie);
    });

    return finalResponse;
  } catch (error) {
    console.error("Apple OAuth callback error:", error);
    const baseUrl = getBaseUrlFromRequest(request);
    return NextResponse.redirect(`${baseUrl}login/error`);
  }
}
