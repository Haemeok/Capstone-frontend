// src/app/admin/video-studio/lib/adapters/seedanceAdapter.ts
import "server-only";

import type {
  SeedanceSubmitInput,
  SeedanceTaskState,
  SeedanceTaskStatus,
} from "../types";

const ARK_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";

export const submitSeedanceTask = async (
  input: SeedanceSubmitInput,
  signal?: AbortSignal
): Promise<{ taskId: string }> => {
  const apiKey = process.env.ARK_API_KEY;
  if (!apiKey) throw new Error("ARK_API_KEY is not set");

  const body = {
    model: input.model,
    content: [
      { type: "text", text: input.prompt },
      {
        type: "image_url",
        image_url: { url: input.imageDataUrlOrUrl },
        role: "first_frame",
      },
    ],
    ratio: input.ratio,
    resolution: input.resolution,
    duration: input.durationSec,
    generate_audio: input.generateAudio,
  };

  const res = await fetch(`${ARK_BASE}/contents/generations/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Seedance submit ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = (await res.json()) as { id?: string };
  if (!data.id) throw new Error("Seedance submit response missing id");
  return { taskId: data.id };
};

export const fetchSeedanceTask = async (
  taskId: string,
  signal?: AbortSignal
): Promise<SeedanceTaskState> => {
  const apiKey = process.env.ARK_API_KEY;
  if (!apiKey) throw new Error("ARK_API_KEY is not set");

  const res = await fetch(
    `${ARK_BASE}/contents/generations/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      signal,
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Seedance fetch ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    id: string;
    status: SeedanceTaskStatus;
    content?: { video_url?: string };
    error?: { message?: string };
  };

  return {
    taskId: data.id,
    status: data.status,
    videoUrl: data.content?.video_url,
    errorMessage: data.error?.message,
  };
};
