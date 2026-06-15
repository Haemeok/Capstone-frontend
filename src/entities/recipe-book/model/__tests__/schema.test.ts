import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { buildRecipeBookFormSchema } from "../schema";

describe("buildRecipeBookFormSchema (T-16)", () => {
  const v = userPagesMessages.ja.recipeBooks.validation;
  const schema = buildRecipeBookFormSchema(v);
  it("빈 이름 → ja nameRequired", () => {
    const r = schema.safeParse({ name: "" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toBe(v.nameRequired);
  });
  it("51자 → ja nameMax", () => {
    const r = schema.safeParse({ name: "a".repeat(51) });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toBe(v.nameMax);
  });
});
