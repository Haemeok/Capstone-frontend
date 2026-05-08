import crypto from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

export const AUTH_DIAG_PREFIX = "[AUTH_DIAG]";

const DX_ID_COOKIE_NAME = "dx_id";
const DX_ID_PATTERN = /^[a-f0-9]{32}$/;
const DX_ID_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 2; // 2 years

// Anonymous device-tracking id for diagnostics. Persists across token loss
// (separate cookie). Lets us group same-device phase sequences when the
// auth tokens themselves are missing (e.g. refresh-no-token incidents).
export const readOrGenerateDxId = (request: NextRequest): string => {
  const existing = request.cookies.get(DX_ID_COOKIE_NAME)?.value;
  if (existing && DX_ID_PATTERN.test(existing)) {
    return existing;
  }
  return crypto.randomBytes(16).toString("hex");
};

export const attachDxIdCookie = (
  response: NextResponse,
  dxId: string
): void => {
  response.cookies.set({
    name: DX_ID_COOKIE_NAME,
    value: dxId,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: DX_ID_MAX_AGE_SECONDS,
  });
};

export const isAuthDiagEnabled = (): boolean =>
  process.env.AUTH_DIAGNOSTIC_ENABLED === "true";

export const fingerprint = (
  token: string | null | undefined
): string | null => {
  if (!token) return null;
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")
    .slice(0, 8);
};

export const extractCookieValue = (
  setCookieHeader: string,
  cookieName: string
): string | null => {
  const prefix = `${cookieName}=`;
  if (!setCookieHeader.startsWith(prefix)) return null;
  const rest = setCookieHeader.slice(prefix.length);
  const semi = rest.indexOf(";");
  return semi === -1 ? rest : rest.slice(0, semi);
};

export const fingerprintFromSetCookies = (
  setCookieHeaders: string[],
  cookieName: string
): string | null => {
  for (const header of setCookieHeaders) {
    const value = extractCookieValue(header, cookieName);
    if (value !== null) return fingerprint(value);
  }
  return null;
};

export type AuthDiagFields = {
  phase: string;
  source: string;
  diagId?: string;
  dxId?: string;
  accessFp?: string | null;
  refreshFp?: string | null;
  backendSetCookieAccessFp?: string | null;
  backendSetCookieRefreshFp?: string | null;
  status?: number | string;
  meta?: Record<string, unknown>;
};

export const authDiagLog = (fields: AuthDiagFields): void => {
  if (!isAuthDiagEnabled()) return;
  console.log(
    AUTH_DIAG_PREFIX,
    JSON.stringify({
      ...fields,
      timestamp: new Date().toISOString(),
    })
  );
};

export const generateDiagId = (): string =>
  crypto.randomBytes(4).toString("hex");
