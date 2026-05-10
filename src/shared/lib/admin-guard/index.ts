import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

const BACKEND_ME_URL = "https://api.recipio.kr/api/me";

// `reason` is for server-side logs/diagnostics only — never serialize to clients.
export type AdminCheckResult =
  | { ok: true }
  | { ok: false; status: 401 | 403 | 500; reason: string };

// Server-only. Reads cookies, forwards to backend /api/me, compares user.id
// against the allowlist parsed from ADMIN_USER_ID (comma-separated; single
// value also accepted). Backend uses cookie-based auth (not Bearer), so the
// incoming cookie jar is forwarded verbatim.
export const checkAdminAccess = async (): Promise<AdminCheckResult> => {
  const adminIds = parseAdminIds(process.env.ADMIN_USER_ID);
  if (adminIds.size === 0) {
    return { ok: false, status: 500, reason: "env-missing" };
  }

  const cookieStore = await cookies();
  if (!cookieStore.get("accessToken")?.value) {
    return { ok: false, status: 401, reason: "no-token" };
  }

  let user: { id?: string };
  try {
    const res = await fetch(BACKEND_ME_URL, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, status: 401, reason: `upstream-${res.status}` };
    }
    user = (await res.json()) as { id?: string };
  } catch {
    return { ok: false, status: 401, reason: "fetch-failed" };
  }

  if (!user.id || !adminIds.has(user.id)) {
    return { ok: false, status: 403, reason: "not-admin" };
  }

  return { ok: true };
};

const parseAdminIds = (raw: string | undefined): Set<string> =>
  new Set(
    (raw ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  );

// For API routes: returns NextResponse on failure, null on success.
// Caller pattern: const guard = await assertAdminApi(); if (guard) return guard;
// On env-missing (status 500) we throw — same treatment as the other wrappers,
// so a generic 500 surfaces and a misleading {error: "Unauthorized"} body never ships.
export const assertAdminApi = async (): Promise<NextResponse | null> => {
  const result = await checkAdminAccess();
  if (result.ok) return null;
  if (result.status === 500) {
    throw new Error("ADMIN_USER_ID env var is not set");
  }
  const message = result.status === 403 ? "Forbidden" : "Unauthorized";
  return NextResponse.json({ error: message }, { status: result.status });
};

// For RSC layouts/pages: triggers Next.js notFound on failure (no info leak about
// admin routes existing). Throws server-side error if env is missing.
export const requireAdminPage = async (): Promise<void> => {
  const result = await checkAdminAccess();
  if (result.ok) return;
  if (result.status === 500) {
    throw new Error("ADMIN_USER_ID env var is not set");
  }
  notFound();
};

// For Server Actions: throws on failure. Server Actions don't render pages,
// so notFound() is wrong here — we want the call to reject and surface to the client.
export const requireAdminAction = async (): Promise<void> => {
  const result = await checkAdminAccess();
  if (result.ok) return;
  if (result.status === 500) {
    throw new Error("ADMIN_USER_ID env var is not set");
  }
  throw new Error(result.status === 403 ? "Forbidden" : "Unauthorized");
};
