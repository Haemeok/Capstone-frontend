import { type NextRequest,NextResponse } from "next/server";

import {
  CurationError,
  type GenerateCurationInput,
} from "@/entities/curation";

import { generateCuration } from "@/app/actions/curation";
import { assertAdminApi } from "@/shared/lib/admin-guard";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const guard = await assertAdminApi();
  if (guard) return guard;

  let body: GenerateCurationInput;
  try {
    body = (await req.json()) as GenerateCurationInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !body.params) {
    return NextResponse.json(
      { error: "params is required" },
      { status: 400 },
    );
  }

  try {
    const result = await generateCuration(body);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof CurationError) {
      return NextResponse.json(
        { error: e.message, code: e.code, meta: e.meta ?? null },
        { status: 422 },
      );
    }
    console.error("[curation/generate] unhandled error", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
