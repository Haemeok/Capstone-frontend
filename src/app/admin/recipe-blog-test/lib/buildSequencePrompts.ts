import { translateIngredient, translateSeasoning } from "./translate";
import type { FinalThemeKey } from "./types";

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

export type SeasoningInput = { name: string; quantity?: string; unit: string };

export const buildSeasoningSinglePrompt = (input: SeasoningInput): string => {
  const en = translateSeasoning(input.name);
  const amount = formatAmount(input.quantity, input.unit);

  return `Top-down 90° photo of a small mirror-finish STAINLESS STEEL BOWL (~12cm diameter).
Inside the bowl: exactly ${amount} of ${en} (${input.name}).
A matching SPOON visible from the front of the frame, handle pointing toward camera, scoop side resting on or just above the bowl rim, with the substance visibly on the spoon scoop AND in the bowl in correct proportion.
For "1 큰술" / "1 spoonful" — render a level or slightly heaped tablespoon's worth.
For "1 작은술" — render a teaspoon-sized amount.
For "약간" / "꼬집" — render a tiny pinch's worth, just a few specks.
The visible quantity must precisely match the spec — do not overflow or underfill.

${ENV_LOCK}

${NEGATIVES_BASE}, --no brand bottles, --no labels on containers, --no other ingredients

${ABSOLUTE_NO_TEXT}`;
};

export const buildSeasoningCombinedPrompt = (
  items: SeasoningInput[]
): string => {
  const lines = items
    .map(
      (i) =>
        `  • ${translateSeasoning(i.name)} (${i.name}): ${formatAmount(i.quantity, i.unit)}`
    )
    .join("\n");

  return `Top-down 90° photo of a single rectangular SILVER STAINLESS STEEL TRAY (~30cm wide).
On the tray, multiple SMALL ceramic dishes (small saucers, ~7cm each), each holding ONE of the following seasonings in the exact specified quantity:
${lines}

Each dish clearly separated, naturally arranged. A small plain spoon resting beside one of the dishes (NOT held by anyone).

${ENV_LOCK}

${NEGATIVES_BASE}, --no brand bottles, --no labels, --no other ingredients

${ABSOLUTE_NO_TEXT}`;
};

export type MeatInput = { name: string; quantity?: string; unit: string };

export const buildMeatTrayPrompt = (input: MeatInput): string => {
  const en = translateIngredient(input.name);
  const amount = formatAmount(input.quantity, input.unit);

  return `Top-down 90° photo of a SILVER STAINLESS STEEL TRAY (~30cm wide).
Subject: ${en} (${input.name}) — ${amount}, prepped (sliced, cubed, or ground as the recipe implies).
The visible amount on the tray must clearly match the spec.
Light glossy raw look (slight moisture sheen), realistic texture.

${ENV_LOCK}

${NEGATIVES_BASE}, --no other ingredients, --no garnish

${ABSOLUTE_NO_TEXT}`;
};

const ACTION_BODY_BY_KEY: Record<string, string> = {
  stir_fry: `Top-down 90° photo of a stainless steel wok or pan on a gas burner.
Action mid-state: vegetables and (where applicable) meat being stir-fried, oil sheen visible, slight wisps of steam, food slightly tossed (motion-frozen).
Surrounding context: edge of gas burner partially visible.
A spatula may rest on the pan edge — NOT held by anyone.`,
  simmer: `Top-down 90° photo of a stainless steel pot on a gas burner.
Action mid-state: a Korean stew/soup simmering, steam rising softly, gentle surface bubbles.
Surrounding context: edge of gas burner partially visible.
A ladle may rest on the pot edge — NOT held by anyone.`,
  cutting_board: `Top-down 90° photo of a wooden cutting board on a kitchen counter.
Subject: ingredients in mid-prep — partially sliced or chopped, knife resting beside (NOT held by anyone).
A small scattering of trimmings nearby.`,
  mix_bowl: `Top-down 90° photo of a large stainless steel mixing bowl.
Inside: ingredients being seasoned/mixed (e.g., 무침 or 비빔), glossy with sauce, partial coverage indicating mid-mixing.
A pair of plain chopsticks or a spoon resting on the bowl edge — NOT held by anyone.`,
  deep_fry: `Top-down 90° photo of a stainless steel deep-frying pot on a gas burner.
Action mid-state: ingredients being deep-fried in clear oil, golden crispy color forming, oil bubbling around them.`,
  steam_action: `Top-down 90° photo of a Korean steaming setup (steel steamer over a pot) on a gas burner.
Active steam billowing out, lid slightly ajar to reveal the contents inside.`,
};

export const buildActionPrompt = (actionKey: string): string => {
  const body =
    ACTION_BODY_BY_KEY[actionKey] ??
    `Top-down 90° photo of a Korean home cooking action mid-state on a stainless cookware. NO hands visible.`;

  return `${body}

NO hands, NO arms, NO body parts visible. The cookware sits on its own.

${ENV_LOCK}

${NEGATIVES_BASE}

${ABSOLUTE_NO_TEXT}`;
};

export const buildFinalThemePrompt = (
  theme: FinalThemeKey,
  dishTitle: string
): string => {
  const titleLine = `Dish: ${dishTitle}.`;

  switch (theme) {
    case "korean_mom_phone":
      return `${titleLine}
A casual, slightly imperfect smartphone photo (iPhone or Galaxy) of the dish on a normal Korean home dining table.
Angle: 30~45° downward — the angle of someone sitting at the table and just snapping the photo. NOT a professional flat-lay, NOT magazine-styled.
Slightly cool color temperature (cold-white indoor LED ceiling light), subtle ceiling-light reflection visible on the table or plate edge.
Authentic background details (one or two of these, partially cropped at the frame edge): the corner of a 반찬통 (Korean side-dish container) lid, a folded paper napkin, a slight water droplet on the table, the corner of a TV remote, a glass of water.
Plate: ordinary Korean home tableware — chipped Corelle-style, plastic melamine, or mismatched ceramic. NOT styled, NOT premium.
Chopsticks dropped casually next to the plate, slightly off-axis.
Slightly off-center framing. Lived-in, real-life vibe.

${NEGATIVES_BASE}, --no professional styling, --no magazine layout

${ABSOLUTE_NO_TEXT}`;

    case "family_table_wide":
      return `${titleLine}
A 45° angle photo of the dish as the centerpiece of a Korean family dinner table.
Wooden dining table.
Visible context (around the main dish): a small bowl of steamed white rice (공깃밥), a small plate of kimchi, 1~2 small Korean side dishes (반찬) like spinach 무침 or stir-fried 어묵.
Warm tungsten / golden hour lighting, cozy homey atmosphere.
Korean ceramic or brass tableware (놋그릇 OK).
Composition: the main dish is the hero (centered, larger), supporting elements visible at the edges but not crowding.

${NEGATIVES_BASE}, --no Western cutlery, --no fork, --no knife

${ABSOLUTE_NO_TEXT}`;

    case "magazine_flat_lay":
      return `${titleLine}
True top-down 90° editorial flat-lay photo of the dish.
Background: white marble OR charcoal slate.
Composition: minimalist, near-symmetric, intentional negative space.
Hard side lighting from the left at 30°, sharp clean shadow on the right side.
Props: a folded linen napkin, copper or wood cutlery (no engraving, no logo), a small dish of garnish.
Style: professional cookbook / magazine spread quality. Sharp focus, vivid colors, clean glossy textures.

${NEGATIVES_BASE}

${ABSOLUTE_NO_TEXT}`;

    case "steam_hero":
      return `${titleLine}
Eye-level low angle close-up of the dish, dish fills 70%+ of the frame.
Visible steam actively rising from the dish, captured in motion, soft and volumetric.
Dark moody background (out of focus, deep brown/black).
Rembrandt-style side lighting — single soft light from the left, deep falloff on the right side of the frame.
Cinematic hero shot feel. Glossy oils/sauces catching the light.
Shallow depth of field, food razor-sharp, background completely blurred.

${NEGATIVES_BASE}

${ABSOLUTE_NO_TEXT}`;
  }
};
