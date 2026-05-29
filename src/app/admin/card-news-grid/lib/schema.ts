// src/app/admin/card-news-grid/lib/schema.ts
import { z } from "zod";

import { GRID_COUNT } from "./gridLayout";

export const MAX_DISH_NAME = 14;
export const MAX_CAPTION = 40;
export const MAX_HEADER = 30;
export const MAX_CONCEPT = 60;
export const MAX_IMAGE_PROMPT = 60;
export const TOPIC_COUNT = 5;

export type CardMode = "recipe" | "tips";

export const DEFAULT_MODEL_ID = "openai/gpt-5.5";

export type ModelOption = { id: string; label: string };

export const MODEL_OPTIONS: ModelOption[] = [
  { id: "openai/gpt-5.5", label: "GPT-5.5 (OpenAI 직결)" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash (Studio 직결)" },
  { id: "google/gemini-3.5-flash", label: "Gemini 3.5 Flash (Studio 직결)" },
  { id: "deepseek/deepseek-v4-flash", label: "DeepSeek V4 Flash (최저가)" },
  { id: "zai/glm-4.7-flash", label: "GLM 4.7 Flash" },
  { id: "alibaba/qwen3.5-flash", label: "Qwen 3.5 Flash" },
  { id: "moonshotai/kimi-k2.5", label: "Kimi K2.5" },
  { id: "xai/grok-4.1-fast-reasoning", label: "Grok 4.1 Fast" },
];

export const topicsGenSchema = z.object({
  topics: z.array(z.object({ title: z.string(), concept: z.string() })),
});
export type TopicsGen = z.infer<typeof topicsGenSchema>;

export const itemsGenSchema = z.object({
  header: z.string(),
  items: z.array(
    z.object({
      dishName: z.string(),
      caption: z.string(),
      imagePrompt: z.string(),
    }),
  ),
});
export type ItemsGen = z.infer<typeof itemsGenSchema>;

export const topicsSchema = z.object({
  topics: z
    .array(
      z.object({
        title: z.string().min(1),
        concept: z.string().min(1),
      }),
    )
    .min(1),
});
export type TopicsResult = z.infer<typeof topicsSchema>;
export type TopicCandidate = TopicsResult["topics"][number];

export const itemsSchema = z.object({
  header: z.string().min(1),
  items: z
    .array(
      z.object({
        dishName: z.string().min(1),
        caption: z.string().min(1),
        imagePrompt: z.string().min(1),
      }),
    )
    .length(GRID_COUNT),
});
export type ItemsResult = z.infer<typeof itemsSchema>;
export type TipItem = ItemsResult["items"][number];

export const truncate = (text: string, max: number): string =>
  text.length <= max ? text : `${text.slice(0, max - 1)}…`;
