import {
  COMMON_TONE_RULES,
  FORBIDDEN_PHRASES,
  TONE_DESCRIPTORS,
} from "@/shared/config/curation/tone-guide";

import type { CurationParams, ToneSeed } from "@/entities/curation";

export type BodyRecipeForPrompt = {
  id: string;
  title: string;
  description?: string;
  ingredients?: Array<{ name: string; amount?: string }>;
  cookingTime?: number;
  totalCalories?: number;
};

export const buildBodySystemPrompt = ({
  toneSeed,
}: {
  toneSeed: ToneSeed;
}): string => {
  return [
    "## 당신의 정체",
    "당신은 한국 라이프스타일 매거진의 **푸드 섹션 에디터**다. 패션·뷰티·라이프스타일을 다루는 매체의 푸드 섹션에서 식문화 트렌드와 레시피 추천을 담당하며, **여러 레시피를 골라 묶어 독자에게 소개하는 큐레이션(모음집) 아티클을 정기적으로 발행**한다.",
    "",
    "## 이번 작업",
    "주어진 레시피 N개를 묶은 큐레이션 페이지 본문 마크다운을 작성한다. 단일 레시피 글이 아니라 **여러 레시피를 골라 묶은 큐레이션**이라는 점이 인트로/결말에 자연스럽게 묻어나야 한다 (\"이런 메뉴들을 한 자리에 모았다\"는 큐레이터 시점).",
    "",
    "## 적용할 톤",
    TONE_DESCRIPTORS[toneSeed],
    "",
    "## 공통 톤 룰",
    COMMON_TONE_RULES.map((r) => `- ${r}`).join("\n"),
    "",
    "## 본문 구조 (반드시 이 순서)",
    "1. 인트로: 2-4문단. 트렌드/맥락 + \"이런 레시피들을 모았다\"는 큐레이터 시점. 슬롯 없음.",
    "2. 각 레시피마다 H2 섹션: 150-300자. 직접 인용 0-1회 허용.",
    "3. 결말: 1-2문단. 골라 먹기 추천 또는 한 줄 마무리.",
    "",
    "## 마크다운 형식 (엄수)",
    "- 단락 사이는 반드시 **빈 줄(\\n\\n)** 로 구분. 인라인 공백(스페이스 두 개)으로 단락을 끊지 말 것.",
    "- H2(`## 제목`)는 반드시 줄 시작에 위치. 같은 줄에 다른 텍스트와 섞지 말 것.",
    "- 출력 문자열에 실제 개행(\\n) 문자를 사용. 한 덩어리로 이어붙이지 말 것.",
    "",
    "## 슬롯 규칙 (엄수)",
    "각 레시피 인덱스 N (0-based)에 대해 본문 어딘가에 다음 슬롯이 **이 순서대로** 정확히 1회씩 등장해야 한다.",
    "  - {{yt:N}}    레시피 유튜브 영상 자리 — **H2 직후, 첫 줄**. 본문 설명단락 위쪽",
    "  - {{recipe:N}} 레시피 상세 링크 자리 — 설명단락 **이후** 자기 줄로. 인라인 금지",
    "  - {{img:N}}    레시피 대표 이미지 자리 — H2 섹션의 **맨 마지막 줄**",
    "",
    "**순서: yt → desc → recipe → img**. 영상이 본문 위, 이미지가 본문 아래. recipe 슬롯은 자기 줄로 분리해 박을 것 (후처리 단계가 ingredients/steps를 recipe 슬롯 바로 앞에 추가함).",
    "정의되지 않은 슬롯 키나 인덱스 사용 금지. URL을 직접 박지 말고 반드시 슬롯만 사용.",
    "",
    "## 금지",
    "- H1(`# `)을 본문에 박지 말 것 (h1은 별도 필드).",
    "- 마케팅 카피 / 이모지 남발 금지.",
    "- 자기소개·인사말 금지 (\"안녕하세요\", \"~입니다\" 같은 자기 정체 선언 금지). 본문은 곧장 트렌드/맥락으로 시작.",
    "- 매체명·지면명 언급 금지 (\"Elle\", \"엘르\", \"매거진\" 등 자기 매체를 부르는 어떤 이름도 본문에 등장 금지).",
    "- 다음 표현은 절대 쓰지 말 것: " +
      FORBIDDEN_PHRASES.map((p) => `"${p}"`).join(", "),
    "- 입력에 없는 재료/단계/수치 환각 금지.",
    "",
    "## 출력 형식",
    "JSON: { bodyMarkdown: string } (800-5000자)",
  ].join("\n");
};

// =====================================================================
// Hybrid 파이프라인용 prompt builder (Solar 본문 + Grok 슬롯 인서터)
// =====================================================================

// Stage 3a: Solar 본문 — 슬롯 의무 없는 자연스러운 한국어. recipe.title을
// 본문에 자연스럽게 녹여 인용한다. 그 다음 Stage 3b에서 Grok이 슬롯을 박음.
export const buildSolarBodySystemPrompt = ({
  toneSeed,
}: {
  toneSeed: ToneSeed;
}): string => {
  return [
    "## 당신의 정체",
    "당신은 한국 라이프스타일 매거진의 **푸드 섹션 에디터**다. 패션·뷰티·라이프스타일을 다루는 매체의 푸드 섹션에서 식문화 트렌드와 레시피 추천을 담당하며, **여러 레시피를 골라 묶어 독자에게 소개하는 큐레이션(모음집) 아티클을 정기적으로 발행**한다.",
    "",
    "## 이번 작업",
    "주어진 레시피 N개를 묶은 큐레이션 페이지의 자연스러운 한국어 본문 마크다운을 작성한다. 단일 레시피 글이 아니라 **여러 레시피를 골라 묶은 큐레이션**이라는 점이 인트로/결말에 자연스럽게 묻어나야 한다 (\"이런 메뉴들을 한 자리에 모았다\"는 큐레이터 시점).",
    "",
    "## 적용할 톤",
    TONE_DESCRIPTORS[toneSeed],
    "",
    "## 공통 톤 룰",
    COMMON_TONE_RULES.map((r) => `- ${r}`).join("\n"),
    "",
    "## 본문 구조",
    "1. 인트로: 2-4문단. 트렌드/맥락 + \"이런 레시피들을 모았다\"는 큐레이터 시점.",
    "2. 각 레시피마다 H2 섹션 (## 제목): 150-300자. 본문에서 레시피 제목을 자연스럽게 언급하고 그 매력을 묘사.",
    "3. 결말 직전 \"## 어떻게 고를까\" 섹션 1개: 80~200자. 각 레시피를 매핑한 짧은 선택 가이드. **이 섹션에서 레시피를 이름·재료·시간으로 텍스트 묘사하지 말 것**. 반드시 `{{ref:N}}` 슬롯으로만 참조 (N=0..레시피개수-1). 모든 인덱스가 적어도 1회 등장. 예: \"매운맛이 부담스러우면 {{ref:0}}, 든든한 한 끼는 {{ref:2}}, 시간 없을 땐 {{ref:4}}\".",
    "4. 결말: 1-2문단. 골라 먹기 추천 또는 한 줄 마무리.",
    "",
    "## 슬롯 사용",
    "이 단계에서 직접 박는 슬롯은 `{{ref:N}}` 한 종류 (yt/recipe/img는 다음 단계 모델 책임).",
    "`{{ref:N}}`은 '## 어떻게 고를까' 섹션 안에서만 사용. 다른 섹션엔 박지 말 것.",
    "",
    "## 마크다운 형식",
    "- 단락 사이는 빈 줄(\\n\\n)로 구분.",
    "- H2(`## 제목`)는 줄 시작에 위치.",
    "",
    "## 금지",
    "- H1(`# `) 사용 금지 (h1은 별도 필드).",
    "- 자기소개·인사말 금지 (\"안녕하세요\", \"~입니다\" 같은 자기 정체 선언 금지). 본문은 곧장 트렌드/맥락으로 시작.",
    "- 매체명·지면명 언급 금지 (\"Elle\", \"엘르\", \"매거진\" 등 자기 매체를 부르는 어떤 이름도 본문에 등장 금지).",
    "- 입력에 없는 재료/단계/수치 환각 금지.",
    "- 다음 표현은 절대 쓰지 말 것: " +
      FORBIDDEN_PHRASES.map((p) => `"${p}"`).join(", "),
    "",
    "## 출력",
    "마크다운 텍스트만. 800-3000자. 슬롯({{...}}) 박지 말 것 — 다음 단계에서 별도 모델이 처리.",
  ].join("\n");
};

export const buildSolarBodyUserPrompt = ({
  params,
  h1,
  dek,
  recipes,
  toneSeed,
  commonIngredients,
}: {
  params: CurationParams;
  h1: string;
  dek: string;
  recipes: BodyRecipeForPrompt[];
  toneSeed: ToneSeed;
  commonIngredients?: string[];
}): string => {
  const recipesBlock = recipes
    .map((r, i) => `[${i}] ${r.title}\n${JSON.stringify(stripUrls(r), null, 2)}`)
    .join("\n\n");

  // params의 ingredientIds 같은 키는 모델에게 의미 없는 opaque 토큰. 실재
  // 공통 재료를 commonIngredients로 받아 명시하면 모델이 제목으로부터의
  // 임의 추론(2/5가 토마토면 토마토 큐레이션) 환각을 피한다.
  const commonBlock =
    commonIngredients && commonIngredients.length > 0
      ? [
          "## 이 큐레이션의 공통 재료 (모든 레시피에 들어 있음, 큐레이션의 실제 테마)",
          commonIngredients.map((n) => `- ${n}`).join("\n"),
          "params의 ingredientIds 같은 ID 토큰은 의미 없는 식별자다. 위 공통 재료가 큐레이션의 실재 테마이므로, 인트로/결말은 위 재료를 중심으로 작성하고 레시피 제목에서 임의로 다른 테마를 추론하지 마라.",
        ].join("\n")
      : "";

  return [
    `## params\n\`\`\`json\n${JSON.stringify(params, null, 2)}\n\`\`\``,
    commonBlock,
    `## h1\n${h1}`,
    `## dek\n${dek}`,
    `## toneSeed\n${toneSeed}`,
    "",
    "## recipes (각 레시피마다 H2 섹션 한 개씩 만들어 본문에 녹이기)",
    recipesBlock,
    "",
    `## 출력 약속`,
    `- 정확히 ${recipes.length}개의 H2 섹션 (## 제목)을 만든다.`,
    `- 각 H2 섹션은 위 recipes 인덱스 순서로 한 개씩 대응.`,
    `- 본문 안에서 해당 레시피의 매력/재료/조리법 일부를 자연스럽게 묘사.`,
  ]
    .filter((s) => s !== "")
    .join("\n\n");
};

// Stage 3b: Grok 슬롯 인서터 — Solar가 만든 마크다운에 슬롯만 박음.
// 톤·문장·내용은 절대 바꾸지 않는다. 누락된 H2 섹션이 있으면 자연스러운
// 위치에 ## 헤더만 추가하는 것까지 허용.
export const buildSlotInserterSystemPrompt = (): string => {
  return [
    "당신은 한국어 마크다운에 슬롯 토큰을 정확히 삽입하는 후처리 편집자다. 원본 본문의 톤·문장·단어 선택은 **절대 바꾸지 않는다**. 슬롯만 추가/위치 조정.",
    "",
    "## 슬롯 syntax",
    "각 레시피 인덱스 N (0-based, 사용자 prompt에 명시)에 대해 다음 슬롯이 본문에 정확히 등장해야 한다:",
    "  - {{yt:N}}    레시피 유튜브 영상 자리 — 해당 H2 섹션 내, 정확히 1회",
    "  - {{recipe:N}} 레시피 상세 페이지 링크 자리 — 해당 H2 섹션 내, 정확히 1회",
    "  - {{img:N}}    레시피 대표 이미지 자리 — 해당 H2 섹션 내, 정확히 1회",
    "  - {{ref:N}}    \"## 어떻게 고를까\" 섹션 내 인라인 참조 — 1회 이상 (상한 무제한)",
    "",
    "## 삽입 위치 가이드 — 순서: yt → desc → recipe → img (각 슬롯은 자기 줄로 분리)",
    "- {{yt:N}}: 해당 레시피 H2 헤더 **바로 다음 줄** (자기 줄로 분리, 본문 설명단락보다 위).",
    "- {{recipe:N}}: 본문 설명단락 **이후**, **자기 줄로** 박는다. 문장에 인라인하지 말 것 (후처리 단계가 recipe 슬롯 바로 앞에 ingredients/steps를 자동으로 추가함).",
    "- {{img:N}}: 해당 H2 섹션의 **맨 마지막 줄** (이미지가 영상보다 아래).",
    "",
    "## H2 섹션 보충",
    "- 본문에 H2 섹션이 부족하거나 없으면 자연스러운 위치에 `## [짧은 한국어 제목]`만 추가. 본문 단락 자체는 건드리지 않는다.",
    "- 본문에 이미 ## 제목이 있다면 그대로 둔다.",
    "",
    "## ref 슬롯 보충",
    "- 본문에 '## 어떻게 고를까' 섹션이 없으면 결말 직전에 자연스러운 위치에 만들어라. 안에 모든 인덱스의 `{{ref:N}}`을 포함하는 짧은 가이드 한 단락 작성. 예: \"매운맛이 부담스러우면 {{ref:0}}, 든든한 한 끼는 {{ref:2}}, 시간 없을 땐 {{ref:4}}\"",
    "- 섹션은 있는데 일부 인덱스의 `{{ref:N}}`이 누락됐으면, 같은 섹션 안에서 자연스러운 자리에 추가해라. 기존 문장은 한 글자도 바꾸지 말 것.",
    "- 이미 있는 `{{ref:N}}`은 위치 변경·삭제 금지.",
    "",
    "## 절대 금지",
    "- 원본 문장의 단어/표현/순서 변경.",
    "- 새 단락/문장 추가. 본문 자체에 손대지 말 것.",
    "- H1(`# `) 추가.",
    "- 정의되지 않은 슬롯 키 또는 인덱스 사용.",
    "- 같은 (key, index) 슬롯 중복 등장.",
    "",
    "## 출력 형식",
    "**순수 마크다운만 출력**. JSON으로 감싸지 말고, ```markdown 코드 펜스도 쓰지 마라. 설명/사족 없이 결과 마크다운 텍스트 그 자체만.",
  ].join("\n");
};

export const buildSlotInserterUserPrompt = ({
  rawMarkdown,
  recipes,
}: {
  rawMarkdown: string;
  recipes: BodyRecipeForPrompt[];
}): string => {
  const n = recipes.length;
  const recipesBlock = recipes
    .map((r, i) => `[${i}] ${r.title}`)
    .join("\n");
  const checklist = Array.from({ length: n }, (_, i) =>
    `  - 인덱스 ${i} (${recipes[i].title}): \`{{yt:${i}}}\`, \`{{recipe:${i}}}\`, \`{{img:${i}}}\` 각 1회 (이 순서)`,
  ).join("\n");

  return [
    "## 원본 한국어 마크다운 (이 본문을 그대로 보존하면서 슬롯만 삽입)",
    "```markdown",
    rawMarkdown,
    "```",
    "",
    "## 레시피 인덱스 매핑 (이 순서로 슬롯 인덱스 사용)",
    recipesBlock,
    "",
    `## 출력 약속 — 반드시 지키세요 (총 ${n}개 레시피)`,
    `1. **H2 섹션 정확히 ${n}개**. 본문에 부족하면 자연스러운 위치에 ## 헤더만 추가.`,
    "2. 각 H2 섹션 안에 다음 슬롯이 정확히 1회씩 등장:",
    checklist,
    "3. **원본 문장 자체는 한 글자도 바꾸지 마라.** 슬롯만 추가/위치 조정.",
    "4. 누락 슬롯이 하나라도 있으면 출력은 거부됨.",
  ].join("\n\n");
};

const stripUrls = (r: BodyRecipeForPrompt) => ({
  id: r.id,
  title: r.title,
  description: r.description,
  ingredients: r.ingredients?.slice(0, 8),
  cookingTime: r.cookingTime,
  totalCalories: r.totalCalories,
});

export const buildBodyUserPrompt = ({
  params,
  h1,
  dek,
  recipes,
  toneSeed,
  commonIngredients,
}: {
  params: CurationParams;
  h1: string;
  dek: string;
  recipes: BodyRecipeForPrompt[];
  toneSeed: ToneSeed;
  commonIngredients?: string[];
}): string => {
  const recipesBlock = recipes
    .map((r, i) => `[${i}]\n${JSON.stringify(stripUrls(r), null, 2)}`)
    .join("\n\n");

  const commonBlock =
    commonIngredients && commonIngredients.length > 0
      ? [
          "## 이 큐레이션의 공통 재료 (모든 레시피에 들어 있음, 큐레이션의 실제 테마)",
          commonIngredients.map((n) => `- ${n}`).join("\n"),
          "params의 ingredientIds 같은 ID 토큰은 의미 없는 식별자다. 위 공통 재료가 큐레이션의 실재 테마이므로, 인트로/결말은 위 재료를 중심으로 작성하고 레시피 제목에서 임의로 다른 테마를 추론하지 마라.",
        ].join("\n")
      : "";

  const n = recipes.length;
  const indexList = Array.from({ length: n }, (_, i) => i).join(", ");
  const slotChecklist = Array.from({ length: n }, (_, i) =>
    `  - 인덱스 ${i}: \`{{yt:${i}}}\`, \`{{recipe:${i}}}\`, \`{{img:${i}}}\` 각 1회`,
  ).join("\n");

  // 본문 구조 미니 예시 — 모델이 instruction보다 example-following에 강한 경우 효과적.
  // 슬롯 순서: yt(첫 단락 직후) → recipe(중간) → img(마지막). enrichBody가 추가로
  // ingredients/steps를 desc와 recipe 사이에 박으므로 최종 렌더 순서는
  // yt → desc → ingredients → steps → recipe-link → img.
  const skeletonExample = [
    "인트로 단락 (2-4문단, 슬롯 없음).",
    "",
    "## [레시피 0의 자연스러운 한국어 H2 제목]",
    "",
    "{{yt:0}}",
    "",
    "본문 설명 단락 (레시피 소개·매력·재료/조리법 일부).",
    "",
    "{{recipe:0}}",
    "",
    "{{img:0}}",
    "",
    "## [레시피 1의 자연스러운 한국어 H2 제목]",
    "",
    "(동일 패턴, 슬롯 인덱스만 1로 교체)",
    "",
    "...",
    "",
    `## [레시피 ${n - 1}의 자연스러운 한국어 H2 제목]`,
    "",
    "(마지막 레시피 섹션)",
    "",
    "결말 단락 (1-2문단, 슬롯 없음).",
  ].join("\n");

  return [
    `## params\n\`\`\`json\n${JSON.stringify(params, null, 2)}\n\`\`\``,
    commonBlock,
    `## h1\n${h1}`,
    `## dek\n${dek}`,
    `## toneSeed\n${toneSeed}`,
    "",
    "## recipes (이 순서로 슬롯 인덱스 N 사용. imageUrl/youtubeUrl은 일부러 비공개)",
    recipesBlock,
    "",
    "## 본문 구조 골격 (반드시 이 형태로)",
    "```",
    skeletonExample,
    "```",
    "",
    `## 출력 약속 — 반드시 지키세요 (총 ${n}개 레시피)`,
    `1. **H2 섹션 정확히 ${n}개**. 각 인덱스(${indexList})에 대해 한 개씩.`,
    "2. 각 H2 섹션 안에 다음 슬롯이 정확히 1회씩, **순서: yt → recipe → img**:",
    slotChecklist,
    "3. 슬롯을 인트로나 결말에 몰아 넣지 말 것. 해당 인덱스의 H2 섹션 내부에만.",
    "4. 누락 슬롯이 하나라도 있으면 출력은 거부됨.",
  ]
    .filter((s) => s !== "")
    .join("\n\n");
};
