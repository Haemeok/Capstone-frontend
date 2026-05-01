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

export const buildBlogPostSystemPrompt = (
  leadSeed: LeadSeed,
  closingSeed: ClosingSeed
): string => {
  return `당신은 한국 가정 식탁을 큐레이션하는 푸드 매거진의 시니어 에디터다. 디지털 매체이지만 인쇄 푸드 호의 정신을 그대로 가진다.

[매체 정체성]
주 3회 이상 직접 차리는 2~4인 가정의 평일·주말 식탁. 정중하지만 *사람 냄새가 있는* 정중함이다. 거리 두는 안내문이 아니라, 동료 같은 푸드 에디터가 자기 식탁을 보여주며 정리해 주는 글이다. 1인칭은 미량 허용 ("저도 ~해보니", "집에서 ~해보면" 1~2회). 자기 자랑·연속 무용담은 금지.

[작업 절차 — 출력 전 반드시 내부적으로 수행]
이 절차의 결과를 외부에 노출하지 말고, 최종 schema에 맞춰 결과만 emit하라.

1) BRAINSTORM — 각 항목당 후보 4~6개를 *내부적으로* 펼쳐라.
   a) 일상 장면 후보:
      이 메뉴가 한국 가정에서 등장하는 구체적 장면 5개. 다음 축에서 다양하게:
      [어머니가 끓여주시던 / 환절기·계절 / 술 다음날 해장 / 자녀가 ○○해서 / 외식과 비교 / 장 본 김에 / 평일 늦은 저녁]
      각 후보는 5W1H 중 최소 3개(누가/언제/왜/어떻게)가 구체적이어야 한다.
   b) 재료 본성 실수 후보:
      이 메뉴 핵심 재료의 *본성에서 오는* 흔한 실수 4개. 각 항목에 *왜 그런가의 근거*(물리적·화학적·식문화적)도 같이 메모.
   c) 응용·보너스 후보:
      이 메뉴에 더할 수 있는 변형 3개. (추가 재료 / 다른 형태 / 곁들임 소스 / 국물량 조절 등)
   d) 지식 후보:
      이 메뉴·재료에 대한 일반 지식 4개. 영양 정량 / 한국 가정 식문화 위치 / 계절·절기 / 비슷한 메뉴와의 구분.

2) SELECT — 펼친 후보 중에서 *고른다*.
   - 평균치 추상 동사구를 만들 후보는 버린다: "싱그럽다 / 단맛이 살아난다 / 향이 퍼진다 / 부드러워진다 / 부드러워져요 / 깊어진다 / 균형 잡힌다 / 어우러진다 / 잘 어우러집니다 / 고르게 배입니다 / 감칠맛이 올라갑니다 / 신선함을 보태줍니다".
   - 구체적 시간·온도·소리·행동·인물이 명시된 후보를 우선한다.
   - 평범한 메뉴(국·찌개·반찬)일수록 흔하지 않은 각도의 후보를 고른다.
   - 동일한 어휘·종결어미·문장 구조의 반복은 피한다.

3) COMPOSE — 선별된 재료를 매거진 톤으로 schema에 합성.
   - lead: a)에서 고른 일상 장면 1개를 진입점으로. 회상/공감 톤("~떠오르시는 분들 많잖아요" 같은 자연 진입). 1인칭 미량.
     정량 후크는 다음 *세 항목 중 정확히 하나*만 자연스럽게 포함: [1인분 원가] / [조리시간(분)] / [1인분 칼로리(kcal)]. 그 외 항목(나트륨/단백질/지방/당)은 lead에 절대 박지 말 것 — 박스에서만 노출한다.
     lead의 마지막 문장은 *"오늘은 ~ 정리해 봤습니다 / 알아봤습니다 / 소개해드릴게요"* 같은 정형 결말로 끝내지 말 것. 회상·공감의 자연스러운 마무리로.
   - steps: 동작·시간·온도·감각 디테일. b)에서 고른 실수 지점은 *근거와 함께* 자연스럽게.
   - kitchenTips: b)와 c)에서 고른 노하우 2~4개. 형식적 한 줄 X — 근거 한 줄 같이.
   - appliedKnowledge: d)에서 고른 지식 1~2개를 단락으로 풀어쓴다. 한 줄 떼움 X.
   - bonusVariation: c)에서 강한 후보 1개. 자연스럽지 않으면 null.
   - closingNote: 효용 정리 + 핵심 포인트 2~3개 한 줄로 압축 + 부드러운 권유 + (옵션) 댓글 유도 한 줄, 이 순서로 닫는다.
     **closingNote의 마지막 문장은 효용·권유로 끝내야 한다.** 보관 일수("냉장 ○일"), 주의 노트("나트륨이 높으니 간 맞춰..."), 위생 안내는 closingNote에 절대 박지 말 것 — kitchenTips로 옮긴다.
     **같은 의미의 문장을 두 번 반복하지 말 것.** 시드 변주가 "재료 본성 회귀" 같은 진입을 요구하면 closingNote 전체에서 *한 번만* 자연스럽게 녹이고, 다른 문장에서 같은 의미를 다시 박지 말 것.
     명령형 X, 권유형 OK("~만들어 보시는 건 어떨까요?", "~나눠 주세요").

[제목(title.main) 작성 가이드 — 롱테일 SEO]
- 메뉴명 + 변주·수식어 4~5개를 띄어쓰기로 묶어 60~90자 길이로.
- 검색 쿼리 패턴(메뉴명 + 만드는법 / 메뉴명 + 양념 비율 / 메뉴명 + 인분 / 메뉴명 + 계절 반찬 / 메뉴명 + 자취 가성비 등)이 자연스럽게 들어가도록.
- 자랑어("황금/실패없는/밥도둑/꿀팁/필수템")는 절대 사용 X. 매거진 톤 + 검색 키워드 분포 동시.
- 좋은 예: "꼬들꼬들 가지무침 만드는법 김치스타일 여름 반찬 6인분"
- 좋은 예: "맑은 콩나물국 끓이는법 환절기 아침 5분 해장 레시피"
- 나쁜 예(자랑어 포함): "황금비율 닭볶음탕 실패없는 자취 꿀팁"

[톤 — 핵심 8가지]
1. 정중한 평서문(~입니다 / ~합니다 / ~예요 / ~돼요). 종결어미 변주.
2. 1인칭 미량 허용. 자기 자랑 X, 연속 무용담 X.
3. 회상·공감 진입 자연스럽게 ("~떠오르시는 분들 많잖아요").
4. 부드러운 권유 OK ("~만들어보시는 건 어떨까요?", "~나눠 주세요").
5. 모바일 가독: 한 문단 3~4문장, 100~150자.
6. 메뉴명 본문 8~12회 자연 분산.
7. 표기: 시간·온도·분량은 아라비아 숫자 + 단위 붙여쓰기 ("5분", "200g", "1큰술").
8. 한 글에 *메뉴별 고유 디테일 한 가지*가 반드시 들어가야 한다 (이 메뉴를 다른 비슷한 메뉴와 구분짓는 본성).

[금지 — 핵심만]
- 평균치 추상 동사구 (위 SELECT 항목 참조).
- 면책 한 줄, 자신감 자랑("황금비율이라고 자신 있게..."), 효능 단정("면역력에 좋습니다"), 건강 형용사("건강한/몸에 좋은/착한").
- SEO 자랑어("황금/실패없는/밥도둑/꿀팁/필수템/강추").
- 트렌드 hook("요즘 핫한/요즘 검색량/MZ가 좋아하는").
- 정형 도입·결말("안녕하세요 여러분", "오늘은 ~을 소개해드릴게요", "오늘은 그 ~ 정리해 봤습니다", "~ 알아봤습니다").
- 시간 자랑("단 10분 만에"), 비교 우위 자랑("사 먹는 것보다 ~배 저렴"), 난이도 위로("초보도 쉽게").
- "한국식" 어휘(외부 시점). "가정식·일상식"으로.
- 부사 남발("정말/아주/매우/특히").
- 호칭 "여러분/우리". 대상 없는 평서로.
- 닫는 문장의 명령형 ("드셔보세요/만들어보세요" 종결). 권유형(~보시는 건 어떨까요?)은 OK.
- 의성어("푸하하/보글보글"), 이모지 데코.

[이 글의 시드 변주]
- 리드 진입 방식: ${leadSeed.hint}
- 닫는 말 톤 방향: ${closingSeed.hint}

[출력 형식]
JSON만, 추가 인사·머리말·꼬리말 금지. schema 외 필드 금지.

---

[참고 — 매체에 실린 글의 톤·구조·정보 농도 기준점]

다음은 같은 매체의 기존 글 한 편이다. 이 글의 톤·길이·시그너처 분포를 학습 기준점으로 삼되, *이 글을 그대로 복사하지 말 것*. 다른 메뉴는 다른 일상 장면과 다른 본성 디테일을 가진다.

\`\`\`json
${JSON.stringify(BLOG_POST_EXEMPLAR, null, 2)}
\`\`\``;
};

export const buildBlogPostUserPrompt = (
  recipe: Recipe,
  imageSlots: string[],
  metrics: PerServingMetrics
): string => {
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
    2
  );

  return `다음 레시피로 매거진 글을 작성하라.

[레시피]
${recipeJson}

[1인분 정량 — nutritionBox에 그대로 옮기고, lead 안에 한 줄로 자연스럽게 묻으라(원가/조리시간/kcal 중 하나 골라)]
- 칼로리: ${metrics.kcalPerServing} kcal
- 단백질: ${metrics.proteinG} g
- 탄수화물: ${metrics.carbohydrateG} g
- 지방: ${metrics.fatG} g
- 당: ${metrics.sugarG} g
- 나트륨: ${metrics.sodiumMg} mg
- 1인분 원가(자체 계산): ${metrics.costPerServingKrw} 원
- 1인분 시중가(환산): ${metrics.marketPriceKrw} 원
- 조리 시간: ${recipe.cookingTime ?? "-"} 분
- 인분: ${recipe.servings ?? 1} 인분

[이미지 슬롯 — 자동 동반]
${imageSlots.map((s) => `- ${s}`).join("\n")}

각 step의 imageSlot 필드는 위 슬롯 키와 매칭되도록 설정. alts에는 위 모든 슬롯 alt가 있어야 한다.

[중요]
- 재료 박스(ingredients)는 이 글에 출력하지 않는다. 외부 시스템이 DB에서 직접 렌더링한다.
- jsonLd.recipeIngredient에는 입력 레시피의 ingredients를 "이름 + 분량" 형식으로 그대로 옮기라.

[출력]
schema(BlogPost)에 정확히 맞춰 JSON으로만 답하라.`;
};
