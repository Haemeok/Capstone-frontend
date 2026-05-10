// Pricing constants for BytePlus ModelArk Seedance 2.0.
//
// Source notes (recorded 2026-05-10):
//   - Per-second base rates: BytePlus ModelArk international API.
//     Reported by sora video art / blog.laozhang and consistent with the
//     BytePlus activity page wording. The official pricing console
//     (docs.byteplus.com/en/docs/ModelArk/1544106) was not externally
//     fetchable at write time — verify against the live console once
//     real videos are billed and update if it diverges by >20%.
//   - Resolution multiplier: BytePlus's launch page documents
//     "per-token pricing, up to ~1:1.8 across resolutions". The
//     480p/720p/1080p factors below approximate that curve.
//   - Audio surcharge for `generate_audio: true` is not documented
//     anywhere we could find. Treated as $0 here. If a real invoice
//     shows otherwise, add an audio multiplier or flat fee.
//
// These numbers feed an admin-only cost summary; they are estimates,
// not authoritative billing.

import type {
  SeedanceModelId,
  SeedanceResolution,
} from "./types";

export const SEEDANCE_PRICES: Record<SeedanceModelId, number> = {
  "dreamina-seedance-2-0-fast-260128": 0.01,
  "dreamina-seedance-2-0-260128": 0.03,
};

export const RESOLUTION_MULTIPLIER: Record<SeedanceResolution, number> = {
  "480p": 1.0,
  "720p": 1.4,
  "1080p": 1.8,
};

type EstimateVideoCostInput = {
  model: SeedanceModelId;
  resolution: SeedanceResolution;
  durationSec: number;
};

export const estimateVideoCost = ({
  model,
  resolution,
  durationSec,
}: EstimateVideoCostInput): number => {
  const perSec = SEEDANCE_PRICES[model];
  const multiplier = RESOLUTION_MULTIPLIER[resolution];
  return perSec * multiplier * durationSec;
};
