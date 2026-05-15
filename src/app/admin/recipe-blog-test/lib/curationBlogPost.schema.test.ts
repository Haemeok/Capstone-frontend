import { CurationBlogPostSchema } from "./curationBlogPost.schema";

const validNarrative = {
  title: {
    main: "환절기 식탁을 가볍게 — 한 그릇 든든한 국·찌개 모음 6선 가족 평일",
    sub: "환절기, 데우기만 해도 든든한 한국 가정의 국·찌개",
  },
  lead: "환절기 저녁에 가스불 앞에 가장 오래 머무르는 메뉴는 결국 한 그릇으로 채우는 국·찌개라고 느낍니다. 봄과 여름을 지나며 가벼운 요리를 선호했던 식탁이 점차 따뜻한 한 그릇을 원하기 시작합니다. 국물이 따스한 밥 위에 소복이 담긴 반찬들이 어울리는 계절입니다. 이맘때 한국의 밥상은 자연스럽게 냄비의 향기를 머금게 되고, 가족의 끼니는 그 속에서 온기를 얻습니다. 들어가는 재료도 많지 않고 손질도 간단하면서 포만감까지 깊은 이 한 그릇들이 바로 평일 저녁 밥상의 구세주입니다. 오늘은 환절기 평일 저녁 밥상에 자주 올라가는 세 가지 국과 찌개를 골라봤습니다.",
  sections: [
    {
      recipeId: "r1",
      recipeTitle: "콩나물국",
      blurb:
        "맑은 콩나물국은 환절기 아침에 첫 그릇으로 자주 올라가는 메뉴라 가장 먼저 골랐습니다. 아침 밥상의 국 자리를 지키는 이 한 그릇은 가족 모두가 쉽게 즐길 수 있으면서도 건강함을 담아낼 수 있는 메뉴입니다.",
      imageSlot: "recipe-r1",
      recipeUrl: "https://recipio.kr/recipes/r1",
    },
    {
      recipeId: "r2",
      recipeTitle: "된장찌개",
      blurb:
        "전날 남은 채소가 정리되는 식탁의 정리 메뉴로 자주 등장하는 된장찌개를 두 번째로 두었습니다. 호박, 애호박, 두부가 함께 들어가면서 깊은 맛이 나며 밥 한 그릇을 든든하게 채워줍니다.",
      imageSlot: "recipe-r2",
      recipeUrl: "https://recipio.kr/recipes/r2",
    },
    {
      recipeId: "r3",
      recipeTitle: "김치찌개",
      blurb:
        "묵은 김치가 깊어지는 계절에 가장 자연스러운 한 그릇이라 마지막에 배치했습니다. 보글보글 끓는 냄비에서 올라오는 김의 향취만으로도 계절을 온몸으로 느낄 수 있습니다.",
      imageSlot: "recipe-r3",
      recipeUrl: "https://recipio.kr/recipes/r3",
    },
  ],
  closingNote: "오늘 정리한 세 그릇은 환절기 평일 저녁에 큰 결심 없이 올릴 수 있는 메뉴들이에요. 계절이 바뀌면 자연스럽게 식탁 위의 냄비가 바뀌고, 그 냄비 속 국물의 맛이 깊어집니다. 겨울이 다가올수록 더욱 자주 꺼내게 될 이 세 레시피들로 따뜻한 밥상을 차려보세요. 큰 냄비에 끓인 국물 한 숟갈, 김이 모락모락 나는 밥 한 숟갈로 시작하는 저녁이 가장 정겹습니다. 더 많은 레시피는 레시피오에서 찾아보세요.",
  hashtags: ["#환절기식탁", "#한그릇", "#콩나물국", "#된장찌개", "#김치찌개", "#평일저녁", "#한식", "#집밥"],
  alts: { "recipe-r1": "콩나물국", "recipe-r2": "된장찌개", "recipe-r3": "김치찌개" },
  captionForCover: "환절기 한 그릇, 세 가지.",
};

describe("CurationBlogPostSchema", () => {
  it("정상 narrative를 통과한다", () => {
    const r = CurationBlogPostSchema.safeParse(validNarrative);
    expect(r.success).toBe(true);
  });

  it("imageSlot 이 'recipe-' 접두사가 아니면 실패한다", () => {
    const bad = {
      ...validNarrative,
      sections: [
        { ...validNarrative.sections[0], imageSlot: "step-1" },
        ...validNarrative.sections.slice(1),
      ],
    };
    expect(CurationBlogPostSchema.safeParse(bad).success).toBe(false);
  });

  it("sections 가 3개 미만이면 실패한다", () => {
    const bad = { ...validNarrative, sections: validNarrative.sections.slice(0, 2) };
    expect(CurationBlogPostSchema.safeParse(bad).success).toBe(false);
  });

  it("hashtags 가 7개면 실패한다 (min 8)", () => {
    const bad = { ...validNarrative, hashtags: validNarrative.hashtags.slice(0, 7) };
    expect(CurationBlogPostSchema.safeParse(bad).success).toBe(false);
  });
});
