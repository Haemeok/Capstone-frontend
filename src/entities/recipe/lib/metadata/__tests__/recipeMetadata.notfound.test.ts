/**
 * @jest-environment node
 */
import { generateNotFoundRecipeMetadata } from "../recipeMetadata";

it("not-found 메타데이터는 noindex,nofollow다", () => {
  expect(generateNotFoundRecipeMetadata().robots).toEqual({
    index: false,
    follow: false,
  });
});
