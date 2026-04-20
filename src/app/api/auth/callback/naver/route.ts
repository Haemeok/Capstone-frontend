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
const DIAG_SOURCE = "next-oauth-callback-naver";

export async function GET(request: NextRequest) {
  const diagId = generateDiagId();
  authDiagLog({ phase: "oauth-callback-start", source: DIAG_SOURCE, diagId });

  try {
    const { searchParams } = new URL(request.url);
    const stateFromProvider = searchParams.get("state");
    const code = searchParams.get("code");
    const stateFromCookie = request.cookies.get("state")?.value;

    const { csrfToken, isApp } = parseOAuthState(stateFromProvider);

    if (!csrfToken || !stateFromCookie || csrfToken !== stateFromCookie) {
      throw new Error("Invalid state parameter. CSRF attack detected.");
    }

    if (!code) {
      throw new Error("Authorization code not found.");
    }

    const xEnv = getEnvHeader(request);

    const backendRes = await fetch(
      `https://api.recipio.kr/login/oauth2/code/naver`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Env": xEnv,
        },
        body: JSON.stringify({ code, state: stateFromProvider }),
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
      console.error("Backend token exchange failed:", errorBody);
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

    const baseUrl = getBaseUrlFromRequest(request);

    if (isApp) {
      if (process.env.USE_TEMP_TOKEN === "true") {
        const token = await storeTempToken(setCookieHeaders);
        const deepLinkUrl = `${DEEP_LINK_SCHEME}?code=${token}`;
        const response = NextResponse.redirect(deepLinkUrl);
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
      const response = NextResponse.redirect(deepLinkUrl);
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
    const finalResponse = NextResponse.redirect(redirectUrl);

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
    console.error("OAuth callback error:", error);
    authDiagLog({
      phase: "oauth-callback-exception",
      source: DIAG_SOURCE,
      diagId,
      meta: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    const baseUrl = getBaseUrlFromRequest(request);
    return NextResponse.redirect(`${baseUrl}login/error`);
  }
}
