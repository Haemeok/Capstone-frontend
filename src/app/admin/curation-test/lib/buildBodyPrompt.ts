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
    "당신은 한국 푸드 매거진 에디터다. 입력으로 주어진 레시피 N개를 묶어 Elle Korea 톤의 큐레이션 본문 마크다운을 작성한다.",
    "",
    "## 적용할 톤",
    TONE_DESCRIPTORS[toneSeed],
    "",
    "## 공통 톤 룰",
    COMMON_TONE_RULES.map((r) => `- ${r}`).join("\n"),
    "",
    "## 본문 구조 (반드시 이 순서)",
    "1. 인트로: 2-4문단. 트렌드/맥락 제시. 슬롯 없음.",
    "2. 각 레시피마다 H2 섹션: 150-300자. 직접 인용 0-1회 허용.",
    "3. 결말: 1-2문단.",
    "",
    "## 마크다운 형식 (엄수)",
    "- 단락 사이는 반드시 **빈 줄(\\n\\n)** 로 구분. 인라인 공백(스페이스 두 개)으로 단락을 끊지 말 것.",
    "- H2(`## 제목`)는 반드시 줄 시작에 위치. 같은 줄에 다른 텍스트와 섞지 말 것.",
    "- 출력 문자열에 실제 개행(\\n) 문자를 사용. 한 덩어리로 이어붙이지 말 것.",
    "",
    "## 슬롯 규칙 (엄수)",
    "각 레시피 인덱스 N (0-based)에 대해 본문 어딘가에 다음 슬롯이 정확히 1회씩 등장해야 한다.",
    "  - {{img:N}}    레시피 대표 이미지 자리",
    "  - {{recipe:N}} 레시피 상세 페이지로 가는 링크 자리. 자연스러운 문장 끝에 \"추천 →\" 같은 표현으로 박는다.",
    "  - {{yt:N}}    레시피 유튜브 영상 자리",
    "",
    "정의되지 않은 슬롯 키나 인덱스 사용 금지. URL을 직접 박지 말고 반드시 슬롯만 사용.",
    "",
    "## 금지",
    "- H1(`# `)을 본문에 박지 말 것 (h1은 별도 필드).",
    "- 마케팅 카피 / 이모지 남발 금지.",
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
    "당신은 한국 푸드 매거진 에디터다. 입력으로 주어진 레시피 N개를 묶어 Elle Korea 톤의 자연스러운 한국어 큐레이션 본문 마크다운을 작성한다.",
    "",
    "## 적용할 톤",
    TONE_DESCRIPTORS[toneSeed],
    "",
    "## 공통 톤 룰",
    COMMON_TONE_RULES.map((r) => `- ${r}`).join("\n"),
    "",
    "## 본문 구조",
    "1. 인트로: 2-4문단. 트렌드/맥락 제시.",
    "2. 각 레시피마다 H2 섹션 (## 제목): 150-300자. 본문에서 레시피 제목을 자연스럽게 언급하고 그 매력을 묘사.",
    "3. 결말: 1-2문단.",
    "",
    "## 마크다운 형식",
    "- 단락 사이는 빈 줄(\\n\\n)로 구분.",
    "- H2(`## 제목`)는 줄 시작에 위치.",
    "",
    "## 금지",
    "- H1(`# `) 사용 금지 (h1은 별도 필드).",
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
}: {
  params: CurationParams;
  h1: string;
  dek: string;
  recipes: BodyRecipeForPrompt[];
  toneSeed: ToneSeed;
}): string => {
  const recipesBlock = recipes
    .map((r, i) => `[${i}] ${r.title}\n${JSON.stringify(stripUrls(r), null, 2)}`)
    .join("\n\n");

  return [
    `## params\n\`\`\`json\n${JSON.stringify(params, null, 2)}\n\`\`\``,
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
  ].join("\n\n");
};

// Stage 3b: Grok 슬롯 인서터 — Solar가 만든 마크다운에 슬롯만 박음.
// 톤·문장·내용은 절대 바꾸지 않는다. 누락된 H2 섹션이 있으면 자연스러운
// 위치에 ## 헤더만 추가하는 것까지 허용.
export const buildSlotInserterSystemPrompt = (): string => {
  return [
    "당신은 한국어 마크다운에 슬롯 토큰을 정확히 삽입하는 후처리 편집자다. 원본 본문의 톤·문장·단어 선택은 **절대 바꾸지 않는다**. 슬롯만 추가/위치 조정.",
    "",
    "## 슬롯 syntax",
    "각 레시피 인덱스 N (0-based, 사용자 prompt에 명시)에 대해 다음 슬롯이 본문에 정확히 1회씩 등장해야 한다:",
    "  - {{img:N}}    레시피 대표 이미지 자리",
    "  - {{recipe:N}} 레시피 상세 페이지 링크 자리",
    "  - {{yt:N}}    레시피 유튜브 영상 자리",
    "",
    "## 삽입 위치 가이드",
    "- {{img:N}}: 해당 레시피 H2 섹션의 첫 단락 직전 또는 직후.",
    "- {{recipe:N}}: 해당 H2 섹션 본문에서 레시피를 권유하는 자연스러운 문장 끝 (\"추천해요\", \"보러 가기\" 등 표현 직전 또는 자리).",
    "- {{yt:N}}: 해당 H2 섹션의 마지막 단락 끝.",
    "",
    "## H2 섹션 보충",
    "- 본문에 H2 섹션이 부족하거나 없으면 자연스러운 위치에 `## [짧은 한국어 제목]`만 추가. 본문 단락 자체는 건드리지 않는다.",
    "- 본문에 이미 ## 제목이 있다면 그대로 둔다.",
    "",
    "## 절대 금지",
    "- 원본 문장의 단어/표현/순서 변경.",
    "- 새 단락/문장 추가. 본문 자체에 손대지 말 것.",
    "- H1(`# `) 추가.",
    "- 정의되지 않은 슬롯 키 또는 인덱스 사용.",
    "- 같은 (key, index) 슬롯 중복 등장.",
    "",
    "## 출력 형식",
    "JSON: { bodyMarkdown: string }",
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
    `  - 인덱스 ${i} (${recipes[i].title}): \`{{img:${i}}}\`, \`{{recipe:${i}}}\`, \`{{yt:${i}}}\` 각 1회`,
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
}: {
  params: CurationParams;
  h1: string;
  dek: string;
  recipes: BodyRecipeForPrompt[];
  toneSeed: ToneSeed;
}): string => {
  const recipesBlock = recipes
    .map((r, i) => `[${i}]\n${JSON.stringify(stripUrls(r), null, 2)}`)
    .join("\n\n");

  const n = recipes.length;
  const indexList = Array.from({ length: n }, (_, i) => i).join(", ");
  const slotChecklist = Array.from({ length: n }, (_, i) =>
    `  - 인덱스 ${i}: \`{{img:${i}}}\`, \`{{recipe:${i}}}\`, \`{{yt:${i}}}\` 각 1회`,
  ).join("\n");

  // 본문 구조 미니 예시 — 모델이 instruction보다 example-following에 강한 경우 효과적
  const skeletonExample = [
    "인트로 단락 (2-4문단, 슬롯 없음).",
    "",
    "## [레시피 0의 자연스러운 한국어 H2 제목]",
    "",
    "본문 단락. {{img:0}}",
    "",
    "레시피 소개 단락. {{recipe:0}} 추천해요.",
    "",
    "마지막 문단. {{yt:0}}",
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
    "2. 각 H2 섹션 안에 다음 슬롯이 정확히 1회씩 등장:",
    slotChecklist,
    "3. 슬롯을 인트로나 결말에 몰아 넣지 말 것. 해당 인덱스의 H2 섹션 내부에만.",
    "4. 누락 슬롯이 하나라도 있으면 출력은 거부됨.",
  ].join("\n\n");
};
