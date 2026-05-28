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
    "## 본문 구조 (반드시 이 순서)",
    "1. 인트로: 2-4문단. 트렌드/맥락 + \"이런 레시피들을 모았다\"는 큐레이터 시점. 슬롯 없음. 개별 레시피에 대한 설명도 포함. — 단 H2에서 반드시 더 깊이(다른 각도·구체) 다시 풀 것. 인트로는 미리보기, H2는 본론.",
    "2. 각 레시피마다 H2 섹션: 250~400자. 인트로에서 이미 짧게 언급했더라도 여기서는 반드시 한 단계 더 들어간다 — (a) 매력 포인트 한 줄(왜 이 레시피인가), (b) 핵심 재료·조리 포인트 1~2개를 구체적으로(이름·기법·시간 등 실제 수치 포함, 단 입력에 없는 수치 금지), (c) 어떤 상황·취향·재료 사정에 어울리는지 한 줄. 직접 인용 0~1회 허용. **150자대 빈약한 단락 금지** — 인트로의 한 줄 소개를 그대로 복붙하는 것도 금지.",
    "3. 결말 직전 \"## 어떻게 고를까\" 섹션 1개: 80~200자. 각 레시피를 매핑한 짧은 선택 가이드. **이 섹션에서 레시피를 이름·재료·시간으로 텍스트 묘사하지 말 것**. 반드시 `{{ref:N}}` 슬롯으로만 참조 (N=0..레시피개수-1). 모든 인덱스가 적어도 1회 등장. 예: \"매운맛이 부담스러우면 {{ref:0}}, 든든한 한 끼는 {{ref:2}}, 시간 없을 땐 {{ref:4}}\".",
    "4. 결말: 1~2문단. 큐레이션 전체를 묶는 한 줄 마무리(가벼운 권유나 요리 후기 톤).",
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
    "마크다운 텍스트만. 1500-4500자. 슬롯({{...}}) 박지 말 것 — 다음 단계에서 별도 모델이 처리.",
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

