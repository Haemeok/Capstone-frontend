export const SITE_ORIGIN = "https://www.recipio.kr";

export const absoluteUrl = (path: string): string =>
  `${SITE_ORIGIN}/${path.replace(/^\/+/, "")}`;

export const BASE_URL = `${SITE_ORIGIN}/`;
export const BASE_API_URL = "https://api.recipio.kr/api";
export const BASE_WEBSOCKET_URL = "https://api.recipio.kr";

export const END_POINTS = {
  RECIPE: (id: string) => `/dev/recipes/${id}`,
  RECIPES: "/dev/recipes",
  RECIPES_SIMPLE: "/recipes/simple",
  RECIPE_SEARCH: "/dev/recipes/search",
  RECIPE_FILTER: "/recipes/filter",
  RECIPE_BUDGET: "/dev/recipes/budget",
  RECIPE_POPULAR: "/dev/recipes/popular",
  RECIPES_BY_CATEGORY: (categorySlug: string) =>
    `/recipes/category/${categorySlug}`,
  RECIPE_YOUTUBE_META: "/recipes/youtube/meta",
  RECIPE_YOUTUBE_RECOMMEND: "/recipes/youtube/recommend",
  INGREDIENTS: "/ingredients",
  SEARCH_INGREDIENTS: "/dev/search/ingredients",
  INGREDIENTS_BY_ID: (id: string) => `/dev/ingredients/${id}`,
  RECIPE_COMMENT: (id: string) => `/dev/recipes/${id}/comments`,
  RECIPE_COMMENT_BY_ID: (recipeId: string, commentId: string) =>
    `/dev/recipes/${recipeId}/comments/${commentId}`,
  RECIPE_REPLY: (recipeId: string, commentId: string) =>
    `/dev/recipes/${recipeId}/comments/${commentId}/replies`,
  COMMENT_IMAGE_UPLOAD_URLS: (recipeId: string) =>
    `/dev/recipes/${recipeId}/comments/image-upload-urls`,
  RECIPE_LIKE: (id: string) => `/dev/recipes/${id}/like`,
  COMMENT_LIKE: (id: string) => `/dev/comments/${id}/like`,
  RECIPE_FAVORITE: (id: string) => `/dev/recipes/${id}/favorite`,
  RECIPE_SAVE: (id: string) => `/dev/recipes/${id}/favorite`, // 동일 endpoint, 마이그레이션용 alias
  RECIPE_SAVED_BOOKS: (recipeId: string) =>
    `/dev/recipes/${recipeId}/saved-books`,
  RECIPE_BOOKS: "/dev/me/recipe-books",
  RECIPE_BOOK: (bookId: string) => `/dev/me/recipe-books/${bookId}`,
  RECIPE_BOOK_RECIPES: (bookId: string) =>
    `/dev/me/recipe-books/${bookId}/recipes`,
  RECIPE_BOOK_ORDER: "/dev/me/recipe-books/order",
  RECIPE_VISIBILITY: (id: string) => `/bff/recipes/${id}/visibility`,
  RECIPE_RECOMMENDATIONS: (id: string) => `/dev/recipes/${id}/recommendations`,
  RECIPE_REMIXES: (id: string) => `/dev/recipes/${id}/remixes`,
  RECIPE_SAME_INGREDIENT: (id: string) => `/dev/recipes/${id}/same-ingredient`,
  RECIPE_TITLE_KEYWORD: (id: string) => `/dev/recipes/${id}/title-keyword`,
  RECIPE_FINALIZE: (id: string) => `/dev/recipes/${id}/finalize`,
  GOOGLE_LOGIN: `/oauth2/authorization/google`,
  KAKAO_LOGIN: `/api/auth/login/kakao`,
  NAVER_LOGIN: `/api/auth/login/naver`,
  TOKEN_REFRESH: "/token/refresh",
  USER_INFO: (userId: string) => `/users/${userId}`,
  MY_FAVORITES: "/dev/me/favorites",
  MY_INGREDIENT_RECIPES: "/dev/me/fridge/recipes",
  MY_INFO: "/me",
  MY_INFO_DEV: "/dev/me",
  PREFERRED_LOCALE: "/me/preferred-locale",
  REFERRAL_INFO: "/me/referral",
  REFERRAL_REDEEM: "/me/referral/redemptions",
  MY_INGREDIENTS: "/me/fridge/items",
  MY_INGREDIENTS_BY_ID: (id: string) => `/me/fridge/items/${id}`,
  MY_INGREDIENTS_BULK: "/me/fridge/items/bulk",
  MY_INGREDIENTS_IDS: "/me/fridge/items/ids",
  USER_RECIPES: (id: string) => `/dev/users/${id}/recipes`,
  USER_STREAK: "/me/streak",
  USER_PRESIGNED_URLS: (userId: string) =>
    `/users/${userId}/profile-image/presign`,
  RECIPE_HISTORY: "/dev/me/calendar",
  RECORDS_TIMELINE: "/dev/me/records/timeline",
  MY_RECORDS: "/dev/me/records",
  MY_RECORD: (recordId: string) => `/dev/me/records/${recordId}`,
  RATING: (recipeId: string) => `/dev/ratings/recipe/${recipeId}`,
  RECIPE_REPORTS: (recipeId: string) => `/dev/recipes/${recipeId}/reports`,
  LOGOUT: "/token/logout",
  DELETE_ACCOUNT: "/me",
  RECIPES_BY_TAG: () => "/recipes/by-tag",
  MY_SURVEY: "/me/survey",
  GOOGLE_LOGIN_API_ROUTE: "/api/auth/login/google",
  APPLE_LOGIN: "/api/auth/login/apple",
  CHAT: (recipeId: string) => `/recipes/${recipeId}/chat`,
  CHAT_QUOTA: "/chat/quota",
  // Curation Articles
  CURATION_ARTICLES: "/curation-articles",
  CURATION_ARTICLE: (slug: string) => `/curation-articles/${slug}`,
  ADMIN_CURATION_ARTICLES: "/admin/curation-articles",
  ADMIN_CURATION_ARTICLE_PUBLISH: (id: number) =>
    `/admin/curation-articles/${id}/publish`,
  RECIPE_COOKED_POPULAR: "/recipes/cooked-popular",
  RECIPE_COUNTRY_POPULAR: "/recipes/country-popular",
  MY_FRIDGE_INGREDIENT_POPULAR: "/me/fridge/recipes/ingredient-popular",
  MY_RECIPES_COOKED_AGAIN: "/me/recipes/cooked-again",
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
