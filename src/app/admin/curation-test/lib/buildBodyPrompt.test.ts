import { buildBodySystemPrompt, buildBodyUserPrompt } from "./buildBodyPrompt";

describe("buildBodySystemPrompt", () => {
  it("toneSeed friendly면 ~해요 종결어미 지시가 들어간다", () => {
    const sys = buildBodySystemPrompt({ toneSeed: "friendly" });
    expect(sys).toMatch(/~해요|~한답니다/);
  });

  it("toneSeed editorial면 ~습니다 종결어미 지시가 들어간다", () => {
    const sys = buildBodySystemPrompt({ toneSeed: "editorial" });
    expect(sys).toMatch(/~습니다|~죠/);
  });

  it("슬롯 syntax 3종이 모두 명시된다", () => {
    const sys = buildBodySystemPrompt({ toneSeed: "friendly" });
    expect(sys).toContain("{{img:N}}");
    expect(sys).toContain("{{recipe:N}}");
    expect(sys).toContain("{{yt:N}}");
  });

  it("금지어들이 명시된다", () => {
    const sys = buildBodySystemPrompt({ toneSeed: "friendly" });
    expect(sys).toMatch(/마케팅 카피.*금지|금지.*마케팅/);
  });

  it("H1은 본문에 박지 말라는 지시가 들어간다", () => {
    const sys = buildBodySystemPrompt({ toneSeed: "friendly" });
    expect(sys).toMatch(/H1.*금지|H1.*박지/);
  });
});

describe("buildBodyUserPrompt", () => {
  const recipes = [
    {
      id: "abc",
      title: "콩나물국",
      description: "시원한 국물",
      ingredients: [{ name: "콩나물", amount: "200g" }],
      cookingTime: 20,
      totalCalories: 130,
    },
    {
      id: "def",
      title: "김치찌개",
      description: "얼큰한",
      ingredients: [{ name: "김치", amount: "200g" }],
      cookingTime: 25,
      totalCalories: 220,
    },
  ];

  it("recipes를 인덱스 명시 형태로 직렬화", () => {
    const user = buildBodyUserPrompt({
      params: { dishType: "찌개" },
      h1: "겨울 찌개",
      dek: "한 그릇이면 충분",
      recipes,
      toneSeed: "friendly",
    });
    expect(user).toMatch(/\[0\][\s\S]*콩나물국/);
    expect(user).toMatch(/\[1\][\s\S]*김치찌개/);
  });

  it("imageUrl/youtubeUrl은 절대 user prompt에 박히지 않는다 (환각 차단)", () => {
    const user = buildBodyUserPrompt({
      params: {},
      h1: "x",
      dek: "y",
      recipes: [{ ...recipes[0], imageUrl: "SECRET", youtubeUrl: "SECRET" } as any],
      toneSeed: "friendly",
    });
    expect(user).not.toContain("SECRET");
  });
});
