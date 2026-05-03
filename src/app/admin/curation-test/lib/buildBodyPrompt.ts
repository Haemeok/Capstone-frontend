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
