"use server";

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const xai = createOpenAI({
  name: "xai",
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY || "",
});

type AskGrokResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

export async function askGrok(prompt: string): Promise<AskGrokResult> {
  if (!prompt || prompt.trim().length === 0) {
    return { success: false, error: "프롬프트를 입력해주세요." };
  }

  if (!process.env.XAI_API_KEY) {
    return { success: false, error: "XAI_API_KEY가 설정되지 않았습니다." };
  }

  try {
    const { text } = await generateText({
      model: xai("grok-4-fast-reasoning"),
      prompt: prompt,
    });

    return { success: true, message: text };
  } catch (error) {
    console.error("Grok API Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}
