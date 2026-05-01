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

// =====================================================================
// Archetype-based variants (slots 3–9)
// =====================================================================
//
// Each archetype shares a uniform skeleton (NO_TEXT → CONTEXT → SCENE →
// COMPOSITION → EXCLUSIONS → CLOSING). The archetype object only describes
// the variable parts; `buildArchetypePrompt` stitches them in.
//
// `attribution` references real influencers/magazines so gpt-image-2 can
// anchor to those visual libraries. Keep a single coherent reference per
// archetype.
//
// Vessel material/finish is fixed by the archetype; vessel SHAPE is
// inferred at render-time by the model from `recipe.dishType` via the
// shared rule below — so a soup never lands on a flat plate.

type Archetype = {
  id: string;
  label: string;
  description: string;
  attribution: string;
  scene: string;
  composition: string;
  extraExclusions: string;
};

const VESSEL_SHAPE_RULE = `Vessel SHAPE is inferred from the dish type — deep bowl for soups, stews, and noodles in broth; shallow plate or platter for stir-fries, jeon, grilled, or roasted plated dishes; deep dish or pasta plate for saucy braises and pasta; wide flat platter for salads and finger foods; medium round bowl for rice or grain bowls. Use the recipe dishType above to choose the appropriate shape; the archetype only fixes the material and finish.`;

const buildArchetypePrompt = (
  recipe: Recipe,
  archetype: Archetype
): string => {
  const dishLabel = recipe.dishType
    ? `${recipe.title} (a ${recipe.dishType})`
    : recipe.title;
  const dishTypeStr = recipe.dishType || "unspecified";

  return `[NO TEXT IN IMAGE — STRICT, READ FIRST]
The image must contain absolutely no printed words. No Korean, no English, no numbers, no captions, no signs, no logos, no labels, no brand markings on bottles, packaging, or cookware. Surfaces stay blank where text would naturally appear.

[RECIPE CONTEXT — for understanding only, never depict as text]
Final dish: ${dishLabel}
Recipe dishType: ${dishTypeStr}
Style anchor: ${archetype.attribution}

[SCENE]
${archetype.scene}
${VESSEL_SHAPE_RULE}

[COMPOSITION]
${archetype.composition}

[CONTENT EXCLUSIONS]
No human face, no full body, no second person, no printed text or labels, no logos, no plastic-toy look, no over-sharpened AI-smoothed look. ${archetype.extraExclusions}

[ABSOLUTE NO-TEXT RULE — CLOSING REINFORCE]
Render no printed text, captions, signs, labels, or logos anywhere in the image.`;
};

const KOREAN_MAGAZINE: Archetype = {
  id: "korean-magazine",
  label: "한국 푸드매거진",
  description:
    "수퍼레시피·올리브매거진 톤. 밝고 정돈된 editorial Korean. 큰 창 자연광, 라이트우드, 매트 stoneware.",
  attribution:
    "a Korean food magazine like 수퍼레시피 or 올리브매거진 — bright, intentional, editorial Korean home cooking; the polished middle ground a Korean food editor would shoot for a print recipe page, not Michelin restaurant, not 만개의레시피 user upload",
  scene: `Camera: full-frame mirrorless, 50mm equivalent, moderate aperture (f/4–5.6) — the dish in clean focus, gentle natural background softness, no aggressive bokeh.
Angle: 30–40° three-quarter downward, dish slightly off-center toward the upper third of the frame.
Lighting: soft natural daylight from a large kitchen window on the left, slightly warm at around 5400K, gentle directional shadow falling to the right of the dish. No artificial lights. No LED ceiling glare.
Surface: light wood (oak or birch with visible grain) or matte light-stone counter. Subtle natural texture, clean of crumbs, slightly worn but well-cared-for.
Vessel material: matte stoneware or unglazed ceramic in a muted earth tone — oat, sage, terracotta, or off-white. Not chipped, not pristine; intentionally chosen, slightly handmade-looking.
Mood: bright, intentional, editorial-Korean — refined home cooking captured for a magazine recipe page.`,
  composition:
    "One main subject. Breathing room around the dish. Optionally one small intentional prop partially cropped at the frame edge: a folded linen napkin in a muted color, a small ceramic spoon laid parallel to the plate, a single sprig of fresh herb resting on the surface. No hands. Slight off-center placement following rule-of-thirds.",
  extraExclusions:
    "No hands. No commercial restaurant cutlery, no LED ceiling light, no harsh artificial fill, no glossy plastic, no mass-market white melamine.",
};

const WESTERN_INFLUENCER: Archetype = {
  id: "western-influencer",
  label: "서구 푸드 인플루언서",
  description:
    "NYT Cooking·Bon Appétit. 따뜻한 측창광, cream-painted wood, 핸드메이드 도자기, 쿡북 페이지 톤.",
  attribution:
    "NYT Cooking-style food photography in the spirit of Eric Kim or Yewande Komolafe, plus Bon Appétit Test Kitchen aesthetic — warm, inviting, slightly rustic-modern home cooking, captured in natural side light with an organic, lived-in cookbook-page feel",
  scene: `Camera: full-frame mirrorless, 50–85mm equivalent, moderate aperture (f/3.5–5) — sharp on the dish, soft natural fall-off in the background.
Angle: 30–45° three-quarter downward, dish placed in the lower-left or lower-right third.
Lighting: late-afternoon window side-light from one side at warm 4500K, creating a clear directional shadow stretching across the table. Optionally slightly dappled or filtered as if through a sheer curtain.
Surface: light cream-painted wood, aged oak with patina, or a soft linen napkin draping under the dish. Slightly used, lived-in but clean.
Vessel material: handmade ceramic in off-white, cream, or muted warm earth tone with imperfect glaze and visible throwing marks. Not pristine, not commercial.
Mood: warm, inviting, cookbook-page energy — the kind of food shot that would headline an NYT Cooking recipe.`,
  composition:
    "Dish as hero. Two or three thoughtfully chosen props partially cropped at frame edges: a small wooden spoon, a folded linen napkin in a muted color, a tiny dish of flaky salt, a sprig of fresh herb on the table beside the plate. No hands. Allow a small drizzle of sauce or scatter of finishing salt directly on the dish itself. A dish-appropriate utensil (chopsticks for Asian dishes, fork or spoon for Western dishes) lies casually beside the plate.",
  extraExclusions:
    "No hands. No commercial-restaurant prop styling, no LED ceiling light, no harsh overhead artificial fill.",
};

const MOODY_DARK: Archetype = {
  id: "moody-dark",
  label: "무디 다크",
  description:
    "Bea Lubas·Christina Greve. Chiaroscuro 단일 측창광, dark slate, dark stoneware, 시네마틱 정물화 분위기.",
  attribution:
    "moody food photography in the style of Bea Lubas and Christina Greve — chiaroscuro, dramatic single-source side-lighting, dark surface, cinematic atmosphere reminiscent of Dutch master still-life painting",
  scene: `Camera: full-frame mirrorless, 85mm equivalent, moderate-to-wide aperture (f/2.8–4) — selective focus on the dish, deep shadow fall-off in the background.
Angle: 30–45° three-quarter, often slightly low for drama; dish centered or in the upper portion of the frame.
Lighting: a single window light from one side at a low angle, creating a sharp directional gradient — bright on the lit side, deep shadow on the unlit side. Late-evening or overcast-afternoon feel, cool-warm contrast around 4000K.
Surface: dark slate, dark stained wood with visible grain, or a black matte cloth. Heavy texture. Reflective in places — a faintly moist tabletop catching the side-light.
Vessel material: dark stoneware, matte black ceramic, or charcoal-glazed earthenware. Solid color, no pattern.
Mood: dramatic, cinematic, contemplative — single hero with an emotional, painterly atmosphere.`,
  composition:
    "One main subject, plenty of negative shadow space around it. Dark, restrained props: a black napkin partially draped, a single bay leaf, a smudge of sauce on the surface beside the plate. Steam visible if the dish is hot. No hands. Lighting falls off into deep shadow at the frame edges.",
  extraExclusions:
    "No hands. No overhead light, no bright white background, no commercial-clean styling, no even fill-lighting, no flat lighting.",
};

const TOP_DOWN_FLATLAY: Archetype = {
  id: "top-down-flatlay",
  label: "탑다운 플랫레이",
  description:
    "Marion Grasby·한국 인스타 푸드 톤. 90° 정수리 구도, 손목 컷오프 hand + chopsticks/fork mid-gesture.",
  attribution:
    "an Instagram food influencer's overhead flat-lay shot — 90° top-down with intentional but lived-in styling, hands and chopsticks or utensils visible. Think Marion Grasby's overhead pan-Asian shots and popular Korean Instagram food accounts (e.g. @sookoonjon-style)",
  scene: `Camera: smartphone or mirrorless held directly overhead — perfectly 90° top-down, no perspective tilt, no foreshortening.
Angle: 90° flat overhead. Dish slightly off-center, occupying about 60% of the frame.
Lighting: soft even daylight from a window above the table, minimal harsh shadows, slight directional gradient. Bright, slightly warm at around 5000K.
Surface: light wood, marble, or a clean linen cloth as the background. Visible texture in the surface.
Vessel material: clean modern ceramic or stoneware in a single muted tone — white, oat, sage, terracotta, or charcoal. Distinct against the surface.
Mood: bright, intentional Instagram-flatlay aesthetic — composed but lived-in.`,
  composition:
    "True top-down composition, no perspective. Dish as the main subject. A hand or pair of hands cropped at the wrist enters from one frame edge — holding chopsticks for Asian dishes or a fork or spoon for Western dishes — captured mid-gesture as if about to take a bite or pick up a piece. This cropped hand at the wrist is allowed and required; no face, no body, no second person. One or two small accent props partially cropped at frame edges: a smaller dish with a side, a glass of water, a sprig of fresh herb, a folded napkin. Slightly off-grid, lived-in feel.",
  extraExclusions:
    "No tilted or three-quarter angles — the camera must be perfectly overhead. No commercial-restaurant prop styling.",
};

const ABUNDANCE_GOLDEN: Archetype = {
  id: "abundance-golden",
  label: "어번던스 골든아워",
  description:
    "Half Baked Harvest. 골든아워 따뜻한 측광, 흩뿌려진 허브·소금, 드리즐 mid-pour, aged wood + warm stoneware.",
  attribution:
    "Half Baked Harvest aesthetic by Tieghan Gerard — abundant, golden-hour warm, herbs and finishing salt scattered on and around the dish, oil or sauce drizzle captured mid-motion, lived-in rustic styling",
  scene: `Camera: full-frame mirrorless, 50–85mm equivalent, moderate aperture (f/3.5–5).
Angle: 30–45° three-quarter, often slightly close-up on the dish so only part of the surrounding table shows.
Lighting: golden-hour late-afternoon warm sunlight from one side at 3500–4000K, creating long warm shadows; sometimes lit through fabric or a window with a slight bloom.
Surface: aged wood with rich grain, dark or light, slightly weathered; or a draped natural-fiber linen cloth in cream, oat, or rust. Often shows visible flour dust, salt grains, or oil traces.
Vessel material: warm-toned stoneware (terracotta, rust, deep-amber) or aged enamelware. Earthy, generous in size, with patina.
Mood: abundant, generous, golden, indulgent — like a celebratory home meal.`,
  composition:
    "Dish positioned slightly off-center. Around the dish: a scattering of fresh herbs (whole sprigs and torn pieces), a sprinkle of flaky salt, drops of olive oil on the surface, a small wooden cutting board with extra ingredients (lemon wedge, garlic clove, herb bunch). On the dish itself: a visible drizzle of sauce or oil captured mid-pour, a generous garnish of fresh herbs. A small pitcher or oil bottle partially in frame at the edge. Slightly messy, lived-in abundance. No hands.",
  extraExclusions:
    "No hands. No minimalism, no clinical white styling, no cool LED light, no over-clean composition, no negative-space-heavy framing.",
};

const ACTION_PROCESS: Archetype = {
  id: "action-process",
  label: "액션 프로세스",
  description:
    "Smitten Kitchen·Hetty Lui McKinnon. 손이 드리즐/소금뿌리기/허브 흩뿌리기 mid-action, 쿡북 자연 톤.",
  attribution:
    "process-shot food photography in the style of Smitten Kitchen by Deb Perelman or Hetty Lui McKinnon's cookbooks — a hand mid-action finishing the dish (drizzling sauce, sprinkling flaky salt, scattering fresh herbs), captured at the moment of plating",
  scene: `Camera: full-frame mirrorless, 50mm equivalent, moderate aperture (f/4).
Angle: 30–45° three-quarter, slightly close to the dish, shutter caught mid-action.
Lighting: soft natural daylight from one side at neutral-warm 4500K. Some directional shadow but soft falloff. Real kitchen feel.
Surface: light wood counter, marble with patina, or a dish towel draped under the plate. Mild visible texture.
Vessel material: handmade ceramic or stoneware in cream, off-white, or muted earth tone. Slight imperfect glaze, visible throwing marks.
Mood: in-progress, real-cooking, cookbook-natural — captured at the moment of finishing the plate.`,
  composition:
    "Dish slightly off-center. A hand or pair of hands cropped at the wrist enters from one frame edge — actively drizzling olive oil or sauce from a small jar or spoon, OR sprinkling flaky salt from a pinched palm, OR scattering fresh herbs onto the plate. The action is captured mid-gesture (the oil mid-pour, the salt mid-sprinkle, the herbs mid-fall). This cropped hand at the wrist mid-action is allowed and required; no face, no body, no second person. Small ingredients visible on the surface around the plate (cut herbs, salt jar, oil bottle partially in frame). The action is the focal moment.",
  extraExclusions:
    "No commercial-restaurant prop styling, no clinical-white minimal staging, no static finished-only composition — the hand mid-action is the whole point.",
};

const NORDIC_MINIMAL: Archetype = {
  id: "nordic-minimal",
  label: "노르딕 미니멀",
  description:
    "Skye Gyngell·Magnus Nilsson. 차가운 톤, 큰 negative space, matte cool-grey 표면, 단일 hero, 절제된 구성.",
  attribution:
    "Nordic minimalist food photography in the style of Skye Gyngell at Spring, Magnus Nilsson at Fäviken, and contemporary Scandinavian cookbook design — austere, cool-toned, with large negative space and a single hero on a clean matte surface",
  scene: `Camera: full-frame mirrorless, 50–85mm equivalent, narrow aperture (f/5.6–8) — the entire dish in sharp focus, no shallow depth-of-field, almost documentary clarity.
Angle: either perfectly 90° top-down OR very slight 15–25° tilt — disciplined, geometric, intentional.
Lighting: soft cool natural daylight at 5500–6000K, even and diffused — north-facing window on an overcast day. Minimal directional shadow, gentle even gradient.
Surface: large expanse of matte cool-grey, white-washed wood, brushed concrete, or pale linen. Significant negative space — the dish should occupy only 30–40% of the frame, the rest is the empty surface.
Vessel material: pale matte stoneware, off-white earthenware, or charcoal ceramic — single solid color, geometrically clean form. No patina, no glaze drips.
Mood: austere, considered, contemplative — the food as an object of quiet design.`,
  composition:
    "Single dish, roughly centered or placed in disciplined geometry (rule-of-thirds, symmetry, or extreme negative-space asymmetry). NO scattered props, NO casual prop arrangement. Optionally a single restrained accent — one ceramic spoon laid parallel to the dish, or a single sprig of dill — placed with intent. No hands. The negative space is part of the composition.",
  extraExclusions:
    "No hands. No abundance, no scattered herbs, no warm golden tones, no rustic patina, no chopsticks casually placed, no commercial-glossy styling.",
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
    id: KOREAN_MAGAZINE.id,
    label: KOREAN_MAGAZINE.label,
    description: KOREAN_MAGAZINE.description,
    build: (recipe) => buildArchetypePrompt(recipe, KOREAN_MAGAZINE),
  },
  {
    id: WESTERN_INFLUENCER.id,
    label: WESTERN_INFLUENCER.label,
    description: WESTERN_INFLUENCER.description,
    build: (recipe) => buildArchetypePrompt(recipe, WESTERN_INFLUENCER),
  },
  {
    id: MOODY_DARK.id,
    label: MOODY_DARK.label,
    description: MOODY_DARK.description,
    build: (recipe) => buildArchetypePrompt(recipe, MOODY_DARK),
  },
  {
    id: TOP_DOWN_FLATLAY.id,
    label: TOP_DOWN_FLATLAY.label,
    description: TOP_DOWN_FLATLAY.description,
    build: (recipe) => buildArchetypePrompt(recipe, TOP_DOWN_FLATLAY),
  },
  {
    id: ABUNDANCE_GOLDEN.id,
    label: ABUNDANCE_GOLDEN.label,
    description: ABUNDANCE_GOLDEN.description,
    build: (recipe) => buildArchetypePrompt(recipe, ABUNDANCE_GOLDEN),
  },
  {
    id: ACTION_PROCESS.id,
    label: ACTION_PROCESS.label,
    description: ACTION_PROCESS.description,
    build: (recipe) => buildArchetypePrompt(recipe, ACTION_PROCESS),
  },
  {
    id: NORDIC_MINIMAL.id,
    label: NORDIC_MINIMAL.label,
    description: NORDIC_MINIMAL.description,
    build: (recipe) => buildArchetypePrompt(recipe, NORDIC_MINIMAL),
  },
] as const;
