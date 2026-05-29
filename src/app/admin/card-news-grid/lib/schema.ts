// src/app/admin/card-news-grid/lib/schema.ts
import { z } from "zod";

import { GRID_COUNT } from "./gridLayout";

export const MAX_DISH_NAME = 14;
export const MAX_CAPTION = 40;
export const MAX_HEADER = 30;
export const TOPIC_COUNT = 5;

export const DEFAULT_MODEL_ID = "deepseek/deepseek-v4-flash";

export type ModelOption = { id: string; label: string };

// 게이트웨이 /v1/models 실측 기준 (2026-05-29).
export const MODEL_OPTIONS: ModelOption[] = [
  { id: "deepseek/deepseek-v4-flash", label: "DeepSeek V4 Flash (최저가)" },
  { id: "google/gemini-3-flash", label: "Gemini 3 Flash" },
  { id: "zai/glm-4.7-flash", label: "GLM 4.7 Flash" },
  { id: "alibaba/qwen3.5-flash", label: "Qwen 3.5 Flash" },
  { id: "moonshotai/kimi-k2.5", label: "Kimi K2.5" },
  { id: "xai/grok-4.1-fast-reasoning", label: "Grok 4.1 Fast" },
];

export const topicsSchema = z.object({
  topics: z
    .array(
      z.object({
        title: z.string().min(1).max(MAX_HEADER),
        concept: z.string().min(1).max(60),
      }),
    )
    .length(TOPIC_COUNT),
});
export type TopicsResult = z.infer<typeof topicsSchema>;
export type TopicCandidate = TopicsResult["topics"][number];

export const itemsSchema = z.object({
  header: z.string().min(1).max(MAX_HEADER),
  items: z
    .array(
      z.object({
        dishName: z.string().min(1).max(MAX_DISH_NAME),
        caption: z.string().min(1).max(MAX_CAPTION),
      }),
    )
    .length(GRID_COUNT),
});
export type ItemsResult = z.infer<typeof itemsSchema>;
export type TipItem = ItemsResult["items"][number];

export const truncate = (text: string, max: number): string =>
  text.length <= max ? text : `${text.slice(0, max - 1)}…`;
