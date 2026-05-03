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

  return [
    `## params\n\`\`\`json\n${JSON.stringify(params, null, 2)}\n\`\`\``,
    `## h1\n${h1}`,
    `## dek\n${dek}`,
    `## toneSeed\n${toneSeed}`,
    "",
    "## recipes (이 순서로 슬롯 인덱스 N 사용. imageUrl/youtubeUrl은 일부러 비공개)",
    recipesBlock,
  ].join("\n\n");
};
