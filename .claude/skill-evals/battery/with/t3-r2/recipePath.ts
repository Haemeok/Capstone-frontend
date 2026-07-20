const RECIPE_DETAIL_PATTERN =
  /^\/recipes\/(?!new$|my-fridge$|admin$|category$)[^/]+$/;

export const isRecipeDetailPath = (pathname: string): boolean => {
  return RECIPE_DETAIL_PATTERN.test(pathname);
};
