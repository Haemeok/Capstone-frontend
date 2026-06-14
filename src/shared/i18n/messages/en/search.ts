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
  heading: "Something went wrong",
  retry: "Try again",
  goHome: "Go home",
  goBack: "Go back",
  sectionMessage: "Couldn't load this section",
  sectionRetry: "Retry",
  context: {
    recipe: "Couldn't load this recipe",
    search: "Couldn't load search results",
    ingredients: "Couldn't load ingredients",
    edit: "Couldn't load the recipe editor",
    generic: "Please try again in a moment",
  },
};

export const notFound: NotFoundDict = {
  message: "We couldn't find that recipe.",
  searchCta: "Browse recipes",
  goBack: "Go back",
  goHome: "Go home",
  recipe: {
    title: "Recipe not found",
    description:
      "This recipe was deleted or doesn't exist. Want to find another?",
  },
  generic: {
    title: "Page not found",
    description: "The page you're looking for doesn't exist.",
  },
};
