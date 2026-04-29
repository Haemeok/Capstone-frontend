import type { RecipeStep } from "@/entities/recipe/model/types";

import { deriveActionShots } from "./actionDerivation";

const step = (
  n: number,
  action?: string,
  instruction = "step"
): RecipeStep => ({
  stepNumber: n,
  instruction,
  stepImageUrl: "",
  action,
  stepImageKey: null,
});

describe("deriveActionShots", () => {
  it("returns empty array when no steps have recognized actions", () => {
    const out = deriveActionShots([
      step(1, "플레이팅"),
      step(2, undefined),
    ]);
    expect(out).toEqual([]);
  });

  it("dedupes within the same action category", () => {
    const out = deriveActionShots([
      step(1, "썰기"),
      step(2, "다듬기"),
      step(3, "볶기"),
      step(4, "볶기"),
    ]);
    expect(out.map((a) => a.actionKey)).toEqual(["cutting_board", "stir_fry"]);
  });

  it("preserves order of first appearance", () => {
    const out = deriveActionShots([
      step(1, "끓이기"),
      step(2, "썰기"),
      step(3, "끓이기"),
    ]);
    expect(out.map((a) => a.actionKey)).toEqual(["simmer", "cutting_board"]);
  });

  it("caps at 5 action shots", () => {
    const out = deriveActionShots([
      step(1, "썰기"),
      step(2, "볶기"),
      step(3, "끓이기"),
      step(4, "무치기"),
      step(5, "튀기기"),
      step(6, "찌기"),
    ]);
    expect(out).toHaveLength(5);
  });

  it("attaches a label to each action shot", () => {
    const out = deriveActionShots([step(1, "볶기")]);
    expect(out[0].label).toBe("볶기");
    expect(out[0].actionKey).toBe("stir_fry");
  });
});
