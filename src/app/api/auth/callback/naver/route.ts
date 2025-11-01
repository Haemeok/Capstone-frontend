import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateFromProvider = searchParams.get("state");
    const code = searchParams.get("code");
    const stateFromCookie = request.cookies.get("state")?.value;

    if (
      !stateFromProvider ||
      !stateFromCookie ||
      stateFromProvider !== stateFromCookie
    ) {
      throw new Error("Invalid state parameter. CSRF attack detected.");
    }

    if (!code) {
      throw new Error("Authorization code not found.");
    }

    const xEnv = process.env.NODE_ENV === "development" ? "local" : "prod";

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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "/";
    const finalResponse = NextResponse.redirect(baseUrl);

    finalResponse.cookies.set("state", "", { maxAge: 0 });

    setCookieHeaders.forEach((cookie) => {
      finalResponse.headers.append("Set-Cookie", cookie);
    });

    return finalResponse;
  } catch (error) {
    console.error("OAuth callback error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "/";
    return NextResponse.redirect(`${baseUrl}login/error`);
  }
}
