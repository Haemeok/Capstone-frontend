import crypto from "node:crypto";

export const AUTH_DIAG_PREFIX = "[AUTH_DIAG]";

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
