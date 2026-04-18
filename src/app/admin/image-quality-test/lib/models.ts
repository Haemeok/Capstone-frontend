export type ModelProvider = "openai" | "google" | "fal";

export type ModelConfig = {
  id: string;
  label: string;
  vendor: string;
  provider: ModelProvider;
  endpoint: string;
  pricePerImage: number;
  extra?: Record<string, unknown>;
};

// NOTE: endpoint slugs are best-effort and must be verified against live catalogs
// (see Task 1 preflight) before hitting real APIs. If any slug is wrong, update it here.
export const MODELS: readonly ModelConfig[] = [
  {
    id: "gpt-image-1-mini-low",
    label: "GPT Image 1 Mini (Low)",
    vendor: "OpenAI",
    provider: "openai",
    endpoint: "gpt-image-1-mini",
    extra: { quality: "low" },
    pricePerImage: 0.005,
  },
  {
    id: "flux-2-schnell",
    label: "Flux 2 Schnell",
    vendor: "BFL",
    provider: "fal",
    endpoint: "fal-ai/flux-2/schnell",
    pricePerImage: 0.015,
  },
  {
    id: "imagen-4-fast",
    label: "Imagen 4 Fast",
    vendor: "Google",
    provider: "google",
    endpoint: "imagen-4.0-fast-generate-001",
    pricePerImage: 0.02,
  },
  {
    id: "sd-35-large",
    label: "Stable Diffusion 3.5 Large",
    vendor: "Stability AI",
    provider: "fal",
    endpoint: "fal-ai/stable-diffusion-v35-large",
    pricePerImage: 0.025,
  },
  {
    id: "ideogram-v3",
    label: "Ideogram 3.0",
    vendor: "Ideogram",
    provider: "fal",
    endpoint: "fal-ai/ideogram/v3",
    pricePerImage: 0.03,
  },
  {
    id: "wan-2-6",
    label: "Wan 2.6 Image",
    vendor: "Alibaba",
    provider: "fal",
    endpoint: "fal-ai/wan/v2.6/text-to-image",
    pricePerImage: 0.03,
  },
  {
    id: "flux-2-dev",
    label: "Flux 2 Dev",
    vendor: "BFL",
    provider: "fal",
    endpoint: "fal-ai/flux-2/dev",
    pricePerImage: 0.03,
  },
  {
    id: "seedream-v4",
    label: "Seedream v4",
    vendor: "ByteDance",
    provider: "fal",
    endpoint: "fal-ai/bytedance/seedream/v4/text-to-image",
    pricePerImage: 0.03,
  },
] as const;

export const getModelById = (id: string): ModelConfig | undefined =>
  MODELS.find((m) => m.id === id);
