// src/app/api/admin/video-studio/image/route.ts
import { NextRequest, NextResponse } from "next/server";

import { assertAdminApi } from "@/shared/lib/admin-guard";

import {
  editMultiViaOpenAI,
  generateMultiViaOpenAI,
} from "@/app/admin/image-quality-test/lib/adapters/openaiAdapter";

export const runtime = "nodejs";
export const maxDuration = 300;

type Body = {
  prompt: string;
  quality: "low" | "medium" | "high";
  n: number;
  referenceImageUrl?: string;
};

export async function POST(req: NextRequest) {
  const guardResponse = await assertAdminApi();
  if (guardResponse) return guardResponse;

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.prompt || !body.quality || !body.n) {
    return NextResponse.json(
      { error: "prompt, quality, n are required" },
      { status: 400 }
    );
  }
  if (body.n < 1 || body.n > 4) {
    return NextResponse.json({ error: "n must be 1..4" }, { status: 400 });
  }

  const startedAt = Date.now();
  try {
    const result = body.referenceImageUrl
      ? await editMultiViaOpenAI(
          "gpt-image-1",
          body.prompt,
          body.referenceImageUrl,
          { quality: body.quality, n: body.n },
          req.signal
        )
      : await generateMultiViaOpenAI(
          "gpt-image-1",
          body.prompt,
          { quality: body.quality, n: body.n },
          req.signal
        );

    return NextResponse.json({
      images: result.imageDataUrls,
      latencyMs: Date.now() - startedAt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message, latencyMs: Date.now() - startedAt },
      { status: 502 }
    );
  }
}
