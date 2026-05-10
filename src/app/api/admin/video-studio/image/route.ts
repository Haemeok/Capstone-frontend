// src/app/api/admin/video-studio/image/route.ts
import { NextRequest, NextResponse } from "next/server";

import {
  editMultiViaOpenAI,
  generateMultiViaOpenAI,
} from "@/app/admin/image-quality-test/lib/adapters/openaiAdapter";
import { getModelById } from "@/app/admin/image-quality-test/lib/models";
import { assertAdminApi } from "@/shared/lib/admin-guard";

export const runtime = "nodejs";
export const maxDuration = 300;

type Body = {
  modelId: string;
  prompt: string;
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

  if (!body.modelId) {
    return NextResponse.json({ error: "modelId is required" }, { status: 400 });
  }
  if (!body.prompt || !body.n) {
    return NextResponse.json(
      { error: "prompt and n are required" },
      { status: 400 }
    );
  }
  if (body.n < 1 || body.n > 4) {
    return NextResponse.json({ error: "n must be 1..4" }, { status: 400 });
  }

  const model = getModelById(body.modelId);
  if (!model) {
    return NextResponse.json(
      { error: `Unknown modelId: ${body.modelId}` },
      { status: 400 }
    );
  }
  if (model.provider !== "openai") {
    return NextResponse.json(
      { error: `Provider not supported here: ${model.provider}` },
      { status: 400 }
    );
  }

  const quality = (model.extra?.quality ?? undefined) as
    | "low"
    | "medium"
    | "high"
    | "auto"
    | undefined;

  const startedAt = Date.now();
  try {
    const result = body.referenceImageUrl
      ? await editMultiViaOpenAI(
          model.endpoint,
          body.prompt,
          body.referenceImageUrl,
          { quality, n: body.n },
          req.signal
        )
      : await generateMultiViaOpenAI(
          model.endpoint,
          body.prompt,
          { quality, n: body.n },
          req.signal
        );

    return NextResponse.json({
      images: result.imageDataUrls,
      modelId: body.modelId,
      pricePerImage: model.pricePerImage,
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
