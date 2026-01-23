import { NextRequest, NextResponse } from "next/server";

import { getEnvHeader } from "@/shared/lib/env/getEnvHeader";

export async function POST(request: NextRequest) {
  try {
    const xEnv = getEnvHeader(request);

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

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => undefined);
      console.error("❌ Test login failed:", errorBody);
      return NextResponse.json(
        { success: false, error: "Test login failed" },
        { status: backendRes.status }
      );
    }

    const setCookieHeaders = backendRes.headers.getSetCookie();

    const response = NextResponse.json({ success: true });

    setCookieHeaders.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (error) {
    console.error("❌ Test login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
