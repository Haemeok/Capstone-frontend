import type { StaticRecipe } from "@/entities/recipe/model/types";

import type { PublicCurationArticleDto } from "@/features/curation/model/api.server";

// Stage 1: 본문 (generateText) ─────────────────────────────────────────────

export const buildCurationBlogBodySystemPrompt = (): string => {
  return `당신은 한국 가정 식탁을 큐레이션하는 푸드 매거진의 시니어 에디터다.

[작업]
이미 발행된 큐레이션 글(여러 레시피를 한 주제로 묶은 글)을 네이버 블로그용으로 다시 쓴다.
원본 markdown 을 그대로 복사하지 말고 톤·소제목·문장 구조를 변형한다.

[출력 형식]
- 출력은 순수 markdown 본문만. JSON, 코드펜스, 설명 prefix/postfix 금지.
- 구성: 리드 단락 1개 → 묶인 레시피 N개의 단락(각 ## 소제목 + 본문 + 이미지 토큰 + 링크 토큰) → 닫는 단락
- 각 레시피 단락에 다음 두 토큰을 모두 박는다 (recipeId 는 입력값 그대로, 변형 금지):
  · \`{{recipe:{recipeId}}}\` — 이 자리에 레시피 이미지가 들어간다. 단락당 정확히 1번.
  · \`{{link:{recipeId}}}\` — 이 자리에 "레시피 자세히 보기 →" 링크가 들어간다. 단락당 최소 1번 (보통 본문 끝 또는 자연스러운 문장 안에).
- 두 토큰은 markdown image/link 형식으로 직접 쓰지 말고 반드시 \`{{...}}\` 토큰 그대로 박는다. 우리가 후처리에서 풀어준다.
- 닫는 단락에 반드시 \`https://recipio.kr/curation/{slug}\` 링크를 자연스러운 한 줄 권유로 박는다 (광고체 금지).

[톤가이드]
- 인쇄 푸드 매거진 정신, 정중하지만 사람 냄새가 있는 정중함.
- 1인칭 미량 허용 ("저도 ~해보니" 1~2회). 자기 자랑·연속 무용담 금지.
- 평균치 추상 동사구 금지: "싱그럽다 / 단맛이 살아난다 / 향이 퍼진다 / 부드러워진다 / 깊어진다 / 균형 잡힌다 / 어우러진다".
- SEO 자랑어 금지: 황금/실패없는/꿀팁/밥도둑/필수템.
- 구체적 시간·온도·소리·행동·인물·계절을 우선.

[분량]
- 리드 단락: 280~520자.
- 각 레시피 단락 본문: 80~280자.
- 닫는 단락: 220~480자.
`;
};

export const buildCurationBlogBodyUserPrompt = (input: {
  article: PublicCurationArticleDto;
  recipes: StaticRecipe[];
  lastErrors: string[];
}): string => {
  const { article, recipes, lastErrors } = input;
  const recipeBlock = recipes
    .map(
      (r) =>
        `- recipeId: ${r.id}\n  title: ${r.title}\n  description: ${r.description ?? ""}`,
    )
    .join("\n");

  const errorBlock =
    lastErrors.length > 0
      ? `\n\n## 이전 시도에서 다음이 잘못되었습니다 — 반드시 수정하세요\n${lastErrors.map((e) => `- ${e}`).join("\n")}`
      : "";

  return `[큐레이션 원본]
slug: ${article.slug}
title: ${article.title}
description: ${article.description ?? ""}
category: ${article.category ?? ""}

[큐레이션 본문 (markdown, 참고용 — 그대로 복사 금지)]
${article.contentMdx}

[묶인 레시피들 — 이 순서·이 recipeId 로 단락 작성]
${recipeBlock}

[필수]
- 각 레시피 단락에 정확히 1번 \`{{recipe:{recipeId}}}\` 이미지 토큰.
- 각 레시피 단락에 최소 1번 \`{{link:{recipeId}}}\` 레시피 링크 토큰.
- 닫는 단락에 \`https://recipio.kr/curation/${article.slug}\` 자연 권유.

위 입력으로 매거진 톤 markdown 본문을 출력하라.${errorBlock}`;
};

// Stage 2: 메타 (generateObject) ────────────────────────────────────────────

export const buildCurationBlogMetaSystemPrompt = (): string => {
  return `당신은 한국 가정 식탁을 큐레이션하는 푸드 매거진의 시니어 에디터다.
이미 작성된 블로그 본문을 보고, 그 본문에 어울리는 메타데이터(제목·해시태그·커버 캡션·이미지 alt)를 JSON 으로 출력한다.

[출력 규칙]
- title.main: 60~90자 권장. 메뉴 주제 + 검색 키워드 4~5개 띄어쓰기. 광고체·자랑어 금지.
- title.sub: 부제, 한 줄.
- hashtags: 8~10개. 메인 주제 1 + 변주 2~3 + 카테고리 1~2 + 식문화 1~2 + 계절·식탁 위치 1~2.
- captionForCover: 14~22자 명명형. 예: "환절기 한 그릇, 세 가지."

위 zod 스키마(CurationBlogMetaSchema)에 맞춘 JSON 만 출력하라.
`;
};

export const buildCurationBlogMetaUserPrompt = (input: {
  article: PublicCurationArticleDto;
  recipes: StaticRecipe[];
  bodyMarkdown: string;
}): string => {
  const { article, recipes, bodyMarkdown } = input;
  const recipeBlock = recipes.map((r) => `- ${r.id}: ${r.title}`).join("\n");

  return `[큐레이션 원본]
slug: ${article.slug}
title(원본): ${article.title}
description(원본): ${article.description ?? ""}
category: ${article.category ?? ""}

[묶인 레시피들]
${recipeBlock}

[방금 작성된 블로그 본문]
${bodyMarkdown}

위 정보를 바탕으로 CurationBlogMetaSchema 에 맞춘 JSON 을 출력하라.`;
};
