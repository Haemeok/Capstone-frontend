import { cookies } from "next/headers";
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

const ADMIN_USER_ID = "X1BoaJNZ";
const BACKEND_ME_URL = "https://api.recipio.kr/api/me";

// Verifies the incoming request comes from the admin user. The page-level
// gate is client-only (anyone can curl this endpoint directly), so without
// this server check a malicious caller could burn OpenAI/Google/fal credits
// at will.
//
// Backend auth model is cookie-based, not Bearer (see src/app/api/auth/
// refresh/route.ts and src/shared/api/client.ts which uses credentials:
// "include"). We forward the incoming cookie jar verbatim so the backend
// can authenticate the same way it would for any other request.
const assertAdmin = async (): Promise<NextResponse | null> => {
  const cookieStore = await cookies();
  if (!cookieStore.get("accessToken")?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user: { id?: string };
  try {
    const res = await fetch(BACKEND_ME_URL, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Unauthorized", upstream: res.status },
        { status: 401 }
      );
    }
    user = (await res.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.id !== ADMIN_USER_ID) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
};

type Body = { modelId: string; prompt: string; referenceImageUrl?: string };

export async function POST(req: NextRequest) {
  const guardResponse = await assertAdmin();
  if (guardResponse) return guardResponse;

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
