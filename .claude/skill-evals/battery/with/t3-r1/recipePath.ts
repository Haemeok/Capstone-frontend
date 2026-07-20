const RESERVED_SEGMENTS = new Set([
  'admin',
  'category',
  'dyn',
  'my-fridge',
  'new',
  'private',
]);

const RECIPE_DETAIL_PATTERN = /^(?:\/(?:en|ja))?\/recipes\/([^/]+)\/?$/;

export const isRecipeDetailPath = (pathname: string): boolean => {
  const match = RECIPE_DETAIL_PATTERN.exec(pathname);
  if (!match) return false;
  return !RESERVED_SEGMENTS.has(match[1]);
};
