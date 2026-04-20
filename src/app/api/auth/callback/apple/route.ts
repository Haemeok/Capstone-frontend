import { NextRequest, NextResponse } from "next/server";

import {
  authDiagLog,
  fingerprintFromSetCookies,
  generateDiagId,
} from "@/shared/lib/auth/diag";
import { encryptTokenData } from "@/shared/lib/auth/crypto";
import { parseOAuthState } from "@/shared/lib/auth/oauthState";
import { storeTempToken } from "@/shared/lib/auth/tempToken";
import { getBaseUrlFromRequest } from "@/shared/lib/env/getBaseUrl";
import { getEnvHeader } from "@/shared/lib/env/getEnvHeader";

const DEEP_LINK_SCHEME = "recipio://auth/callback";
const DIAG_SOURCE = "next-oauth-callback-apple";

// Apple 취소/에러 시 GET으로 오는 경우 처리
export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrlFromRequest(request);
  return NextResponse.redirect(`${baseUrl}login/error`, 303);
}

// Apple 성공 시 POST로 오는 경우 처리
export async function POST(request: NextRequest) {
  const diagId = generateDiagId();
  authDiagLog({ phase: "oauth-callback-start", source: DIAG_SOURCE, diagId });

  try {
    const formData = await request.formData();
    const stateFromApple = formData.get("state") as string | null;
    const code = formData.get("code") as string | null;
    const user = formData.get("user") as string | null;
    const error = formData.get("error") as string | null;

    if (error) {
      console.error("[Apple OAuth] Apple에서 에러 반환:", error);
      authDiagLog({
        phase: "oauth-provider-error",
        source: DIAG_SOURCE,
        diagId,
        meta: { error },
      });
      const baseUrl = getBaseUrlFromRequest(request);
      return NextResponse.redirect(`${baseUrl}login/error`, 303);
    }

    const stateFromCookie = request.cookies.get("state")?.value;
    const { csrfToken, isApp } = parseOAuthState(stateFromApple);

    if (!csrfToken || !stateFromCookie || csrfToken !== stateFromCookie) {
      console.error("[Apple OAuth] State 불일치!");
      throw new Error("Invalid state parameter. CSRF attack detected.");
    }

    if (!code || !stateFromApple) {
      console.error("[Apple OAuth] code 또는 state가 없음!");
      throw new Error("Authorization code not found.");
    }

    const xEnv = getEnvHeader(request);
    const baseUrl = getBaseUrlFromRequest(request);

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

    authDiagLog({
      phase: "oauth-backend-response",
      source: DIAG_SOURCE,
      diagId,
      status: backendRes.status,
      meta: { isApp },
    });

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => undefined);
      console.error("[Apple OAuth] 백엔드 에러 응답:", errorBody);
      throw new Error("Failed to exchange token with backend.");
    }

    const setCookieHeaders = backendRes.headers.getSetCookie();
    const backendSetCookieAccessFp = fingerprintFromSetCookies(
      setCookieHeaders,
      "accessToken"
    );
    const backendSetCookieRefreshFp = fingerprintFromSetCookies(
      setCookieHeaders,
      "refreshToken"
    );

    authDiagLog({
      phase: "oauth-backend-setcookie",
      source: DIAG_SOURCE,
      diagId,
      backendSetCookieAccessFp,
      backendSetCookieRefreshFp,
      meta: { setCookieCount: setCookieHeaders.length, isApp },
    });

    if (isApp) {
      if (process.env.USE_TEMP_TOKEN === "true") {
        const token = await storeTempToken(setCookieHeaders);
        const deepLinkUrl = `${DEEP_LINK_SCHEME}?code=${token}`;
        const response = NextResponse.redirect(deepLinkUrl, 303);
        response.cookies.set("state", "", { maxAge: 0 });
        authDiagLog({
          phase: "oauth-app-deeplink-redirect",
          source: DIAG_SOURCE,
          diagId,
          backendSetCookieAccessFp,
          backendSetCookieRefreshFp,
          meta: { tokenMode: "temp" },
        });
        return response;
      }

      const encryptedToken = encryptTokenData(setCookieHeaders);
      const deepLinkUrl = `${DEEP_LINK_SCHEME}?code=${encodeURIComponent(encryptedToken)}`;
      const response = NextResponse.redirect(deepLinkUrl, 303);
      response.cookies.set("state", "", { maxAge: 0 });
      authDiagLog({
        phase: "oauth-app-deeplink-redirect",
        source: DIAG_SOURCE,
        diagId,
        backendSetCookieAccessFp,
        backendSetCookieRefreshFp,
        meta: { tokenMode: "encrypted" },
      });
      return response;
    }

    const redirectUrl = new URL(baseUrl);
    const finalResponse = NextResponse.redirect(redirectUrl, 303);

    finalResponse.cookies.set("state", "", { maxAge: 0 });

    setCookieHeaders.forEach((cookie) => {
      finalResponse.headers.append("Set-Cookie", cookie);
    });

    authDiagLog({
      phase: "oauth-web-redirect",
      source: DIAG_SOURCE,
      diagId,
      backendSetCookieAccessFp,
      backendSetCookieRefreshFp,
      meta: { appendedCount: setCookieHeaders.length },
    });

    return finalResponse;
  } catch (error) {
    console.error("[Apple OAuth] 에러 발생:", error);
    authDiagLog({
      phase: "oauth-callback-exception",
      source: DIAG_SOURCE,
      diagId,
      meta: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    const baseUrl = getBaseUrlFromRequest(request);
    return NextResponse.redirect(`${baseUrl}login/error`, 303);
  }
}
