import type { Recipe } from "@/entities/recipe/model/types";

import { deriveActionShots } from "./actionDerivation";
import { classifyIngredient } from "./classifier";
import { translateIngredient, translateSeasoning } from "./translate";
import type {
  FinalThemeKey,
  QuotaMode,
  SequenceCategory,
  SequenceImage,
  SequenceSubcategory,
} from "./types";

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

const NEGATIVES_HANDS_OK = `[Negative Prompts]
--no faces,
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
  cutting_board: `Natural 30~45° three-quarter angle photo, looking down at a wooden cutting board on a kitchen counter — the kind of POV a home cook actually has while prepping ingredients.
Mid-action state: the knife edge is mid-stroke through the ingredient (e.g., a green onion, garlic clove, or vegetable on the board), with several already-cut pieces in a small natural pile to one side.
A single hand visible at the edge of the frame holding the knife handle, cropped at the wrist — NO face, NO body, NO other person.
Authentic prep mess: cut scraps and a few peels at the corner of the board, a few drops of moisture on the wood, slight knife marks on the surface, the cutting board showing realistic wear.
A second hand may be partially visible holding/steadying the ingredient (cropped at wrist) — also no face, no body.`,
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

  const isCuttingBoard = actionKey === "cutting_board";

  const closingLine = isCuttingBoard
    ? `Only the active hand(s) at the frame edge are visible. NO face, NO body, NO other person.`
    : `NO hands, NO arms, NO body parts visible. The cookware sits on its own.`;

  const negatives = isCuttingBoard ? NEGATIVES_HANDS_OK : NEGATIVES_BASE;

  return `${body}

${closingLine}

${ENV_LOCK}

${negatives}

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
  }
};

const FINAL_THEMES: ReadonlyArray<{ key: FinalThemeKey; label: string }> = [
  { key: "korean_mom_phone", label: "엄마 폰스냅" },
];

const ID_SLUG_MAX_LENGTH = 24;

const slug = (s: string): string =>
  s.replace(/\s+/g, "-").slice(0, ID_SLUG_MAX_LENGTH);

const makeId = (
  category: SequenceCategory,
  subcategory: SequenceSubcategory,
  ...parts: string[]
): string => [category, subcategory, ...parts.map(slug)].join("-");

export const buildSequencePrompts = (
  recipe: Recipe,
  mode: QuotaMode
): SequenceImage[] => {
  const out: SequenceImage[] = [];

  const veggies: typeof recipe.ingredients = [];
  const meats: typeof recipe.ingredients = [];
  const mainSeasonings: typeof recipe.ingredients = [];
  const minorSeasonings: typeof recipe.ingredients = [];

  for (const ing of recipe.ingredients) {
    const role = classifyIngredient({ ...ing, inFridge: false });
    switch (role) {
      case "vegetable":
        veggies.push(ing);
        break;
      case "meat":
        meats.push(ing);
        break;
      case "seasoning_main":
        mainSeasonings.push(ing);
        break;
      case "seasoning_minor":
        minorSeasonings.push(ing);
        break;
      // "other" -> skip
    }
  }

  for (const v of veggies) {
    out.push({
      id: makeId("prep", "vegetable", v.name),
      category: "prep",
      subcategory: "vegetable",
      label: `${v.name} ${v.quantity ?? ""}${v.unit}`.trim(),
      prompt: buildVegetableTrayPrompt({
        name: v.name,
        quantity: v.quantity,
        unit: v.unit,
      }),
    });
  }

  for (const m of meats) {
    out.push({
      id: makeId("prep", "meat", m.name),
      category: "prep",
      subcategory: "meat",
      label: `${m.name} ${m.quantity ?? ""}${m.unit}`.trim(),
      prompt: buildMeatTrayPrompt({
        name: m.name,
        quantity: m.quantity,
        unit: m.unit,
      }),
    });
  }

  for (const s of mainSeasonings) {
    out.push({
      id: makeId("prep", "seasoning_main", s.name, s.quantity ?? "", s.unit),
      category: "prep",
      subcategory: "seasoning_main",
      label: `${s.name} ${s.quantity ?? ""}${s.unit}`.trim(),
      prompt: buildSeasoningSinglePrompt({
        name: s.name,
        quantity: s.quantity,
        unit: s.unit,
      }),
    });
  }

  if (minorSeasonings.length > 0) {
    if (mode === "single") {
      for (const s of minorSeasonings) {
        out.push({
          id: makeId(
            "prep",
            "seasoning_minor_single",
            s.name,
            s.quantity ?? "",
            s.unit
          ),
          category: "prep",
          subcategory: "seasoning_minor_single",
          label: `${s.name} ${s.quantity ?? ""}${s.unit}`.trim(),
          prompt: buildSeasoningSinglePrompt({
            name: s.name,
            quantity: s.quantity,
            unit: s.unit,
          }),
        });
      }
    } else {
      out.push({
        id: makeId("prep", "seasoning_minor_combined", "all"),
        category: "prep",
        subcategory: "seasoning_minor_combined",
        label: `마이너 양념 ${minorSeasonings.length}종`,
        prompt: buildSeasoningCombinedPrompt(
          minorSeasonings.map((s) => ({
            name: s.name,
            quantity: s.quantity,
            unit: s.unit,
          }))
        ),
      });
    }
  }

  const actions = deriveActionShots(recipe.steps);
  for (const a of actions) {
    out.push({
      id: makeId("action", "action", a.actionKey),
      category: "action",
      subcategory: "action",
      label: a.label,
      prompt: buildActionPrompt(a.actionKey),
    });
  }

  for (const t of FINAL_THEMES) {
    out.push({
      id: makeId("final", "final_theme", t.key),
      category: "final",
      subcategory: "final_theme",
      label: t.label,
      prompt: buildFinalThemePrompt(t.key, recipe.title),
      themeKey: t.key,
    });
  }

  return out;
};
