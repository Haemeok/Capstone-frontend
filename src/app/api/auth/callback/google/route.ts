import { NextRequest, NextResponse } from "next/server";

import { getBaseUrl } from "@/shared/lib/env/getBaseUrl";
import { getEnvHeader } from "@/shared/lib/env/getEnvHeader";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateFromGoogle = searchParams.get("state");
    const code = searchParams.get("code");
    const stateFromCookie = request.cookies.get("state")?.value;

    if (
      !stateFromGoogle ||
      !stateFromCookie ||
      stateFromGoogle !== stateFromCookie
    ) {
      throw new Error("Invalid state parameter. CSRF attack detected.");
    }

    if (!code) {
      throw new Error("Authorization code not found.");
    }

    const xEnv = getEnvHeader();

    const backendRes = await fetch(
      `https://api.recipio.kr/login/oauth2/code/google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Env": xEnv,
        },
        body: JSON.stringify({ code, state: stateFromGoogle }),
      }
    );

    if (!backendRes.ok) {
      const errorBody = await backendRes.json();
      console.error("Backend token exchange failed:", errorBody);
      throw new Error("Failed to exchange token with backend.");
    }

    const setCookieHeaders = backendRes.headers.getSetCookie();

    const baseUrl = getBaseUrl();
    const redirectUrl = new URL(baseUrl);
    const finalResponse = NextResponse.redirect(redirectUrl);

    finalResponse.cookies.set("state", "", { maxAge: 0 });

    setCookieHeaders.forEach((cookie) => {
      finalResponse.headers.append("Set-Cookie", cookie);
    });

    return finalResponse;
  } catch (error) {
    console.error("OAuth callback error:", error);
    const baseUrl = getBaseUrl();
    return NextResponse.redirect(`${baseUrl}login/error`);
  }
}
