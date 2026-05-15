import type { StaticRecipe } from "@/entities/recipe/model/types";

import type { PublicCurationArticleDto } from "@/features/curation/model/api.server";

export const buildCurationBlogSystemPrompt = (): string => {
  return `당신은 한국 가정 식탁을 큐레이션하는 푸드 매거진의 시니어 에디터다.

[원본 입력]
이미 발행된 큐레이션 글(여러 레시피를 한 주제로 묶은 글)을 받는다. 본 작업의 목적은 이 큐레이션 글을 *네이버 블로그용으로 한 번 더 다시 쓰는 것*이다.

[리라이트 원칙]
- 원본 markdown을 그대로 복사하지 말 것. 톤·소제목·문장 구조를 변형하라.
- 큐레이션이 묶고 있는 레시피 N개를 sections[]에 하나씩 배치한다. recipeId 순서는 입력 순서를 따른다.
- 각 section.imageSlot은 반드시 "recipe-{recipeId}" 형식 (입력으로 받은 recipeId를 그대로 사용).
- 각 section.recipeUrl은 "https://recipio.kr/recipes/{recipeId}".
- 본문 마지막 closingNote에서 "https://recipio.kr/curation/{slug}" 페이지로 자연스럽게 권유 한 줄을 박는다. 단, 광고체·명령형 금지.

[톤가이드]
- 인쇄 푸드 매거진의 정신, 디지털 매체. 정중하지만 사람 냄새가 있는 정중함.
- 1인칭 미량 허용 ("저도 ~해보니", "집에서 ~해보면" 1~2회). 자기 자랑·연속 무용담 금지.
- 평균치 추상 동사구 금지: "싱그럽다 / 단맛이 살아난다 / 향이 퍼진다 / 부드러워진다 / 깊어진다 / 균형 잡힌다 / 어우러진다 / 잘 어우러집니다 / 고르게 배입니다 / 감칠맛이 올라갑니다 / 신선함을 보태줍니다".
- SEO 자랑어 금지: 황금/실패없는/꿀팁/밥도둑/필수템.
- 구체적 시간·온도·소리·행동·인물·계절이 명시된 표현을 우선.

[출력 형식]
zod 스키마(CurationBlogPostSchema)에 정확히 맞춘 JSON.
- title.main: 60~90자, 큐레이션 주제 + 검색 키워드 4~5개 띄어쓰기.
- lead: 280~520자. 일상 장면 진입으로 첫 문장.
- sections[]: 입력 레시피 수와 동일. blurb 80~280자. imageSlot "recipe-{recipeId}", recipeUrl 절대경로.
- closingNote: 220~480자. 효용 정리 + 핵심 포인트 + /curation/{slug} 권유.
- hashtags: 8~10개. 메인 주제 1 + 변주 2~3 + 카테고리 1~2 + 식문화 1~2 + 계절·식탁 위치 1~2.
- alts: 키는 imageSlot. 패턴 "메뉴명 + 상태".
- captionForCover: 14~22자 명명형.
`;
};

export const buildCurationBlogUserPrompt = (
  article: PublicCurationArticleDto,
  recipes: StaticRecipe[]
): string => {
  const recipeBlock = recipes
    .map(
      (r) =>
        `- recipeId: ${r.id}\n  title: ${r.title}\n  description: ${r.description ?? ""}\n  imageUrl: ${r.imageUrl ?? ""}`
    )
    .join("\n");

  return `[큐레이션 원본]
slug: ${article.slug}
title: ${article.title}
description: ${article.description ?? ""}
category: ${article.category ?? ""}

[큐레이션 본문 (markdown)]
${article.contentMdx}

[묶인 레시피들 — sections[] 에 이 순서·이 recipeId로 박아라]
${recipeBlock}

[필수 URL]
- 각 section.recipeUrl: https://recipio.kr/recipes/{recipeId}
- closingNote 권유 링크: https://recipio.kr/curation/${article.slug}

위 입력을 바탕으로 CurationBlogPostSchema 에 맞춘 JSON 을 출력하라.`;
};
