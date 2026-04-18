export type PromptIngredient = { name: string };

export type PromptStep = {
  stepNumber: number;
  action?: string;
  instruction: string;
};

export type PromptRecipeComponent = {
  role: string;
  name?: string;
  description?: string;
};

export type PromptFineDining = {
  components?: PromptRecipeComponent[];
  plating?: { vessel?: string; guide?: string };
};

export type PromptInput = {
  title: string;
  description?: string;
  dishType?: string;
  ingredients?: PromptIngredient[];
  steps?: PromptStep[];
  fineDiningInfo?: PromptFineDining;
};

const LIGHTING_OPTIONS = [
  "Natural morning sunlight streaming through a kitchen window (Bright & Fresh)",
  "Warm cozy indoor kitchen lighting at dinner time (Homey & Inviting)",
  "Slightly direct overhead kitchen light (Realistic & Vivid)",
  "Soft afternoon daylight from the side (Natural & Airy)",
];

const ANGLE_OPTIONS = [
  "High-angle POV shot (Point of View) looking down at the table as if ready to eat",
  "Casual top-down flat lay shot for Instagram",
  "Slightly tilted close-up shot focusing on the delicious texture",
  "Hand-held camera angle, slightly imperfect but authentic composition",
];

const BACKGROUND_OPTIONS = [
  "Clean white marble table with soft natural texture (Modern & Chic)",
  "Warm light beige linen tablecloth (Cozy & Homey)",
  "Rustic dark wooden table with rich grain (Vintage & Mood)",
  "Bright white wooden table surface (Clean & Minimalist)",
];

const CUTLERY_YES =
  "**Analyze the dish type.** If Asian/Korean, place wooden chopsticks and a spoon. If Western, place a fork and knife. If Finger Food(Pizza), NO cutlery. Cutlery must be plain and unbranded: no engraving, no logo, no text.";

const CUTLERY_NO =
  "**NO CUTLERY.** Do NOT place any spoon, fork, chopsticks, or knife. Keep the composition clean and minimal. Focus strictly on the food.";

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

const translateIngredientName = (name: string): string => {
  if (name.includes("매생이")) return "fine silky green seaweed (Maesaengi)";
  if (name.includes("순대")) return "Korean blood sausage (Sundae)";
  if (name.includes("떡")) return "chewy rice cakes";
  return name;
};

const DEFAULT_TEMPLATE = `**[Subject]**
A realistic, high-quality food photo of "{{TITLE}}", taken with an iPhone 15 Pro Max.
Category: {{DISH_TYPE}}.

**[Cooking Analysis for Visualization]**
**Based on the following cooking steps, infer the final look of the dish:**
{{STEPS}}

**[Visual Contents]**
- **Key Ingredients:** {{INGREDIENTS}}.
- **Overall Vibe:** Neat and appetizing plating, bright and fresh atmosphere. Focus strictly on the main food.

**[Smart Filtering & Preparation Rules]**
1. **Filter & Color:** Do NOT visualize water/salt/sugar/MSG separately. Use sauces (Soy, Chili, etc.) to determine color tone.
2. **Cooked State:** All ingredients must appear fully cooked and integrated.
3. **Ingredient Identity:** Main ingredients must retain their natural texture.

**[Composition & Styling]**
- **Angle:** {{ANGLE}}.
- **Lighting:** {{LIGHTING}}.
- **Background:** {{BACKGROUND}}. **Simple cutlery (spoon, chopsticks) placed neatly next to the plate is allowed.** NO clutter, NO side dishes, NO extra bowls.

**[Cutlery Rule]**
{{CUTLERY_RULE}}

**[Visual Details (AI Inference)]**
- **Plating & Vessel:** **Select the most appropriate tableware that perfectly matches the cuisine type and the title.**
  **ALL tableware must be completely plain and unbranded:** no maker’s mark, no stamp/seal, no logo, no engraving, no embossed marks, no calligraphy, no patterns. Use solid-color blank surfaces only.
  **Served on a SINGLE plate/bowl.**
- **Texture:** Render the food texture realistically based on the cooking method. Enhance the glistening details of oils, sauces, or moisture to make it look freshly cooked and steaming hot.

**[Technical Quality]**
- Shot on iPhone 15 Pro Max, social media aesthetic, Instagram food porn style, sharp focus on food, natural depth of field, vivid colors.

**[ABSOLUTE NO-TEXT RULE]**
- The image must contain ZERO text of any kind.
- No Hangul/Korean, no English, no numbers, no symbols, no captions, no typography.
- No logos, no brands, no labels, no packaging, no stamps, no engraved markings on plates/cutlery.
- No printed patterns on tablecloth/placemats/napkins that resemble letters.
- If any text would appear, remove it completely and leave the surface blank.

**[Negative Prompts]**
--no people, --no hands, --no arms,
--no text, --no watermark, --no caption,
--no logo, --no brand, --no label, --no packaging,
--no maker mark, --no seal, --no stamp, --no engraving, --no embossed, --no calligraphy, --no patterns,
--no side dishes, --no banchan, --no extra bowls, --no clutter,
--no plastic look, --no blurry, --no distorted, --no cropped plate,
--no alcohol, --no beverage, --no soju glass,
--no crumbs, --no messy spills, --no food splatter, --no powdery seasoning piles`;

const FINE_DINING_TEMPLATE = `High-end fine dining food photography. Close-up shot, Michelin star style plating.

**[Dish Info]**
Title: {{TITLE}}
Concept Description: {{DESCRIPTION}}

**[Plating Details]**
Vessel Type: {{VESSEL}}
Plating Instructions: {{GUIDE}}
Visual Key Points: {{VISUAL_KEYS}}

**[Camera & Lighting]**
Viewpoint: {{VIEWPOINT}}
Lighting: {{LIGHTING}}

**[Technical Specs]**
Shot on 100mm macro lens, f/2.8 aperture, shallow depth of field, 8k resolution, ultra-realistic, highly detailed texture.
--no cutlery, no text, no messy background, no distorted food`;

const buildFineDiningPrompt = (input: PromptInput): string => {
  const fd = input.fineDiningInfo ?? {};
  const plating = fd.plating ?? {};
  const visualKeys = (fd.components ?? [])
    .map((c) => [c.role, c.name, c.description].filter(Boolean).join(": "))
    .filter((s) => s.length > 0)
    .join(", ");

  return FINE_DINING_TEMPLATE.replace("{{TITLE}}", input.title)
    .replace("{{DESCRIPTION}}", input.description ?? "")
    .replace("{{VESSEL}}", plating.vessel || "Elegant plate")
    .replace("{{GUIDE}}", plating.guide ?? "")
    .replace("{{VISUAL_KEYS}}", visualKeys)
    .replace("{{VIEWPOINT}}", "45-degree angle")
    .replace("{{LIGHTING}}", "Professional studio lighting");
};

const buildDefaultPrompt = (input: PromptInput): string => {
  const ingredientsList = (input.ingredients ?? [])
    .map((i) => translateIngredientName(i.name))
    .filter((n) => n.length > 0)
    .join(", ");
  const ingredients = ingredientsList || input.title;

  const steps = (input.steps ?? [])
    .slice()
    .sort((a, b) => a.stepNumber - b.stepNumber)
    .map((s) => `- Step ${s.stepNumber} (${s.action ?? ""}): ${s.instruction}`)
    .join("\n");

  const showCutlery = Math.random() < 0.5;

  return DEFAULT_TEMPLATE.replace("{{TITLE}}", input.title)
    .replace("{{DISH_TYPE}}", input.dishType ?? "Dish")
    .replace("{{INGREDIENTS}}", ingredients)
    .replace("{{STEPS}}", steps || "Cook seamlessly.")
    .replace("{{ANGLE}}", pick(ANGLE_OPTIONS))
    .replace("{{LIGHTING}}", pick(LIGHTING_OPTIONS))
    .replace("{{BACKGROUND}}", pick(BACKGROUND_OPTIONS))
    .replace("{{CUTLERY_RULE}}", showCutlery ? CUTLERY_YES : CUTLERY_NO)
    .replace("{{DESCRIPTION}}", input.description ?? "");
};

export const buildPrompt = (input: PromptInput): string => {
  if (input.fineDiningInfo) {
    return buildFineDiningPrompt(input);
  }
  return buildDefaultPrompt(input);
};
