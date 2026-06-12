import type {
  ErrorsDict,
  MetaDict,
  NotFoundDict,
  SearchDict,
} from "../../types";

export const search: SearchDict = {
  lastPage: "You've reached the end.",
  noResults: "No recipes to show.",
};

export const meta: MetaDict = {
  search: {
    queryNoun: "",
    pageSuffix: " (page {page})",
    titleNoQuery: "Recipe Search Results{page} - Recipio",
    titleWithQuery: {
      one: "{q} — {count} recipe{page} | Recipio",
      other: "{q} — {count} recipes{page} | Recipio",
    },
    descNoQuery:
      "Filter by ingredients, calories, cook time, and more. Find the recipe that fits your day.",
    descWithQuery: {
      one: "Browse {count} {q} recipe. Compare ingredients, nutrition, and cook time at a glance.",
      other:
        "Browse {count} {q} recipes. Compare ingredients, nutrition, and cook time at a glance.",
    },
  },
};

export const errors: ErrorsDict = {
  sectionGeneric: "This section couldn't be loaded",
  video: "The video couldn't be loaded",
  comments: "Comments couldn't be loaded",
  ingredients: "Ingredient info couldn't be loaded",
  steps: "Cooking steps couldn't be loaded",
  searchResults: "Search results couldn't be displayed",
};

export const notFound: NotFoundDict = {
  message: "We couldn't find that recipe.",
  searchCta: "Browse recipes",
};
