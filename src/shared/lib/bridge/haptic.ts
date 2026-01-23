import { postMessage } from "./client";
import type { HapticStyle } from "./types";

export const triggerHaptic = (style: HapticStyle = "Light"): void => {
  postMessage("HAPTIC", { style });
};
