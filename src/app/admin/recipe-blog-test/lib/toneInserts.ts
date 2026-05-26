import type { StaticRecipe } from "@/entities/recipe/model/types";

export type BlogTone =
  | "epigung"
  | "ellymom"
  | "elarpi"
  | "minnie46"
  | "haetsal";

type PerServing = {
  cal: number;
  cost: number;
  pro: number;
  sod: number;
};

const computePerServing = (r: StaticRecipe): PerServing => {
  const s = Math.max(r.servings || 1, 1);
  const n = r.nutrition;
  return {
    cal: Math.round((r.totalCalories || 0) / s),
    cost: Math.round((r.totalIngredientCost || 0) / s),
    pro: Math.round((n?.protein || 0) / s),
    sod: Math.round((n?.sodium || 0) / s),
  };
};

const won = (n: number) => `${n.toLocaleString()}원`;

export const toneHeading = (
  tone: BlogTone,
  index: number,
  title: string,
): string => {
  switch (tone) {
    case "epigung":
    case "ellymom":
    case "minnie46":
    case "haetsal":
      return `${index + 1}. ${title}`;
    case "elarpi":
      return `+ ${title}`;
  }
};

export type SectionFragments = {
  beforeBody: string;
  afterBody: string;
};

export const buildSectionFragments = (
  tone: BlogTone,
  recipe: StaticRecipe,
): SectionFragments => {
  const ps = computePerServing(recipe);
  const servings = Math.max(recipe.servings || 1, 1);
  const totalCost = won(ps.cost * servings);
  const id = recipe.id;
  const title = recipe.title;

  switch (tone) {
    case "epigung": {
      const nutLine = `**1인분 ${ps.cal}kcal · 단백질 ${ps.pro}g · ${won(ps.cost)}** (${servings}인분 ${totalCost})`;
      const afterBody = [
        `{{recipe:${id}}}`,
        "",
        nutLine,
        "",
        `**👇 ${title} 👇**`,
        "",
        `자세한 만드는 법은 아래에 정리해뒀어요~`,
        "",
        `{{link:${id}}}`,
      ].join("\n");
      return { beforeBody: "", afterBody };
    }
    case "ellymom": {
      const beforeBody = `> 1인분 ${ps.cal}kcal · 단백질 ${ps.pro}g · 나트륨 ${ps.sod}mg · ${won(ps.cost)}`;
      const afterBody = [
        `{{recipe:${id}}}`,
        "",
        `자세한 만드는 법은 아래에 정리해두었어요 .`,
        "",
        `{{link:${id}}}`,
      ].join("\n");
      return { beforeBody, afterBody };
    }
    case "elarpi": {
      const nutLine = `1인분 ${ps.cal}kcal · 단백질 ${ps.pro}g · ${won(ps.cost)} (${servings}인분 ${totalCost})`;
      const afterBody = [
        `{{recipe:${id}}}`,
        "",
        nutLine,
        "",
        `자세한 레시피는 아래에 따로 정리해뒀어요.`,
        "",
        `{{link:${id}}}`,
      ].join("\n");
      return { beforeBody: "", afterBody };
    }
    case "minnie46": {
      const nutLine = `1인분 ${ps.cal}kcal · 단백질 ${ps.pro}g · ${won(ps.cost)} (${servings}인분 ${totalCost})`;
      const afterBody = [
        `{{recipe:${id}}}`,
        "",
        nutLine,
        "",
        `자세한 만드는 법은 아래에서 확인해 보세요.`,
        "",
        `{{link:${id}}}`,
      ].join("\n");
      return { beforeBody: "", afterBody };
    }
    case "haetsal": {
      const nutLine = `1인분 ${ps.cal}kcal · 단백질 ${ps.pro}g · ${won(ps.cost)}`;
      const afterBody = [
        `{{recipe:${id}}}`,
        "",
        nutLine,
        "",
        `자세한 레시피 보러 가기`,
        "",
        `⬇️ ⬇️ ⬇️`,
        "",
        `{{link:${id}}}`,
      ].join("\n");
      return { beforeBody: "", afterBody };
    }
  }
};

export const buildOutroSuffix = (tone: BlogTone, slug: string): string => {
  const url = `https://recipio.kr/curation/${slug}`;
  switch (tone) {
    case "epigung":
      return `전체 모음은 ${url} 에 정리해뒀으니 한번 둘러보시면 좋아요~`;
    case "ellymom":
      return `전체 모음은 ${url} 에 정리해두었어요 .`;
    case "elarpi":
      return `전체 모음은 ${url} 에 정리해뒀어요.`;
    case "minnie46":
      return `전체 모음은 ${url} 에서 한 번에 보실 수 있어요.`;
    case "haetsal":
      return `각 레시피도 함께 참고해 보세요. 전체 모음은 ${url} 에 정리해두었어요.`;
  }
};
