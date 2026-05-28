import { postMessage } from "./client";
import type { AuthStatePayload } from "./types";

export const notifyAuthState = (event: AuthStatePayload["event"]): void => {
  postMessage<AuthStatePayload>("AUTH_STATE_CHANGED", { event });
};
