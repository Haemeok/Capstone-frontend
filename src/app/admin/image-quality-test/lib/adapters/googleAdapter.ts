// src/app/admin/image-quality-test/lib/adapters/googleAdapter.ts
import "server-only";

type Result = { imageDataUrl: string };

type PredictResponse = {
  predictions?: Array<{
    bytesBase64Encoded?: string;
    mimeType?: string;
  }>;
};

export const generateViaGoogle = async (
  model: string,
  prompt: string,
  signal?: AbortSignal
): Promise<Result> => {
  const apiKey = process.env.GEMINI_STUDIO_API_KEY;
  if (!apiKey) throw new Error("GEMINI_STUDIO_API_KEY is not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1, aspectRatio: "1:1" },
    }),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Google ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = (await res.json()) as PredictResponse;
  const first = data.predictions?.[0];
  if (!first?.bytesBase64Encoded) throw new Error("Google returned no bytesBase64Encoded");
  const mime = first.mimeType ?? "image/png";
  return { imageDataUrl: `data:${mime};base64,${first.bytesBase64Encoded}` };
};
