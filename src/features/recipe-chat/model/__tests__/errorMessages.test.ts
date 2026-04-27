import { CHAT_ERROR_BEHAVIOR, getChatErrorBehavior } from "../errorMessages";
import type { ChatErrorCode } from "../types";

describe("CHAT_ERROR_BEHAVIOR", () => {
  it("705 (quota exceeded) → input lock + warning haptic", () => {
    const b = CHAT_ERROR_BEHAVIOR["705"];
    expect(b.inputLock).toBe(true);
    expect(b.haptic).toBe("Warning");
    expect(b.toast).toBeUndefined();
  });

  it("708 (rate limit) → toast only, no input lock", () => {
    const b = CHAT_ERROR_BEHAVIOR["708"];
    expect(b.toast?.variant).toBe("warning");
    expect(b.inputLock).toBeUndefined();
    expect(b.haptic).toBe("Light");
  });

  it("703/704/710 (LLM failure) → retryable", () => {
    expect(CHAT_ERROR_BEHAVIOR["703"].retryable).toBe(true);
    expect(CHAT_ERROR_BEHAVIOR["704"].retryable).toBe(true);
    expect(CHAT_ERROR_BEHAVIOR["710"].retryable).toBe(true);
  });

  it("706 (killswitch) → fallbackView + input lock", () => {
    const b = CHAT_ERROR_BEHAVIOR["706"];
    expect(b.fallbackView).toBeDefined();
    expect(b.inputLock).toBe(true);
  });

  it("207 (forbidden) → fallbackView, no haptic", () => {
    const b = CHAT_ERROR_BEHAVIOR["207"];
    expect(b.fallbackView).toBeDefined();
    expect(b.haptic).toBeUndefined();
  });

  it("201 (recipe not found) → toast + closeDrawer", () => {
    const b = CHAT_ERROR_BEHAVIOR["201"];
    expect(b.toast).toBeDefined();
    expect(b.closeDrawer).toBe(true);
  });

  it("getChatErrorBehavior returns 710 fallback for unknown codes", () => {
    const b = getChatErrorBehavior("999" as ChatErrorCode);
    expect(b).toBe(CHAT_ERROR_BEHAVIOR["710"]);
  });
});
