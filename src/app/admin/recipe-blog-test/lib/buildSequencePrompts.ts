import type { Recipe, RecipeStep } from "@/entities/recipe/model/types";

import { translateAction, translateIngredient } from "./translate";
import type { SequenceImage } from "./types";

const NO_TEXT_BANNER = `[NO TEXT IN IMAGE — STRICT, READ FIRST]
The image must contain absolutely no printed words. No Korean, no English, no numbers, no captions, no signs, no logos, no labels, no brand markings on bottles, packaging, or cookware. Surfaces stay blank where text would naturally appear.`;

const STYLE = `[ENVIRONMENT LOCK — VISUAL STYLE]
Photograph this in the style of a popular Korean home food influencer's blog or Instagram (think a 만개의레시피 user upload, or a casual Naver food blog post). Clean, well-lit, appetizing — but never commercial-magazine glossy. Realistic home cooking, not Michelin photography.
Lens equivalent: 50mm. Smartphone-or-DSLR quality.
Aperture: moderate — food in clear focus, light natural background softness, no heavy bokeh.
Lighting: soft natural daylight from a kitchen window, ~5500K, gentle ambient shadow. Direction may shift slightly between shots; always neutral and soft.
Color: vivid yet realistic, true-to-food, not oversaturated, not commercially graded.
Sharpness: real camera output — natural texture on ingredients, no AI-smoothing, no plastic look.
Surface: light wooden or matte light-grey kitchen counter with realistic minor wear.
Cookware: everyday Korean home kitchen items only — stainless steel pan or pot, non-stick pan, plain ceramic mixing bowl, glass measuring bowl, regular ceramic plate. Avoid 뚝배기 stoneware, cast iron, and any commercial restaurant cookware.`;

const NEGATIVES_NATURAL = `[CONTENT EXCLUSIONS — natural language, must be respected]
The image must not contain: any human face, any full human body, any second person, any printed text or logos or labels, any commercial-restaurant or magazine-styled prop arrangement, any plastic-toy look, any over-sharpened AI-smoothed look, any blurry or distorted output.`;

const ACTION_DESCRIPTIONS: Record<string, string> = {
  cutting_board:
    "ingredients being sliced or diced on a wooden cutting board, the knife edge mid-stroke through the food, with already-cut pieces in a small natural pile to one side",
  stir_fry:
    "stir-frying in a hot stainless or non-stick pan with visible oil sheen and slight steam, food caught mid-toss",
  pan_fry:
    "flat-pan frying like 부침개 or jeon — batter spread on a hot non-stick pan, edges turning golden",
  simmer:
    "soup or stew gently simmering in a stainless or non-stick pot, soft steam rising, surface lightly bubbling",
  mix_bowl:
    "ingredients being mixed in a plain ceramic or stainless bowl, glossy with seasoning, mid-motion of mixing",
  deep_fry:
    "items being deep-fried in clear oil in a stainless pot, golden crispy color forming, oil bubbling around them",
  steam_action:
    "steam billowing from a regular steamer pot on the stove, lid slightly ajar to reveal contents",
  place_into:
    "ingredients being placed or poured INTO a vessel — eggs, flour, liquid, or solids going IN. Absolutely no cutting motion, no chopping, no stirring; just the moment of placement",
  knead:
    "dough being kneaded by hand in a plain bowl or on a lightly floured counter — pressing and folding motion",
  sieve:
    "powder being sifted through a fine mesh sieve held just above a bowl, a fine cloud of powder falling",
  rest:
    "dough or batter resting still in a covered bowl on the counter — no active motion, calm clean scene",
};

const ACTIVE_HANDS_KEYS = new Set([
  "cutting_board",
  "stir_fry",
  "pan_fry",
  "mix_bowl",
  "deep_fry",
  "knead",
  "sieve",
]);

const buildRecipeContext = (
  recipe: Recipe,
  position: number,
  total: number
): string => {
  const dishLabel = recipe.dishType
    ? `${recipe.title} (a ${recipe.dishType})`
    : recipe.title;
  return `[RECIPE CONTEXT — for understanding only, never depict as text]
Final dish being prepared: ${dishLabel}
This image: number ${position} of ${total} in the cooking sequence.
Style anchor: a Korean home food influencer's blog series — same kitchen aesthetic across all images.`;
};

const formatIngredientLine = (
  i: NonNullable<RecipeStep["ingredients"]>[number]
): string => {
  const en = translateIngredient(i.name);
  const qtyUnit = `${i.quantity ?? ""}${i.unit ?? ""}`.trim();
  return qtyUnit ? `${i.name} (${en}) — ${qtyUnit}` : `${i.name} (${en})`;
};

const buildContinuityBlock = (prevSteps: RecipeStep[]): string => {
  if (prevSteps.length === 0) return "";
  const lines = prevSteps
    .map(
      (s) =>
        `- Step ${s.stepNumber}: ${s.instruction?.trim() || "(no instruction)"}`
    )
    .join("\n");
  return `[CONTINUITY — earlier steps of this same recipe have already happened]
${lines}

The cookware in front of you is the cumulative result of those steps. It already contains everything those steps put into it (now visibly cooked-down, simmered, stirred-in, or transformed — not raw, not fresh). A reference image of the most recent state is provided when available; preserve the same pot or pan, the same liquid level and color, the same already-present ingredients. Do NOT start from an empty fresh vessel. This step only adds the specific action described below to that existing state.

`;
};

export const buildStepPrompt = (
  step: RecipeStep,
  recipe: Recipe,
  position: number,
  total: number,
  prevSteps: RecipeStep[] = []
): string => {
  const ctx = buildRecipeContext(recipe, position, total);
  const instruction = step.instruction?.trim() || "(no instruction)";
  const actionHint = step.action?.trim() || "(unspecified)";

  const actionEnglishKey =
    translateAction(actionHint) || translateAction(instruction) || null;
  const actionVisualRef =
    (actionEnglishKey && ACTION_DESCRIPTIONS[actionEnglishKey]) ||
    "interpret the Korean instruction literally — render the exact action it describes, no substitution";

  const ingredientList =
    (step.ingredients ?? []).map(formatIngredientLine).join("; ") ||
    "(none specified for this step — read the Korean instruction; any ingredient names mentioned there are the ones being added now)";

  const handsDirective =
    actionEnglishKey && ACTIVE_HANDS_KEYS.has(actionEnglishKey)
      ? "A single hand or pair of hands ARE visible at the frame edge, cropped at the wrist, actively engaged in the action (holding knife, spatula, ingredient). No face, no body, no other person."
      : "No hands visible. The ingredients and cookware sit on the surface on their own — calm, clean, static.";

  const continuity = buildContinuityBlock(prevSteps);

  return `${NO_TEXT_BANNER}

${ctx}

${continuity}[STEP DESCRIPTION — RENDER EXACTLY THIS, NOTHING INVENTED]
Korean instruction (verbatim, treat this as the ground truth — render the literal moment described): ${instruction}
Action hint (Korean verb): ${actionHint}
Action interpretation (English visual reference): ${actionVisualRef}
Ingredients used in this step: ${ingredientList}

[CRITICAL — DO NOT INVENT]
Render only the literal moment described in the Korean instruction above. Do not add or substitute actions.
Korean verb cues to respect:
- "담는다" / "넣는다" / "붓는다" / "올린다" → items being placed or poured INTO a vessel; no chopping, no stirring
- "섞는다" / "휘젓는다" / "비빈다" → mixing or whisking motion in a bowl
- "볶는다" / "굽는다" → hot pan with oil sheen, food cooking
- "부친다" → flat-pan frying like 부침개 / jeon
- "썬다" / "자른다" / "다진다" → cutting on a wooden board
- "끓인다" / "삶는다" → pot with bubbles and soft steam
- "치댄다" / "반죽한다" → kneading dough by hand
- "체에 친다" / "거른다" → sifting powder through a sieve
- "휴지" / "재운다" → dough or mixture resting in a covered bowl, no motion
The model is multilingual — read the Korean text carefully and match the literal verb.

[SCENE COMPOSITION]
Camera angle: pick the most natural angle for this specific action — top-down 90° for laying out ingredients, three-quarter 30~45° for cutting or active cooking, eye-level for stirring or pouring. Across the full sequence the angles should vary naturally; do not lock to a single angle.
Composition: one main subject, breathing room around it, the action clearly readable.
Hands: ${handsDirective}

${STYLE}

${NEGATIVES_NATURAL}

[ABSOLUTE NO-TEXT RULE — CLOSING REINFORCE]
Render no printed text, captions, signs, labels, or logos anywhere in the image. Surfaces stay blank.`;
};

export const buildFinalPlatedPrompt = (
  recipe: Recipe,
  position: number,
  total: number
): string => {
  const ctx = buildRecipeContext(recipe, position, total);
  return `${NO_TEXT_BANNER}

${ctx}

[FINAL — THE COMPLETED DISH]
This is the final plated result of all the prep and cooking shown in the previous ${total - 1} images. Show "${recipe.title}" plated and ready to eat.

[REFERENCE CONTINUITY — IMPORTANT]
A reference image from the same cooking sequence is provided. Maintain visual continuity with it: same kitchen surface tone and material, same lighting feel and color temperature family, same level of home-cooking realism. The dish itself should now be plated and presented as ready to eat — do not copy the action shot, only inherit the world.

A casual, slightly imperfect smartphone photo (iPhone or Galaxy) of the dish on a normal Korean home dining table.
Angle: 30~45° downward — the angle of someone sitting at the table, just snapping a quick photo. NOT a professional flat-lay, NOT magazine-styled.
Color temperature: slightly cool indoor LED ceiling light, with a subtle ceiling-light reflection on the table or plate edge.
Background props (subtle, 1-2 only, partially cropped at frame edges): a glass of water, a folded paper napkin, the corner of a 반찬통 lid, or simply a plain table edge with no extra props at all. Pick whichever feels most lived-in for this specific dish.
Plate: ordinary Korean home tableware — chipped Corelle-style, plastic melamine, or mismatched ceramic. Not styled, not premium.
Chopsticks or fork dropped casually next to the plate, slightly off-axis (whichever fits the dish type).
Slightly off-center framing, lived-in real-life vibe.

[CONTENT EXCLUSIONS]
No human face, no full body, no second person, no printed text or labels, no professional styling, no magazine-style prop arrangement.

[ABSOLUTE NO-TEXT RULE — CLOSING REINFORCE]
Render no printed text, captions, signs, labels, or logos anywhere in the image.`;
};

export const buildSequencePrompts = (recipe: Recipe): SequenceImage[] => {
  const sortedSteps = recipe.steps
    .slice()
    .sort((a, b) => a.stepNumber - b.stepNumber);
  const total = sortedSteps.length + 1; // +1 for final

  const stepImages: SequenceImage[] = sortedSteps.map((step, idx) => {
    const position = idx + 1;
    const labelSource = (step.action ?? step.instruction ?? "").slice(0, 30);
    const prevSteps = sortedSteps.slice(0, idx);
    return {
      id: `step-${step.stepNumber}`,
      category: "step",
      subcategory: "step",
      label: `Step ${step.stepNumber}: ${labelSource}`,
      prompt: buildStepPrompt(step, recipe, position, total, prevSteps),
    };
  });

  const lastStep = sortedSteps[sortedSteps.length - 1];
  const finalImage: SequenceImage = {
    id: "final-plated",
    category: "final",
    subcategory: "final_plated",
    label: "엄마 폰스냅 (완성)",
    prompt: buildFinalPlatedPrompt(recipe, total, total),
    requiresReference: lastStep != null,
    referenceFromImageId: lastStep ? `step-${lastStep.stepNumber}` : undefined,
  };

  return [...stepImages, finalImage];
};
