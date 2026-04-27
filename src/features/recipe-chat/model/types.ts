import type { HapticStyle } from "@/shared/lib/bridge/types";

export type ChatIntent = "IN_SCOPE" | "OUT_OF_SCOPE" | "UNCLEAR";

export type ChatRequest = {
  recipeId: string;
  question: string;
  sessionId: string;
};

export type ChatResponse = {
  answer: string;
  intent: ChatIntent;
  fromLlm: boolean;
};

export type ChatQuota = {
  dailyLimit: number;
  used: number;
  remaining: number;
  resetAt: string;
};

export type ChatErrorCode =
  | "703"
  | "704"
  | "705"
  | "706"
  | "707"
  | "708"
  | "709"
  | "710"
  | "401"
  | "207"
  | "201";

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; status: "pending" }
  | {
      id: string;
      role: "assistant";
      text: string;
      fromLlm: boolean;
      intent: ChatIntent;
    }
  | {
      id: string;
      role: "system";
      code: ChatErrorCode;
      retryable: boolean;
      sourceQuestion?: string;
    };

export type ChatErrorBehavior = {
  toast?: { message: string; variant: "warning" | "error" };
  inputLock?: boolean;
  fallbackView?: { title: string; description: string };
  retryable?: boolean;
  haptic?: HapticStyle;
  closeDrawer?: boolean;
};
