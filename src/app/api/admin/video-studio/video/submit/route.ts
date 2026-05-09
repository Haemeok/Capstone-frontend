// src/app/api/admin/video-studio/video/submit/route.ts
import { NextRequest, NextResponse } from "next/server";

import { submitSeedanceTask } from "@/app/admin/video-studio/lib/adapters/seedanceAdapter";
import type { SeedanceSubmitInput } from "@/app/admin/video-studio/lib/types";
import { assertAdminApi } from "@/shared/lib/admin-guard";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const guardResponse = await assertAdminApi();
  if (guardResponse) return guardResponse;

  let body: SeedanceSubmitInput;
  try {
    body = (await req.json()) as SeedanceSubmitInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const { taskId } = await submitSeedanceTask(body, req.signal);
    return NextResponse.json({ taskId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
