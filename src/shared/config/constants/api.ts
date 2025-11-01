export const BASE_URL = "https://www.recipio.kr/";
export const BASE_API_URL = "https://api.recipio.kr/api";
export const BASE_WEBSOCKET_URL = "https://api.recipio.kr";
const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? "https://www.recipio.kr/login/oauth2/code/google"
    : "http://localhost:3000/login/oauth2/code/google";

export const END_POINTS = {
  RECIPE: (id: number) => `/recipes/${id}`,
  RECIPES: "/recipes",
  RECIPES_SIMPLE: "/recipes/simple",
  RECIPE_SEARCH: "/recipes/search",
  RECIPE_FILTER: "/recipes/filter",
  RECIPE_BUDGET: "/recipes/budget",
  RECIPE_POPULAR: "/recipes/popular",
  RECIPES_BY_CATEGORY: (categorySlug: string) =>
    `/recipes/category/${categorySlug}`,
  INGREDIENTS: "/ingredients",
  SEARCH_INGREDIENTS: "/search/ingredients",
  INGREDIENTS_BY_ID: (id: number) => `/ingredients/${id}`,
  RECIPE_COMMENT: (id: number) => `/recipes/${id}/comments`,
  RECIPE_COMMENT_BY_ID: (recipeId: number, commentId: number) =>
    `/recipes/${recipeId}/comments/${commentId}`,
  RECIPE_REPLY: (recipeId: number, commentId: number) =>
    `/recipes/${recipeId}/comments/${commentId}/replies`,
  RECIPE_LIKE: (id: number) => `/recipes/${id}/like`,
  COMMENT_LIKE: (id: number) => `/comments/${id}/like`,
  RECIPE_FAVORITE: (id: number) => `/recipes/${id}/favorite`,
  RECIPE_VISIBILITY: (id: number) => `/recipes/${id}/private`,
  RECIPE_FINALIZE: (id: number) => `/recipes/${id}/finalize`,
  GOOGLE_LOGIN: `/oauth2/authorization/google`,
  KAKAO_LOGIN: `/api/auth/login/kakao`,
  NAVER_LOGIN: `/api/auth/login/naver`,
  GOOGLE_REDIRECT_URI: REDIRECT_URI,
  KAKAO_REDIRECT_URI: `${BASE_URL}/login/oauth2/code/kakao`,
  NAVER_REDIRECT_URI: `${BASE_URL}/login/oauth2/code/naver`,
  TOKEN_REFRESH: "/token/refresh",
  USER_INFO: (userId: number) => `/users/${userId}`,
  MY_FAVORITES: "/me/favorites",
  MY_INGREDIENT_RECIPES: "/me/fridge/recipes",
  MY_INFO: "/me",
  MY_INGREDIENTS: "/me/fridge/items",
  MY_INGREDIENTS_BY_ID: (id: number) => `/me/fridge/items/${id}`,
  MY_INGREDIENTS_BULK: "/me/fridge/items/bulk",
  USER_RECIPES: (id: number) => `/users/${id}/recipes`,
  USER_STREAK: "/me/streak",
  PRESIGNED_URLS: "/recipes/presigned-urls",
  USER_PRESIGNED_URLS: (userId: number) =>
    `/users/${userId}/profile-image/presign`,
  RECIPE_HISTORY: "/me/calendar",
  RATING: (recipeId: number) => `/ratings/recipe/${recipeId}`,
  LOGOUT: "/token/logout",
  RECIPES_BY_TAG: () => "/recipes/by-tag",
  MY_SURVEY: "/me/survey",
  GOOGLE_LOGIN_API_ROUTE: "/api/auth/login/google",
};

export const USER_ERROR_MESSAGE = {
  E500: "인증 정보가 올바르지 않습니다. 다시 시도해 주세요.",
  E501: "로그인 정보가 유효하지 않습니다. 새로 로그인해 주세요.",
  E502: "로그인 세션이 만료되었습니다. 다시 로그인해 주세요.",
  E510: "권한이 없습니다. 관리자에게 문의하세요.",
  E601: "필수 입력값이 누락되었습니다. 입력을 확인해 주세요.",
  E661: "요청하신 배너를 찾을 수 없습니다.",
  E401: "해당 코스를 찾을 수 없습니다.",
  E402: "코스에 요청한 장소가 포함되지 않았습니다.",
  E404: "추가하려는 장소가 올바르지 않습니다. 다시 확인해 주세요.",
  E405: "장소 순서가 올바르지 않습니다. 다시 시도해 주세요.",
  E406: "해당 코스를 수정할 권한이 없습니다.",
  E301: "해당 지도를 찾을 수 없습니다.",
  E302: "지도의 요청한 장소를 찾을 수 없습니다.",
  E303: "해당 장소가 이미 존재합니다.",
  E304: "유효하지 않은 지도입니다. 다시 확인해 주세요.",
  E201: "요청한 장소를 찾을 수 없습니다.",
  E999: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  E900: "양식이 잘못 되었습니다. 다시 확인해 주세요.",
};

export const PAGE_SIZE = 10;
