import { NextRequest, NextResponse } from "next/server";

import { assertAdminApi } from "@/shared/lib/admin-guard";

import { editViaOpenAI } from "@/app/admin/image-quality-test/lib/adapters/openaiAdapter";
import { getModelById } from "@/app/admin/image-quality-test/lib/models";

export const runtime = "nodejs";
export const maxDuration = 300;

const ALLOWED_QUALITIES = new Set(["low", "medium", "high"]);

type Body = {
  modelId?: string;
  prompt?: string;
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

  if (!body.modelId || !body.prompt || !body.referenceImageUrl) {
    return NextResponse.json(
      { error: "modelId, prompt, and referenceImageUrl are required" },
      { status: 400 }
    );
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
      { error: `Provider not supported: ${model.provider}` },
      { status: 400 }
    );
  }

  const quality = model.extra?.quality as string | undefined;
  if (!quality || !ALLOWED_QUALITIES.has(quality)) {
    return NextResponse.json(
      { error: `Quality must be low/medium/high (got ${quality ?? "none"})` },
      { status: 400 }
    );
  }

  const startedAt = Date.now();
  try {
    const result = await editViaOpenAI(
      model.endpoint,
      body.prompt,
      body.referenceImageUrl,
      { quality: quality as "low" | "medium" | "high" },
      req.signal
    );
    return NextResponse.json({
      imageUrl: result.imageDataUrl,
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
