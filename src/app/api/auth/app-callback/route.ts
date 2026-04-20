import { NextRequest, NextResponse } from "next/server";

import {
  authDiagLog,
  fingerprintFromSetCookies,
  generateDiagId,
} from "@/shared/lib/auth/diag";
import { decryptTokenData } from "@/shared/lib/auth/crypto";
import { retrieveTempToken } from "@/shared/lib/auth/tempToken";
import { getBaseUrlFromRequest } from "@/shared/lib/env/getBaseUrl";

const DIAG_SOURCE = "next-app-callback";

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrlFromRequest(request);
  const { searchParams } = new URL(request.url);
  const diagIdParam = searchParams.get("diagId");
  const diagId = diagIdParam ?? generateDiagId();

  authDiagLog({
    phase: "app-callback-start",
    source: DIAG_SOURCE,
    diagId,
    meta: { diagIdSource: diagIdParam ? "query" : "generated" },
  });

  try {
    const code = searchParams.get("code");

    if (!code) {
      console.error("[App Callback] 토큰 코드가 없음");
      authDiagLog({
        phase: "app-callback-no-code",
        source: DIAG_SOURCE,
        diagId,
      });
      return NextResponse.redirect(`${baseUrl}login/error?reason=invalid`);
    }

    let cookies: string[];
    let tokenMode: "temp" | "encrypted";

    try {
      if (process.env.USE_TEMP_TOKEN === "true") {
        cookies = await retrieveTempToken(code);
        tokenMode = "temp";
      } else {
        cookies = decryptTokenData(code);
        tokenMode = "encrypted";
      }
    } catch (error) {
      console.error("[App Callback] 토큰 처리 실패:", error);
      authDiagLog({
        phase: "app-callback-token-decode-failed",
        source: DIAG_SOURCE,
        diagId,
        meta: {
          error: error instanceof Error ? error.message : String(error),
        },
      });
      return NextResponse.redirect(
        `${baseUrl}login/error?reason=invalid_token`
      );
    }

    const backendSetCookieAccessFp = fingerprintFromSetCookies(
      cookies,
      "accessToken"
    );
    const backendSetCookieRefreshFp = fingerprintFromSetCookies(
      cookies,
      "refreshToken"
    );

    authDiagLog({
      phase: "app-callback-token-decoded",
      source: DIAG_SOURCE,
      diagId,
      backendSetCookieAccessFp,
      backendSetCookieRefreshFp,
      meta: { cookieCount: cookies.length, tokenMode },
    });

    const response = NextResponse.redirect(baseUrl);

    cookies.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    authDiagLog({
      phase: "app-callback-pre-redirect",
      source: DIAG_SOURCE,
      diagId,
      backendSetCookieAccessFp,
      backendSetCookieRefreshFp,
      meta: { appendedCount: cookies.length, redirectTo: baseUrl },
    });

    return response;
  } catch (error) {
    console.error("[App Callback] 에러 발생:", error);
    authDiagLog({
      phase: "app-callback-exception",
      source: DIAG_SOURCE,
      diagId,
      meta: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.redirect(`${baseUrl}login/error`);
  }
}
