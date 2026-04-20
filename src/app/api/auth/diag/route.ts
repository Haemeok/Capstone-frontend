import { NextRequest, NextResponse } from "next/server";

import { authDiagLog, isAuthDiagEnabled } from "@/shared/lib/auth/diag";

type DiagBody = {
  phase?: unknown;
  source?: unknown;
  diagId?: unknown;
  meta?: unknown;
};

export async function POST(request: NextRequest) {
  if (!isAuthDiagEnabled()) {
    return new NextResponse(null, { status: 404 });
  }

  let body: DiagBody = {};
  try {
    body = (await request.json()) as DiagBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 }
    );
  }

  const phase = typeof body.phase === "string" ? body.phase : "unknown";
  const source = typeof body.source === "string" ? body.source : "unknown";
  const diagId = typeof body.diagId === "string" ? body.diagId : undefined;
  const meta =
    body.meta && typeof body.meta === "object" && !Array.isArray(body.meta)
      ? (body.meta as Record<string, unknown>)
      : undefined;

  authDiagLog({ phase, source, diagId, meta });

  return NextResponse.json({ ok: true });
}
