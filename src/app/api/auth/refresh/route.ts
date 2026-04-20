import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";
import {
  authDiagLog,
  fingerprint,
  fingerprintFromSetCookies,
  generateDiagId,
} from "@/shared/lib/auth/diag";

const DIAG_SOURCE = "next-refresh-route";

export async function POST(request: NextRequest) {
  const diagId = generateDiagId();
  authDiagLog({ phase: "refresh-start", source: DIAG_SOURCE, diagId });

  try {
    const cookieStore = await cookies();
    const origin = request.headers.get("origin");

    const accessFp = fingerprint(cookieStore.get("accessToken")?.value);
    const refreshFp = fingerprint(cookieStore.get("refreshToken")?.value);

    authDiagLog({
      phase: "refresh-cookie-read",
      source: DIAG_SOURCE,
      diagId,
      accessFp,
      refreshFp,
    });

    const hasRefreshToken = cookieStore
      .getAll()
      .some((c) => c.name === "refreshToken");

    if (!hasRefreshToken) {
      authDiagLog({
        phase: "refresh-no-token",
        source: DIAG_SOURCE,
        diagId,
      });
      return NextResponse.json(
        { error: "No refresh token available" },
        { status: 401 }
      );
    }

    const baseUrl = BASE_API_URL;

    authDiagLog({
      phase: "refresh-pre-backend",
      source: DIAG_SOURCE,
      diagId,
      refreshFp,
    });

    const response = await fetch(`${baseUrl}${END_POINTS.TOKEN_REFRESH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Cookie: cookieStore.toString(),
        ...(origin && { Origin: origin }),
      },
    });

    authDiagLog({
      phase: "refresh-backend-response",
      source: DIAG_SOURCE,
      diagId,
      status: response.status,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("3. 백엔드 에러 내용:", errorBody);
      authDiagLog({
        phase: "refresh-backend-error",
        source: DIAG_SOURCE,
        diagId,
        status: response.status,
      });
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const nextResponse = NextResponse.json(data);

    const setCookieHeaders = response.headers.getSetCookie();
    const backendSetCookieAccessFp = fingerprintFromSetCookies(
      setCookieHeaders,
      "accessToken"
    );
    const backendSetCookieRefreshFp = fingerprintFromSetCookies(
      setCookieHeaders,
      "refreshToken"
    );

    authDiagLog({
      phase: "refresh-backend-setcookie",
      source: DIAG_SOURCE,
      diagId,
      status: response.status,
      backendSetCookieAccessFp,
      backendSetCookieRefreshFp,
      meta: { setCookieCount: setCookieHeaders.length },
    });

    setCookieHeaders.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    authDiagLog({
      phase: "refresh-response-append",
      source: DIAG_SOURCE,
      diagId,
      backendSetCookieAccessFp,
      backendSetCookieRefreshFp,
      meta: { appendedCount: setCookieHeaders.length },
    });

    return nextResponse;
  } catch (error) {
    console.error("Token refresh API error:", error);
    authDiagLog({
      phase: "refresh-exception",
      source: DIAG_SOURCE,
      diagId,
      meta: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
