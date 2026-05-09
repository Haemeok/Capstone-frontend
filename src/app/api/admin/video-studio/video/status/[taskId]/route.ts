// src/app/api/admin/video-studio/video/status/[taskId]/route.ts
import { NextRequest, NextResponse } from "next/server";

import { fetchSeedanceTask } from "@/app/admin/video-studio/lib/adapters/seedanceAdapter";
import { assertAdminApi } from "@/shared/lib/admin-guard";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ taskId: string }> }
) {
  const guardResponse = await assertAdminApi();
  if (guardResponse) return guardResponse;

  const { taskId } = await ctx.params;
  if (!taskId)
    return NextResponse.json({ error: "taskId missing" }, { status: 400 });

  try {
    const state = await fetchSeedanceTask(taskId, req.signal);
    return NextResponse.json(state);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
