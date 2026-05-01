import { NextRequest, NextResponse } from "next/server";

import { generateViaFal } from "@/app/admin/image-quality-test/lib/adapters/falAdapter";
import { generateViaGoogle } from "@/app/admin/image-quality-test/lib/adapters/googleAdapter";
import {
  editViaOpenAI,
  generateViaOpenAI,
} from "@/app/admin/image-quality-test/lib/adapters/openaiAdapter";
import { getModelById } from "@/app/admin/image-quality-test/lib/models";

export const runtime = "nodejs";
export const maxDuration = 300;

type Body = { modelId: string; prompt: string; referenceImageUrl?: string };

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { modelId, prompt } = body;
  if (!modelId || !prompt) {
    return NextResponse.json(
      { error: "modelId and prompt are required" },
      { status: 400 }
    );
  }

  const model = getModelById(modelId);
  if (!model) {
    return NextResponse.json(
      { error: `Unknown modelId: ${modelId}` },
      { status: 400 }
    );
  }

  const startedAt = Date.now();
  try {
    let result: { imageDataUrl: string };
    if (body.referenceImageUrl) {
      if (model.provider !== "openai") {
        return NextResponse.json(
          { error: "referenceImageUrl is only supported for openai provider" },
          { status: 400 }
        );
      }
      result = await editViaOpenAI(
        model.endpoint,
        prompt,
        body.referenceImageUrl,
        model.extra ?? {},
        req.signal
      );
    } else {
      switch (model.provider) {
        case "openai":
          result = await generateViaOpenAI(
            model.endpoint,
            prompt,
            model.extra ?? {},
            req.signal
          );
          break;
        case "google":
          result = await generateViaGoogle(model.endpoint, prompt, req.signal);
          break;
        case "fal":
          result = await generateViaFal(model.endpoint, prompt, req.signal);
          break;
        default:
          throw new Error(
            `unreachable provider: ${model.provider satisfies never}`
          );
      }
    }

    return NextResponse.json({
      modelId,
      imageUrl: result.imageDataUrl,
      cost: model.pricePerImage,
      latencyMs: Date.now() - startedAt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { modelId, error: message, latencyMs: Date.now() - startedAt },
      { status: 502 }
    );
  }
}
