import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  authDiagLog,
  fingerprint,
  isAuthDiagEnabled,
} from "@/shared/lib/auth/diag";

const DIAG_SOURCE = "next-debug-cookie";

export async function GET(request: NextRequest) {
  if (!isAuthDiagEnabled()) {
    return new NextResponse(null, { status: 404 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { searchParams } = new URL(request.url);
  const phase = searchParams.get("phase") ?? "debug-cookie-probe";
  const diagId = searchParams.get("diagId") ?? undefined;
  const callerSource = searchParams.get("source") ?? DIAG_SOURCE;

  authDiagLog({
    phase,
    source: callerSource,
    diagId,
    accessFp: fingerprint(accessToken),
    refreshFp: fingerprint(refreshToken),
  });

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
  });
}
