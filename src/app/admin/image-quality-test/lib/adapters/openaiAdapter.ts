// src/app/admin/image-quality-test/lib/adapters/openaiAdapter.ts
import "server-only";

type Result = { imageDataUrl: string };

type ExtraParams = { quality?: "low" | "medium" | "high" | "auto" };

export const generateViaOpenAI = async (
  model: string,
  prompt: string,
  extra: ExtraParams = {},
  signal?: AbortSignal
): Promise<Result> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: "1024x1024",
      ...(extra.quality ? { quality: extra.quality } : {}),
    }),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
  };
  const first = data.data?.[0];
  if (!first) throw new Error("OpenAI returned empty data array");
  if (first.b64_json) return { imageDataUrl: `data:image/png;base64,${first.b64_json}` };
  if (first.url) return { imageDataUrl: first.url };
  throw new Error("OpenAI returned neither b64_json nor url");
};

export const editViaOpenAI = async (
  model: string,
  prompt: string,
  referenceDataUrl: string,
  extra: ExtraParams = {},
  signal?: AbortSignal
): Promise<Result> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const referenceBlob = await dataUrlToBlob(referenceDataUrl);

  const formData = new FormData();
  formData.append("model", model);
  formData.append("prompt", prompt);
  formData.append("image", referenceBlob, "reference.png");
  formData.append("size", "1024x1024");
  formData.append("n", "1");
  if (extra.quality) formData.append("quality", extra.quality);

  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenAI edit ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
  };
  const first = data.data?.[0];
  if (!first) throw new Error("OpenAI edit returned empty data array");
  if (first.b64_json)
    return { imageDataUrl: `data:image/png;base64,${first.b64_json}` };
  if (first.url) return { imageDataUrl: first.url };
  throw new Error("OpenAI edit returned neither b64_json nor url");
};

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const res = await fetch(dataUrl);
  return await res.blob();
};
