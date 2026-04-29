import { translateIngredient } from "./translate";

export type VegetableInput = { name: string; quantity?: string; unit: string };

const ENV_LOCK = `[ENVIRONMENT LOCK — IDENTICAL ACROSS ALL IMAGES]
- Surface: matte light-grey/white kitchen countertop, slight realistic texture
- Lighting: 5500K natural daylight, soft window light from upper-left, gentle ambient shadow
- Color temperature: neutral, slightly warm (~5500K), no blue cast, no orange cast
- Camera style: realistic top-down 90° smartphone food photography
- Frame: square crop, subject centered with breathing room`;

const ABSOLUTE_NO_TEXT = `[ABSOLUTE NO-TEXT RULE]
- The image must contain ZERO text of any kind.
- No Hangul/Korean, no English, no numbers, no symbols, no captions, no typography.
- No logos, no brands, no labels, no packaging, no stamps, no engraved markings.
- If any text would appear, remove it completely and leave the surface blank.`;

const NEGATIVES_BASE = `[Negative Prompts]
--no people, --no hands, --no arms, --no faces,
--no text, --no watermark, --no caption,
--no logo, --no brand, --no label, --no packaging,
--no maker mark, --no seal, --no stamp, --no engraving, --no embossed, --no calligraphy,
--no plastic look, --no blurry, --no distorted`;

const formatAmount = (quantity: string | undefined, unit: string): string => {
  const q = (quantity ?? "").trim();
  if (q.length === 0 && unit.length === 0) return "the appropriate amount";
  return `${q}${unit}`;
};

export const buildVegetableTrayPrompt = (input: VegetableInput): string => {
  const en = translateIngredient(input.name);
  const amount = formatAmount(input.quantity, input.unit);

  return `Top-down 90° photo of a single rectangular SILVER STAINLESS STEEL TRAY (~30cm wide).
Subject: ${en} (${input.name}) — ${amount}, properly prepped (washed, peeled, cut as appropriate for typical Korean home cooking).
Naturally scattered on the tray — slightly imperfect, NOT arranged in a grid.
The tray fills ~70% of the frame.

${ENV_LOCK}

${NEGATIVES_BASE}, --no other ingredients, --no side dishes

${ABSOLUTE_NO_TEXT}`;
};
