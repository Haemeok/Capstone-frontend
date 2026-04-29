import type { Recipe, RecipeStep } from "@/entities/recipe/model/types";

import { translateIngredient } from "./translate";
import type { FinalThemeKey, SequenceImage } from "./types";

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

const NEGATIVES_FOR_STEP = `--no people, --no faces, --no body parts beyond a hand at the edge,
--no text, --no watermark, --no caption,
--no logo, --no brand, --no label, --no packaging,
--no maker mark, --no seal, --no stamp, --no engraving,
--no plastic look, --no blurry, --no distorted`;

const buildRecipeContext = (
  recipe: Recipe,
  position: number,
  total: number
): string => {
  const dishLabel = recipe.dishType
    ? `${recipe.title} (a ${recipe.dishType})`
    : recipe.title;
  return `[RECIPE CONTEXT — KEEP COHERENT WITH FINAL DISH]
Final dish being prepared: ${dishLabel}
This sequence has ${total} images total. This image: number ${position} of ${total}.
All images in this sequence belong to ONE coherent recipe — same kitchen, same lighting, same cookware family, leading toward the dish above.
DO NOT show this text in the image. NO captions, NO labels, NO printed words.`;
};

export const buildStepPrompt = (
  step: RecipeStep,
  recipe: Recipe,
  position: number,
  total: number
): string => {
  const ctx = buildRecipeContext(recipe, position, total);
  const instruction = step.instruction?.trim() || "(no instruction)";
  const actionHint = step.action?.trim() || "(unspecified)";
  const stepIngredients =
    (step.ingredients ?? [])
      .map((i) => {
        const en = translateIngredient(i.name);
        const qtyUnit = `${i.quantity ?? ""}${i.unit ?? ""}`.trim();
        return qtyUnit
          ? `${i.name} (${en}) — ${qtyUnit}`
          : `${i.name} (${en})`;
      })
      .join("; ") || "(none specified)";

  return `${ctx}

[STEP DESCRIPTION — RENDER EXACTLY THIS, NOTHING INVENTED]
Korean instruction (verbatim, treat this as the ground truth — render the literal moment described): ${instruction}
Action hint (Korean verb): ${actionHint}
Ingredients used in this step: ${stepIngredients}

[CRITICAL — DO NOT INVENT]
Render only the literal moment described in the Korean instruction above. Do NOT add or substitute actions.
- If the instruction says "담는다" / "넣는다" / "붓는다" (put in / add / pour), show items being placed into a vessel — NOT chopped, NOT stirred.
- If the instruction says "섞는다" / "휘젓는다" (mix / whisk), show mixing or whisking — NOT pouring.
- If the instruction says "볶는다" / "굽는다" (stir-fry / pan-cook), show that action with a hot pan and oil sheen.
- If the instruction says "썬다" / "다진다" (slice / mince), show cutting on a board.
- If the instruction says "끓인다" / "삶는다" (boil / simmer), show a pot with bubbles and steam.
- If the instruction says "휴지" / "기다린다" (rest / wait), show the dough/mixture sitting still in the bowl, no active motion.
- Match the literal Korean verb. The model is multilingual — trust the source instruction.

[SCENE COMPOSITION]
Korean home kitchen counter (light wooden or matte light-grey). Stainless steel cookware where the step requires it; wooden cutting board where the step requires cutting; mixing bowls where the step requires combining.
Camera angle: choose whichever feels MOST NATURAL for the literal action — top-down 90° for prep on a tray, three-quarter 30~45° for active cooking or cutting, eye-level for stirring/pouring. Avoid rigid identical angles across all steps.
A single hand or pair of hands may be partially visible at the frame edge (cropped at wrist), holding the relevant tool or ingredient. NO face, NO body, NO other person.

${ENV_LOCK}

[Negative Prompts]
${NEGATIVES_FOR_STEP}

${ABSOLUTE_NO_TEXT}`;
};

export const buildFinalThemePrompt = (
  theme: FinalThemeKey,
  recipe: Recipe,
  position: number,
  total: number
): string => {
  const ctx = buildRecipeContext(recipe, position, total);
  // theme === "korean_mom_phone" only
  void theme;
  return `${ctx}

[FINAL — THE COMPLETED DISH]
This is the FINAL plated result of all the prep/cooking shown in the previous ${total - 1} images. Show the dish "${recipe.title}" plated and ready to eat.

A casual, slightly imperfect smartphone photo (iPhone or Galaxy) of the dish on a normal Korean home dining table.
Angle: 30~45° downward — the angle of someone sitting at the table and just snapping the photo. NOT a professional flat-lay, NOT magazine-styled.
Slightly cool color temperature (cold-white indoor LED ceiling light), subtle ceiling-light reflection visible on the table or plate edge.
Authentic background details (one or two of these, partially cropped at the frame edge): the corner of a 반찬통 (Korean side-dish container) lid, a folded paper napkin, a slight water droplet on the table, the corner of a TV remote, a glass of water.
Plate: ordinary Korean home tableware — chipped Corelle-style, plastic melamine, or mismatched ceramic. NOT styled, NOT premium.
Chopsticks or fork dropped casually next to the plate, slightly off-axis (use whichever fits the dish type).
Slightly off-center framing. Lived-in, real-life vibe.

[Negative Prompts]
${NEGATIVES_FOR_STEP}, --no professional styling, --no magazine layout

${ABSOLUTE_NO_TEXT}`;
};

export const buildSequencePrompts = (recipe: Recipe): SequenceImage[] => {
  const sortedSteps = recipe.steps
    .slice()
    .sort((a, b) => a.stepNumber - b.stepNumber);
  const total = sortedSteps.length + 1; // +1 for final

  const stepImages: SequenceImage[] = sortedSteps.map((step, idx) => {
    const position = idx + 1;
    const labelSource = (step.action ?? step.instruction ?? "").slice(0, 30);
    return {
      id: `step-${step.stepNumber}`,
      category: "step",
      subcategory: "step",
      label: `Step ${step.stepNumber}: ${labelSource}`,
      prompt: buildStepPrompt(step, recipe, position, total),
    };
  });

  const finalImage: SequenceImage = {
    id: "final-korean_mom_phone",
    category: "final",
    subcategory: "final_theme",
    label: "엄마 폰스냅",
    prompt: buildFinalThemePrompt("korean_mom_phone", recipe, total, total),
    themeKey: "korean_mom_phone",
  };

  return [...stepImages, finalImage];
};
