// src/app/admin/image-quality-test/lib/adapters/falAdapter.ts
import { fal } from "@fal-ai/client";

import "server-only";

type Result = { imageDataUrl: string };

let configured = false;
const configureOnce = () => {
  if (configured) return;
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not set");
  fal.config({ credentials: key });
  configured = true;
};

type FalImagePayload = {
  images?: Array<{ url?: string; content_type?: string }>;
};

export const generateViaFal = async (
  endpoint: string,
  prompt: string,
  _signal?: AbortSignal
): Promise<Result> => {
  void _signal;
  configureOnce();

  const result = await fal.subscribe(endpoint, {
    input: { prompt, image_size: "square_hd", num_images: 1 },
    logs: false,
  });

  const payload = result.data as FalImagePayload;
  const url = payload.images?.[0]?.url;
  if (!url) throw new Error(`fal.ai (${endpoint}) returned no image url`);
  return { imageDataUrl: url };
};
