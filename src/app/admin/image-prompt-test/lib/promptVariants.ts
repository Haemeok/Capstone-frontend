import type { Recipe } from "@/entities/recipe/model/types";

import { buildPrompt } from "@/app/admin/image-quality-test/lib/buildPrompt";

export type PromptVariant = {
  id: string;
  label: string;
  description: string;
  build: (recipe: Recipe) => string;
  isPlaceholder?: true;
};

const buildProductionPrompt = (recipe: Recipe): string =>
  buildPrompt({
    title: recipe.title,
    description: recipe.description,
    dishType: recipe.dishType,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    fineDiningInfo: recipe.fineDiningInfo,
  });

// Standalone fork of buildFinalPlatedPrompt (recipe-blog-test) — strips the
// "previous N images" / REFERENCE CONTINUITY wording that only makes sense
// inside a multi-image cooking sequence. Kept here so we can tune the
// comparison prompt without touching production blog generation.
const buildMomPhoneStandalone = (recipe: Recipe): string => {
  const dishLabel = recipe.dishType
    ? `${recipe.title} (a ${recipe.dishType})`
    : recipe.title;

  return `[NO TEXT IN IMAGE — STRICT, READ FIRST]
The image must contain absolutely no printed words. No Korean, no English, no numbers, no captions, no signs, no logos, no labels, no brand markings on bottles, packaging, or cookware. Surfaces stay blank where text would naturally appear.

[RECIPE CONTEXT — for understanding only, never depict as text]
Final dish: ${dishLabel}
Style anchor: a Korean home food influencer's blog or Instagram thumbnail — same kitchen aesthetic as a 만개의레시피 user upload or a casual Naver food blog post.

[FINAL — THE COMPLETED DISH]
Show "${recipe.title}" plated and ready to eat. A casual, slightly imperfect smartphone photo (iPhone or Galaxy) of the dish on a normal Korean home dining table.
Angle: 30~45° downward — the angle of someone sitting at the table, just snapping a quick photo. NOT a professional flat-lay, NOT magazine-styled.
Color temperature: slightly cool indoor LED ceiling light, with a subtle ceiling-light reflection on the table or plate edge.
Background props (subtle, 1-2 only, partially cropped at frame edges): a glass of water, a folded paper napkin, the corner of a 반찬통 lid, or simply a plain table edge with no extra props at all. Pick whichever feels most lived-in for this specific dish.
Plate: ordinary Korean home tableware — chipped Corelle-style, plastic melamine, or mismatched ceramic. Not styled, not premium.
Chopsticks or fork dropped casually next to the plate, slightly off-axis (whichever fits the dish type).
Slightly off-center framing, lived-in real-life vibe.

[CONTENT EXCLUSIONS]
No human face, no full body, no second person, no printed text or labels, no professional styling, no magazine-style prop arrangement, no plastic-toy look, no over-sharpened AI-smoothed look.

[ABSOLUTE NO-TEXT RULE — CLOSING REINFORCE]
Render no printed text, captions, signs, labels, or logos anywhere in the image.`;
};

export const PROMPT_VARIANTS: readonly PromptVariant[] = [
  {
    id: "production",
    label: "프로덕션 프롬프트",
    description:
      "image-quality-test 기준. iPhone 15 Pro Max 음식 사진 톤, 랜덤 angle/lighting/background/cutlery.",
    build: buildProductionPrompt,
  },
  {
    id: "mom-phone",
    label: "엄마 폰 프롬프트",
    description:
      "recipe-blog-test 썸네일 톤. 한국 가정식 식탁 위 LED 천장조명, 캐주얼 스마트폰 스냅.",
    build: buildMomPhoneStandalone,
  },
  {
    id: "tbd-1",
    label: "Variant 3 (TBD)",
    description: "비워둠. 사용자가 직접 프롬프트 작성.",
    build: () => "",
    isPlaceholder: true,
  },
  {
    id: "tbd-2",
    label: "Variant 4 (TBD)",
    description: "비워둠. 사용자가 직접 프롬프트 작성.",
    build: () => "",
    isPlaceholder: true,
  },
  {
    id: "tbd-3",
    label: "Variant 5 (TBD)",
    description: "비워둠. 사용자가 직접 프롬프트 작성.",
    build: () => "",
    isPlaceholder: true,
  },
] as const;
