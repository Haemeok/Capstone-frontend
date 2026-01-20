import type { HapticStyle } from "./types";
import { postMessage } from "./client";

export const triggerHaptic = (style: HapticStyle = "Light"): void => {
  postMessage("HAPTIC", { style });
};
