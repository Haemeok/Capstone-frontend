import type { SeedanceModelId, SeedanceResolution } from "./types";

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
