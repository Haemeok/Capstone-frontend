import { z } from "zod";

export const BlogPostSchema = z.object({
  title: z.object({
    main: z
      .string()
      .min(20)
      .max(110)
      .describe(
        "메인 제목 — 롱테일 SEO. 메뉴명 + 핵심 수식어·변주 4~5개를 띄어쓰기로 묶는다 (예: '꼬들꼬들 가지무침 만드는법 김치스타일 여름 반찬 6인분'). 60~90자 권장. 검색 매칭 위해 키워드는 풍부하게 박되, SEO 자랑어(황금/실패없는/꿀팁/밥도둑/필수템) 금지. 광고체 X, 매거진 톤 유지하되 검색 키워드는 의도적으로 박는다."
      ),
    sub: z
      .string()
      .min(8)
      .max(70)
      .describe("부제. 한 줄 요약. 메뉴의 자리·계절·핵심 포인트 중 하나."),
  }),

  lead: z
    .string()
    .min(280)
    .max(520)
    .describe(
      "리드 단락. 일상 장면 진입(어머니의 한 그릇/환절기/장 보기/외식 비교 등)으로 첫 문장을 시작하라. 1인칭 미량 허용('저도 ~해보니'), 자기 자랑 금지. 메뉴의 자리 + 정량 후크 1개(원가/시간/kcal 중 하나) + 글의 약속을 흐름으로 통합. 평균치 추상 동사구('싱그럽다/단맛이 살아난다/향이 퍼진다') 금지."
    ),

  steps: z
    .array(
      z.object({
        stepNumber: z.number().int().positive(),
        body: z
          .string()
          .min(80)
          .max(280)
          .describe(
            "step 본문 2~4문장. (a) 동작·시간·온도·감각 디테일 + (b) 실패 지점이 있다면 *왜 그런지 근거와 함께* 한 문장. 평균치 묘사 금지. 재료 본성에서 오는 노트가 들어갈 수 있음."
          ),
        imageSlot: z
          .string()
          .describe("이미지 슬롯 키. 예: 'step-1'."),
      })
    )
    .min(1),

  kitchenTips: z
    .array(z.string().min(40).max(220))
    .min(2)
    .max(4)
    .describe(
      "본문에서 따로 빼는 노하우 팁 2~4개. 각 tip은 (1) 시간 절약 (2) 흔한 실수 회피 (3) 재료 본성에서 오는 팁 중 하나. 형식적 한 줄 금지 — 왜 그런지의 근거를 같이. 자랑어/광고체 금지."
    ),

  appliedKnowledge: z
    .string()
    .min(250)
    .max(620)
    .describe(
      "1~2 단락의 풀어쓰는 지식. 영양/재료 본성/한국 가정에서 메뉴의 자리/계절·문화 중 1~2개를 단락으로 풀어쓴다. '효능'(면역력/혈압) 단정 금지. 알려진 사실 위주. 단순 한 줄 떼움 금지 — 풀어쓸 것."
    ),

  bonusVariation: z
    .string()
    .min(80)
    .max(320)
    .nullable()
    .describe(
      "메인 외 응용/변형 1개 (보너스). 추가 재료/다른 형태 변환/곁들임 소스/국물량 조절 등. 자연스러운 변형이 떠오르지 않으면 null."
    ),

  closingNote: z
    .string()
    .min(220)
    .max(480)
    .describe(
      "닫는 단락. 효용 정리 + 핵심 포인트 2~3개 한 줄로 압축 + 부드러운 권유 + (옵션) 댓글 유도 한 줄. didl158 결론 톤. 명령형/광고체 금지, 권유형은 OK ('~만들어보시는 건 어떨까요?')."
    ),

  nutritionBox: z.object({
    kcalPerServing: z.number().int().nonnegative(),
    proteinG: z.number().nonnegative(),
    carbohydrateG: z.number().nonnegative(),
    fatG: z.number().nonnegative(),
    sugarG: z.number().nonnegative(),
    sodiumMg: z.number().nonnegative(),
    costPerServingKrw: z.number().int().nonnegative(),
    marketPriceKrw: z.number().int().nonnegative(),
  }),

  alts: z
    .record(z.string(), z.string())
    .describe(
      "이미지 슬롯별 alt 텍스트. 키는 imageSlot. 패턴: '메뉴명 + 단계/상태'. step별 어휘 변주."
    ),

  captionForPlated: z
    .string()
    .min(8)
    .max(40)
    .describe("완성 사진의 캡션. 14~22자 명명형. 예: '맑은 콩나물국, 1인분.'"),

  hashtags: z
    .array(z.string())
    .min(8)
    .max(10)
    .describe(
      "8~10개. 메인 메뉴명 1 + 변주 2~3 + 카테고리 1~2 + 식문화 1~2 + 계절·식탁 위치 1~2."
    ),

  jsonLd: z.object({
    "@context": z.literal("https://schema.org"),
    "@type": z.literal("Recipe"),
    name: z.string(),
    recipeYield: z.string(),
    prepTime: z.string().optional(),
    cookTime: z.string().optional(),
    totalTime: z.string().optional(),
    recipeIngredient: z.array(z.string()),
    recipeInstructions: z.array(
      z.object({
        "@type": z.literal("HowToStep"),
        text: z.string(),
      })
    ),
    nutrition: z
      .object({
        "@type": z.literal("NutritionInformation"),
        calories: z.string(),
        proteinContent: z.string().optional(),
        carbohydrateContent: z.string().optional(),
        fatContent: z.string().optional(),
        sugarContent: z.string().optional(),
        sodiumContent: z.string().optional(),
      })
      .optional(),
  }),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;
