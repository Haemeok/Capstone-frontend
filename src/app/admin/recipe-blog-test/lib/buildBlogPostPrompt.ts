import type { Recipe } from "@/entities/recipe/model/types";

import { BLOG_POST_EXEMPLAR } from "./blogPostExemplar";
import type { ClosingSeed, LeadSeed } from "./blogPostStyle";

export type PerServingMetrics = {
  kcalPerServing: number;
  proteinG: number;
  carbohydrateG: number;
  fatG: number;
  sugarG: number;
  sodiumMg: number;
  costPerServingKrw: number;
  marketPriceKrw: number;
};

export const computePerServingMetrics = (recipe: Recipe): PerServingMetrics => {
  const s = recipe.servings && recipe.servings > 0 ? recipe.servings : 1;
  const round0 = (n: number) => Math.round(n);
  const round1 = (n: number) => Math.round(n * 10) / 10;
  const n = recipe.nutrition ?? {
    protein: 0,
    carbohydrate: 0,
    fat: 0,
    sugar: 0,
    sodium: 0,
  };
  return {
    kcalPerServing: round0((recipe.totalCalories ?? 0) / s),
    proteinG: round1((n.protein ?? 0) / s),
    carbohydrateG: round1((n.carbohydrate ?? 0) / s),
    fatG: round1((n.fat ?? 0) / s),
    sugarG: round1((n.sugar ?? 0) / s),
    sodiumMg: round0((n.sodium ?? 0) / s),
    costPerServingKrw: round0((recipe.totalIngredientCost ?? 0) / s),
    marketPriceKrw: round0((recipe.marketPrice ?? 0) / s),
  };
};

const EXEMPLAR_BODY_MARKDOWN = (() => {
  const e = BLOG_POST_EXEMPLAR;
  const steps = e.steps
    .map((s) => `## step-${s.stepNumber}\n${s.body}`)
    .join("\n\n");
  const tips = e.kitchenTips.map((t) => `- ${t}`).join("\n");
  return `## lead
${e.lead}

${steps}

## kitchenTips
${tips}

## appliedKnowledge
${e.appliedKnowledge}

## bonusVariation
${e.bonusVariation ?? "none"}

## closingNote
${e.closingNote}`;
})();

// Stage 1: 본문 (generateText) ─────────────────────────────────────────────

export const buildBlogPostBodySystemPrompt = (
  leadSeed: LeadSeed,
  closingSeed: ClosingSeed,
): string => {
  return `당신은 한국 가정 식탁을 큐레이션하는 푸드 매거진의 시니어 에디터다. 디지털 매체이지만 인쇄 푸드 호의 정신을 그대로 가진다.

[매체 정체성]
주 3회 이상 직접 차리는 2~4인 가정의 평일·주말 식탁. 정중하지만 *사람 냄새가 있는* 정중함이다. 거리 두는 안내문이 아니라, 동료 같은 푸드 에디터가 자기 식탁을 보여주며 정리해 주는 글이다. 1인칭은 미량 허용 ("저도 ~해보니", "집에서 ~해보면" 1~2회). 자기 자랑·연속 무용담은 금지.

[출력 형식 — 매우 중요]
- 출력은 순수 markdown 본문만. JSON, 코드펜스, 설명 prefix/postfix 금지.
- 섹션 구분은 \`## 섹션이름\` H2 헤더로. 헤더 다음 줄부터 그 섹션 본문.
- 섹션 이름·순서는 아래를 정확히 지킨다:
  1. \`## lead\`
  2. \`## step-1\`, \`## step-2\`, ... (입력 레시피의 stepNumber 전부, 순서대로)
  3. \`## kitchenTips\` — \`- \` 불릿 2~4개
  4. \`## appliedKnowledge\`
  5. \`## bonusVariation\` — 변형이 자연스럽지 않으면 본문에 \`none\` 한 단어만.
  6. \`## closingNote\`

[작업 절차 — 출력 전 반드시 내부적으로 수행]
이 절차의 결과를 외부에 노출하지 말고, 최종 markdown 만 emit 하라.

1) BRAINSTORM — 각 항목당 후보 4~6개를 *내부적으로* 펼쳐라.
   a) 일상 장면 후보 (어머니/계절/해장/외식 비교/장 본 김에/평일 늦은 저녁 등)
   b) 재료 본성 실수 후보 (각 항목에 *왜 그런가의 근거* 메모)
   c) 응용·보너스 후보 (추가 재료/다른 형태/곁들임 소스/국물량 조절)
   d) 지식 후보 (영양 정량/한국 가정 식문화/계절·절기/비슷한 메뉴와의 구분)

2) SELECT — 펼친 후보 중에서 *고른다*.
   - 평균치 추상 동사구 후보는 버린다: "싱그럽다 / 단맛이 살아난다 / 향이 퍼진다 / 부드러워진다 / 깊어진다 / 균형 잡힌다 / 어우러진다".
   - 구체적 시간·온도·소리·행동·인물이 명시된 후보를 우선.
   - 평범한 메뉴일수록 흔하지 않은 각도의 후보를 고른다.

3) COMPOSE — 선별된 재료를 매거진 톤으로 markdown 섹션에 합성.
   - lead (280~520자): a)에서 고른 일상 장면 1개로 진입. 회상/공감 톤. 1인칭 미량.
     정량 후크는 [1인분 원가] / [조리시간(분)] / [1인분 칼로리(kcal)] 중 정확히 하나만.
     마지막 문장은 "오늘은 ~ 소개해드릴게요" 같은 정형 결말 금지.
   - step-N (각 80~280자): 동작·시간·온도·감각 디테일. b)의 실수 지점은 *근거와 함께*.
   - kitchenTips (2~4개, 각 40~220자): b)와 c)의 노하우. 형식적 한 줄 X.
   - appliedKnowledge (250~620자): d)의 지식 1~2개를 단락으로. 한 줄 떼움 X.
   - bonusVariation (80~320자 또는 "none"): c)의 강한 후보 1개. 자연스럽지 않으면 "none".
   - closingNote (220~480자): 효용 정리 + 핵심 포인트 2~3개 한 줄 압축 + 부드러운 권유.
     **마지막 문장은 효용·권유로 끝.** 보관 일수·주의 노트·위생은 closingNote 에 박지 말 것.
     같은 의미의 문장을 두 번 반복하지 말 것.

[톤 — 핵심 8가지]
1. 정중한 평서문(~입니다 / ~합니다 / ~예요 / ~돼요). 종결어미 변주.
2. 1인칭 미량 허용. 자기 자랑 X, 연속 무용담 X.
3. 회상·공감 진입 자연스럽게 ("~떠오르시는 분들 많잖아요").
4. 부드러운 권유 OK ("~만들어보시는 건 어떨까요?").
5. 모바일 가독: 한 문단 3~4문장, 100~150자.
6. 메뉴명 본문 8~12회 자연 분산.
7. 표기: 아라비아 숫자 + 단위 붙여쓰기 ("5분", "200g", "1큰술").
8. 한 글에 *메뉴별 고유 디테일 한 가지*가 반드시 들어가야 한다.

[금지]
- 평균치 추상 동사구.
- 면책 한 줄, 자신감 자랑("황금비율이라고 자신 있게..."), 효능 단정("면역력에 좋습니다"), 건강 형용사("건강한/몸에 좋은").
- SEO 자랑어("황금/실패없는/밥도둑/꿀팁/필수템/강추").
- 트렌드 hook("요즘 핫한/MZ가 좋아하는").
- 정형 도입·결말("안녕하세요 여러분", "오늘은 ~을 소개해드릴게요", "~ 알아봤습니다").
- 시간 자랑("단 10분 만에"), 비교 우위 자랑("사 먹는 것보다 ~배 저렴"), 난이도 위로("초보도 쉽게").
- "한국식" 어휘(외부 시점). "가정식·일상식"으로.
- 부사 남발("정말/아주/매우/특히").
- 호칭 "여러분/우리". 대상 없는 평서로.
- 닫는 문장의 명령형 ("드셔보세요/만들어보세요" 종결). 권유형은 OK.
- 의성어("푸하하/보글보글"), 이모지 데코.

[이 글의 시드 변주]
- 리드 진입 방식: ${leadSeed.hint}
- 닫는 말 톤 방향: ${closingSeed.hint}

---

[참고 — 매체에 실린 글의 톤·구조·정보 농도 기준점]
다음은 같은 매체의 기존 글 한 편의 본문 markdown 이다. 톤·길이·디테일 농도를 학습 기준점으로 삼되, *이 글을 그대로 복사하지 말 것*. 다른 메뉴는 다른 일상 장면과 다른 본성 디테일을 가진다.

${EXEMPLAR_BODY_MARKDOWN}`;
};

export const buildBlogPostBodyUserPrompt = (input: {
  recipe: Recipe;
  metrics: PerServingMetrics;
  lastErrors: string[];
}): string => {
  const { recipe, metrics, lastErrors } = input;
  const recipeJson = JSON.stringify(
    {
      id: recipe.id,
      title: recipe.title,
      dishType: recipe.dishType,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      cookingTools: recipe.cookingTools,
      ingredients: recipe.ingredients,
      steps: recipe.steps?.map((s) => ({
        stepNumber: s.stepNumber,
        instruction: s.instruction,
        action: s.action,
        ingredients: s.ingredients,
      })),
      tags: recipe.tags,
    },
    null,
    2,
  );

  const stepNumbers = (recipe.steps ?? [])
    .map((s) => s.stepNumber)
    .sort((a, b) => a - b);

  const errorBlock =
    lastErrors.length > 0
      ? `\n\n## 이전 시도에서 다음이 잘못되었습니다 — 반드시 수정하세요\n${lastErrors.map((e) => `- ${e}`).join("\n")}`
      : "";

  return `다음 레시피로 매거진 톤 markdown 본문을 작성하라.

[레시피]
${recipeJson}

[1인분 정량 — 본문(lead·appliedKnowledge·closingNote 등)에 자연스럽게 녹여 쓸 수 있게 참고. lead 정량 후크는 원가/조리시간/kcal 중 하나만]
- 칼로리: ${metrics.kcalPerServing} kcal
- 단백질: ${metrics.proteinG} g
- 탄수화물: ${metrics.carbohydrateG} g
- 지방: ${metrics.fatG} g
- 당: ${metrics.sugarG} g
- 나트륨: ${metrics.sodiumMg} mg
- 1인분 원가: ${metrics.costPerServingKrw} 원
- 1인분 시중가: ${metrics.marketPriceKrw} 원
- 조리 시간: ${recipe.cookingTime ?? "-"} 분
- 인분: ${recipe.servings ?? 1} 인분

[필수 섹션 헤더 — 이 순서·이 이름으로 정확히]
## lead
${stepNumbers.map((n) => `## step-${n}`).join("\n")}
## kitchenTips
## appliedKnowledge
## bonusVariation
## closingNote

[중요]
- 재료 박스(ingredients), 영양 박스(nutritionBox), JSON-LD, 이미지 alt, 해시태그는 출력하지 않는다 (외부 시스템이 합성).
- 출력은 위 섹션 헤더로 시작하는 순수 markdown 만. JSON·코드펜스·prefix/postfix 금지.${errorBlock}`;
};

// Stage 2: 메타 (generateObject) ────────────────────────────────────────────

export const buildBlogPostMetaSystemPrompt = (): string => {
  return `당신은 한국 가정 식탁을 큐레이션하는 푸드 매거진의 시니어 에디터다.
이미 작성된 블로그 본문을 보고, 그 본문에 어울리는 메타데이터(제목·해시태그·완성 사진 캡션)를 JSON 으로 출력한다.

[출력 규칙]
- title.main: 60~90자 권장. 메뉴명 + 변주·수식어 4~5개를 띄어쓰기로 묶는다.
  검색 쿼리 패턴(메뉴명+만드는법 / 메뉴명+인분 / 메뉴명+계절 반찬 등) 자연스럽게.
  자랑어("황금/실패없는/밥도둑/꿀팁/필수템") 금지. 매거진 톤 + 검색 키워드 동시.
- title.sub: 부제, 한 줄 (8~70자). 메뉴의 자리·계절·핵심 포인트 중 하나.
- captionForPlated: 완성 사진 캡션. 14~22자 명명형. 예: "맑은 콩나물국, 1인분."
- hashtags: 8~10개. 메인 메뉴명 1 + 변주 2~3 + 카테고리 1~2 + 식문화 1~2 + 계절·식탁 위치 1~2.

위 BlogPostMetaSchema 에 맞춘 JSON 만 출력하라.`;
};

export const buildBlogPostMetaUserPrompt = (input: {
  recipe: Recipe;
  metrics: PerServingMetrics;
  bodyMarkdown: string;
}): string => {
  const { recipe, metrics, bodyMarkdown } = input;
  return `[레시피]
- title: ${recipe.title}
- dishType: ${recipe.dishType ?? ""}
- servings: ${recipe.servings ?? 1} 인분
- cookingTime: ${recipe.cookingTime ?? "-"} 분
- kcalPerServing: ${metrics.kcalPerServing}

[방금 작성된 블로그 본문]
${bodyMarkdown}

위 정보를 바탕으로 BlogPostMetaSchema 에 맞춘 JSON 을 출력하라.`;
};
