import { NextRequest, NextResponse } from "next/server";

import { encryptTokenData } from "@/shared/lib/auth/crypto";
import { parseOAuthState } from "@/shared/lib/auth/oauthState";
import { getBaseUrlFromRequest } from "@/shared/lib/env/getBaseUrl";
import { getEnvHeader } from "@/shared/lib/env/getEnvHeader";

const DEEP_LINK_SCHEME = "recipio://auth/callback";

export async function GET(request: NextRequest) {
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

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => undefined);
      console.error("Backend token exchange failed:", errorBody);
      throw new Error("Failed to exchange token with backend.");
    }

    const setCookieHeaders = backendRes.headers.getSetCookie();
    const baseUrl = getBaseUrlFromRequest(request);

    if (isApp) {
      const encryptedToken = encryptTokenData(setCookieHeaders);
      const deepLinkUrl = `${DEEP_LINK_SCHEME}?code=${encodeURIComponent(encryptedToken)}`;
      const response = NextResponse.redirect(deepLinkUrl);
      response.cookies.set("state", "", { maxAge: 0 });
      return response;
    }

    const redirectUrl = new URL(baseUrl);
    const finalResponse = NextResponse.redirect(redirectUrl);

    finalResponse.cookies.set("state", "", { maxAge: 0 });

    setCookieHeaders.forEach((cookie) => {
      finalResponse.headers.append("Set-Cookie", cookie);
    });

    return finalResponse;
  } catch (error) {
    console.error("OAuth callback error:", error);
    const baseUrl = getBaseUrlFromRequest(request);
    return NextResponse.redirect(`${baseUrl}login/error`);
  }
}
