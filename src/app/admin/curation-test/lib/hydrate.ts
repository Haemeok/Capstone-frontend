export type HydratableRecipe = {
  id: string;
  title: string;
  imageUrl: string;
  youtubeUrl: string;
};

export const hydrateMarkdown = (
  md: string,
  recipes: HydratableRecipe[],
): string => {
  const r = (i: string) => recipes[Number(i)];
  return md
    .replace(
      /\{\{img:(\d+)\}\}/g,
      (_, i) => `![${r(i).title}](${r(i).imageUrl})`,
    )
    .replace(
      /\{\{recipe:(\d+)\}\}/g,
      (_, i) => `[${r(i).title} →](/recipe/${r(i).id})`,
    )
    .replace(
      /\{\{yt:(\d+)\}\}/g,
      (_, i) => `[▶ ${r(i).title} 영상 보기](${r(i).youtubeUrl})`,
    );
};
