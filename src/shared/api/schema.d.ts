export interface paths {
  "/api/me/preferred-locale": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations["updatePreferredLocale"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/ingredients/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getIngredientDetail_1"];
    /** Update ingredient */
    put: operations["update"];
    post?: never;
    /** Delete ingredient */
    delete: operations["delete_1"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}/images": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations["updateRecipeImageKeys"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/images": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations["updateRecipeImageKeys_1"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getRecipeDetail"];
    put: operations["updateRecipe"];
    post?: never;
    delete: operations["deleteRecipe"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getRecipeDetail_1"];
    put: operations["updateRecipe_1"];
    post?: never;
    delete: operations["deleteRecipe_1"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/recipe-books/order": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations["reorderBooks"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me/recipe-books/order": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations["reorderBooks_1"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipes/{recipeId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * 크롤링 레시피 수정
     * @description 관리자가 기존의 크롤링 레시피를 수정합니다.
     */
    put: operations["updateCrawledRecipe"];
    post?: never;
    /**
     * 크롤링 레시피 삭제
     * @description 관리자가 특정 크롤링 레시피를 삭제합니다.
     */
    delete: operations["deleteCrawledRecipe"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipes/{recipeId}/ingredients": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations["updateIngredientsBatch"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/curation-articles/{articleId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["get"];
    put: operations["update_1"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/curation-articles/{articleId}/translations/{locale}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put: operations["upsertTranslation"];
    post?: never;
    delete: operations["deleteTranslation"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/login/oauth2/code/{provider}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["oauthCallback"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/ws-ticket": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["issueWebSocketTicket"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/webhooks/lemonsqueezy": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["handleLemonSqueezyWebhook"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/token/test-login": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 애플 심사용 테스트 로그인
     * @description 특정 계정으로 즉시 로그인하여 토큰을 발급합니다.
     */
    post: operations["testLogin"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/token/refresh": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["refreshAccessToken"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/token/logout": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 로그아웃
     * @description 현재 기기의 Refresh Token을 삭제하고 쿠키를 제거합니다.
     */
    post: operations["logout"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/token/logout/all": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["logoutAll"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/test/recipes/{recipeId}/reactions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["addReactions"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/nutrition": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 레시피 영양 정보 재계산 */
    post: operations["recalculateNutrition"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/comments/image-upload-urls": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["issueImagePresignedUrls"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/chat": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["chat"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/chat/feedback": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["feedback"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/analyze": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 레시피 AI 분석 수동 요청 */
    post: operations["analyzeRecipeManually"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/opensearch/swap-recipes-alias": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["swapRecipesAlias"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/opensearch/reindex-recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["reindexAllRecipes"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/opensearch/ingredients/index": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["recreateIngredientsIndex"];
    /**
     * 재료 인덱스 삭제
     * @description 'ingredients' 인덱스를 삭제합니다.
     */
    delete: operations["deleteIngredientsIndex"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/opensearch/create-recipes-index": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["createRecipesIndex"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/opensearch/create-ingredients-index": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["createIngredientsIndex"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/notifications/read-all": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["markAllRead"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/survey": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 내 설문조사 정보 조회 */
    get: operations["getMySurvey"];
    put?: never;
    /** 내 설문조사 저장 또는 수정 */
    post: operations["saveMySurvey"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/referral/redemptions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Redeem a referral code */
    post: operations["redeem"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/fridge/items": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMyItems"];
    put?: never;
    /**
     * 냉장고에 재료 추가
     * @description 내 냉장고에 새로운 재료를 추가합니다.
     */
    post: operations["addItem"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/fridge/items/bulk": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 냉장고에 재료 여러 개 추가
     * @description 냉장고에 재료를 여러 개 한 번에 추가합니다.
     */
    post: operations["addItemsBulk"];
    /**
     * 냉장고에서 재료 여러 개 제거
     * @description 냉장고에서 재료를 여러 개 한 번에 제거합니다.
     */
    delete: operations["removeItemsBulk"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/logs/click": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["trackClick"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/ingredients": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Search ingredients */
    get: operations["search_1"];
    put?: never;
    /** Create ingredient */
    post: operations["create"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/ingredients/units/batch": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** List ingredient units in batch */
    post: operations["getIngredientUnitsBatch"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/reports": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["reportIngredient"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}/reports": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["reportIngredient_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}/presigned-urls": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["getPresignedUrlsForUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/presigned-urls": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["getPresignedUrlsForUpdate_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}/finalize": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["finalizeRecipeImages"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/finalize": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["finalizeRecipeImages_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}/comments/{parentId}/replies": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["createReply"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/comments/{parentId}/replies": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["createReply_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}/comments": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getAllComments"];
    put?: never;
    post: operations["createComment"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/comments": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getAllComments_1"];
    put?: never;
    post: operations["createComment_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{id}/like": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["toggleLike"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{id}/like": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["toggleLike_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{id}/favorite": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["toggleFavorite"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{id}/favorite": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["toggleFavorite_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/youtube/extract": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["extractYoutubeRecipe"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/youtube/extract": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["extractYoutubeRecipe_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/status": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["getBatchStatuses"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/status": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["getBatchStatuses_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/ai": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["generateAiRecipe"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/ai": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["generateAiRecipe_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["createRecipe"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["createRecipe_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/ratings/recipe/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["rateRecipe"];
    delete: operations["deleteRating"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/ratings/recipe/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["rateRecipe_1"];
    delete: operations["deleteRating_1"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me/records": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["createRecord"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/records": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["createRecord_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me/recipe-books/{bookId}/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["addRecipes"];
    delete: operations["removeRecipes"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/recipe-books/{bookId}/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["addRecipes_1"];
    delete: operations["removeRecipes_1"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me/recipe-books": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["listBooks"];
    put?: never;
    post: operations["createBook"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/recipe-books": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["listBooks_1"];
    put?: never;
    post: operations["createBook_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/comments/{commentId}/like": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["toggleLike_2"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/comments/{commentId}/like": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["toggleLike_3"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/youtube-metadata/backfill-missing-channel": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Backfill missing YouTube channel metadata and creator country */
    post: operations["backfillMissingChannel"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/youtube-creator-country/backfill": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Backfill YouTube creator country by distinct channel */
    post: operations["backfill"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/users": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 전체 사용자 목록 조회
     * @description 관리자가 모든 사용자 계정 목록을 조회합니다.
     */
    get: operations["getAllUsers"];
    put?: never;
    post: operations["createUser"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/users/tokens/bulk-give": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["bulkGiveToken"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 크롤링 레시피 단건 등록
     * @description 관리자가 단일 크롤링 레시피를 저장합니다.
     */
    post: operations["createCrawledRecipe"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipes/{recipeId}/regenerate-image": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["regenerateRecipeImage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipes/{recipeId}/enhance-fallback-ingredients": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["enhanceFallbackIngredients"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipes/with-images": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["createCrawledRecipeWithPresignedUrls"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipes/bulk": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["createCrawledRecipesInBulk"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipe-sitemaps/refresh": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Refresh recipe sitemap snapshots */
    post: operations["refresh"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipe-import/sync": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Sync S3 persona recipe files into import queue */
    post: operations["sync"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipe-import/schedule": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Schedule READY persona recipes across active hours */
    post: operations["schedule"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipe-import/process-due": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Process due SCHEDULED persona recipes */
    post: operations["processDue"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/ingredients/popularity": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["updateIngredientPopularity"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/recipe-translations/title-norm-backfill": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["backfillTitleNorm"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/recipe-translations/run": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["run"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/recipe-translations/run-ids": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["runByIds"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/recipe-translations/reset-failed": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["resetFailed"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/ingredient-translations/run": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["run_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/curation-translations/run": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["run_2"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/curation-translations/run-ids": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["runByIds_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/curation-translations/reset-failed": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["resetFailed_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/comment-translations/run": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["run_3"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/comment-translations/reset-failed": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["resetFailed_2"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/grant-all-welcome": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["grantWelcomeCreditToAllUsers"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/curation-articles": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["list_1"];
    put?: never;
    post: operations["create_1"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/curation-articles/{articleId}/review": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["review"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/curation-articles/{articleId}/publish": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["publish"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/curation-articles/{articleId}/images/presigned-urls": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["issueImagePresignedUrl"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/curation-articles/{articleId}/images/finalize": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["finalizeImages"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/curation-articles/{articleId}/archive": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 아티클 아카이브
     * @description status=ARCHIVED (idempotent).
     */
    post: operations["archive"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/coupang/update/{ingredientId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["updateIngredientLink"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/coupang/deeplink": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["generateDeepLink"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/coupang/batch/ingredients": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["runIngredientBatch"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/coupang/batch/custom-ingredients": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["runCustomIngredientBatch"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/users/{userId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get public user profile */
    get: operations["getUserProfile"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** Update user profile */
    patch: operations["patchUser"];
    trace?: never;
  };
  "/api/recipes/{recipeId}/comments/{commentId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations["deleteComment_1"];
    options?: never;
    head?: never;
    /** 댓글 수정 */
    patch: operations["updateComment"];
    trace?: never;
  };
  "/api/notifications/{id}/read": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations["markRead"];
    trace?: never;
  };
  "/api/notification-preferences/{type}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations["update_2"];
    trace?: never;
  };
  "/api/me": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMe"];
    put?: never;
    post?: never;
    /** 내 계정 삭제 */
    delete: operations["deleteMyAccount"];
    options?: never;
    head?: never;
    /** 내 프로필 수정 */
    patch: operations["patchMyProfile"];
    trace?: never;
  };
  "/api/recipes/{recipeId}/visibility": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations["updateVisibility"];
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}/visibility": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations["updateVisibility_1"];
    trace?: never;
  };
  "/api/dev/me/recipe-books/{bookId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getBookDetail"];
    put?: never;
    post?: never;
    delete: operations["deleteBook"];
    options?: never;
    head?: never;
    patch: operations["renameBook"];
    trace?: never;
  };
  "/api/me/recipe-books/{bookId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getBookDetail_1"];
    put?: never;
    post?: never;
    delete: operations["deleteBook_1"];
    options?: never;
    head?: never;
    patch: operations["renameBook_1"];
    trace?: never;
  };
  "/api/youtube-channels/{channelId}/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["channelRecipes"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/youtube-channels/rankings": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["rankings"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/users/{userId}/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getUserRecipes"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/users/{userId}/profile-image/presign": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Create profile image presigned URL */
    get: operations["presignProfileImage"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/tags": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 태그 목록 조회
     * @description 태그 목록을 조회합니다.
     */
    get: operations["getAllTags"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/search/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["searchRecipes"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/search/recipes/suggest": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["suggestRecipes"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/remixes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getRemixes"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/chat/history": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getHistory"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{id}/title-keyword": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getTitleKeywordRecipes"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{id}/same-ingredient": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getSameIngredientRecipes"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{id}/recommendations": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getRecommendations"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/youtube/recommend": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** YouTube 레시피 영상 추천 */
    get: operations["getRecommendedRecipes"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/youtube-verified": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["youtubeVerified"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/sitemap": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 한국어 sitemap 레시피 목록 */
    get: operations["getRecipesForSitemap"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/sitemap/ja": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 일본어 sitemap 레시피 목록 */
    get: operations["getRecipesForSitemapJa"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/sitemap/en": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 영어 sitemap 레시피 목록 */
    get: operations["getRecipesForSitemapEn"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/seasonal-popular": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["seasonalPopular"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/search": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["search"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/reports": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List recipe ingredient reports */
    get: operations["getAllReports"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/quick-popular": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["quickPopular"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/popular": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["popular"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/country-popular": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["countryPopular"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/cooked-popular": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["cookedPopular"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/category-popular": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["categoryPopular"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/budget": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["budget"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/protected": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["protectedResource"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/products": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getProducts"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/notifications": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getAll"];
    put?: never;
    post?: never;
    delete: operations["deleteAll"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/notifications/unread-count": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getUnreadCount"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/notification-preferences": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getPreferences"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/streak": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 요리 연속 기록 조회 */
    get: operations["getMyCookingStreak"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/referral": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get my referral status */
    get: operations["getMyReferral"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMyRecipes"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/recipes/cooked-again": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["cookedAgain"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/fridge/recipes/ingredient-popular": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["fridgeIngredientPopular"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/fridge/items/ids": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMyIngredientIds"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/favorites": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMyFavorites"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/logs/stats": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getStats"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/ingredients/{id}/units": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List ingredient units */
    get: operations["getIngredientUnits"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/ingredients/sitemap": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List ingredient sitemap rows */
    get: operations["sitemap"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/ingredients/names": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List ingredient names by IDs */
    get: operations["getIngredientNames"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/health": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["health"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dish-types": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 디사타입 목록 조회
     * @description 디사타입 목록을 조회합니다.
     */
    get: operations["getAllDishTypes"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/users/{userId}/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getUserRecipes_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/search/ingredients": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["searchIngredients"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/search/ingredients": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["searchIngredients_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}/remixes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getRemixes_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{recipeId}/comments/{commentId}/replies": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getCommentWithReplies"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}/comments/{commentId}/replies": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getCommentWithReplies_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{id}/title-keyword": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getTitleKeywordRecipes_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{id}/status": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getDetailStatus"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{id}/status": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getDetailStatus_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/{id}/saved-books": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getSavedBooks"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{id}/saved-books": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getSavedBooks_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{id}/same-ingredient": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getSameIngredientRecipes_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{id}/recommendations": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getRecommendations_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/youtube/status/{jobId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getYoutubeJobStatus"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/youtube/status/{jobId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getYoutubeJobStatus_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/youtube/check": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["check"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/youtube/check": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["check_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/search": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["search_2"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/popular": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["popular_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/budget": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["budget_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/ai/status/{jobId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getAiJobStatus"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/recipes/ai/status/{jobId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getAiJobStatus_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/ratings/recipe/{id}/me": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMyRating"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/ratings/recipe/{id}/me": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMyRating_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me/records/{recordId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getRecordDetail"];
    put?: never;
    post?: never;
    delete: operations["deleteRecord"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/records/{recordId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getRecordDetail_1"];
    put?: never;
    post?: never;
    delete: operations["deleteRecord_1"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/records/timeline": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getRecordFeed"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me/records/timeline": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getRecordFeed_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMyRecipes_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me/fridge/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["findByFridge"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/fridge/recipes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["findByFridge_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me/favorites": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMyFavorites_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/calendar": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["monthSummary_2"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me/calendar": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["monthSummary_1_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/me": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMe_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/ingredients/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getIngredientDetail"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/curation-articles": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["list"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/curation-articles/{slug}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getBySlug"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/curation-articles/{slug}/recommendations": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["recommendations"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/curation-articles/sitemap": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["sitemap_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/curation-articles/sitemap/ja": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["sitemapJa"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/curation-articles/sitemap/en": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["sitemapEn"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/credits/history": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getMyCreditHistory"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/chat/quota": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getQuota"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/users/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 특정 사용자 조회
     * @description 관리자가 특정 사용자 계정 정보를 조회합니다.
     */
    get: operations["getUser"];
    put?: never;
    post?: never;
    /**
     * 사용자 삭제
     * @description 관리자가 특정 사용자 계정을 하드 삭제합니다.
     */
    delete: operations["deleteUser"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipe-sitemaps/status": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Recipe sitemap snapshot status */
    get: operations["status"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/recipe-import/stats": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get recipe import queue stats */
    get: operations["stats"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/recipe-translations/status": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["status_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/recipe-translations/failures": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["failures"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/ingredient-translations/status": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["status_2"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/curation-translations/status": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["status_3"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/curation-translations/failures": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["failures_1"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/i18n/comment-translations/status": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["status_4"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/admin/curation-articles/{articleId}/translations": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["listTranslations"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["home"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/opensearch/index/{name}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /**
     * 지정 인덱스 삭제
     * @description 지정한 이름의 인덱스를 삭제합니다.
     */
    delete: operations["deleteIndexByName"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/notifications/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations["delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/me/fridge/items/{ingredientId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /**
     * 냉장고에서 재료 제거
     * @description 냉장고에서 특정 재료를 제거합니다.
     */
    delete: operations["removeItem"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/dev/recipes/{recipeId}/comments/{commentId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations["deleteComment"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    PreferredLocaleRequest: {
      locale: string;
    };
    IngredientRequestDto: {
      name: string;
      category?: string;
      imageUrl?: string;
      /** Format: int32 */
      price?: number;
      unit?: string;
    };
    IngredientResponseDto: {
      /** Format: int64 */
      id?: number;
      name?: string;
      category?: string;
      imageUrl?: string;
      /** Format: int32 */
      price?: number;
      unit?: string;
      inFridge?: boolean;
    };
    RecipeImageKeyUpdateRequest: {
      imageKey?: string;
      stepImageKeys?: string[];
    };
    FileInfoRequest: {
      contentType?: string;
      type?: string;
      /** Format: int32 */
      stepIndex?: number;
    };
    RecipeIngredientRequestDto: {
      name?: string;
      quantity?: string;
      customPrice?: number;
      customCalories?: number;
      customCarbohydrate?: number;
      customProtein?: number;
      customFat?: number;
      customSugar?: number;
      customSodium?: number;
      isEstimated?: boolean;
      sourceRef?: string | null;
      customByUser?: boolean | null;
      unit?: string;
    };
    /** @description 레시피 총 영양성분 */
    RecipeNutritionDto: {
      /** @description 단백질 (g) */
      protein?: number;
      /** @description 탄수화물 (g) */
      carbohydrate?: number;
      /** @description 지방 (g) */
      fat?: number;
      /** @description 당류 (g) */
      sugar?: number;
      /** @description 나트륨 (mg) */
      sodium?: number;
    };
    RecipeStepIngredientRequestDto: {
      name?: string;
      quantity?: string;
      customUnit?: string;
      customName?: string;
    };
    RecipeStepRequestDto: {
      /** Format: int32 */
      stepNumber?: number;
      instruction?: string;
      imageKey?: string;
      action?: string;
      timeline?: string;
      ingredients?: components["schemas"]["RecipeStepIngredientRequestDto"][];
    };
    RecipeUpdateRequestDto: {
      title?: string;
      description?: string;
      cookingTips?: string;
      dishType?: string;
      /** Format: int32 */
      cookingTime?: number;
      imageKey?: string;
      youtubeUrl?: string;
      cookingTools?: string[];
      /** Format: int32 */
      servings?: number;
      /** Format: int32 */
      totalIngredientCost?: number;
      /** Format: int32 */
      marketPrice?: number;
      isPrivate?: boolean;
      nutrition?: components["schemas"]["RecipeNutritionDto"];
      ingredients?: components["schemas"]["RecipeIngredientRequestDto"][];
      steps?: components["schemas"]["RecipeStepRequestDto"][];
      tags?: string[];
      isIngredientsModified?: boolean;
    };
    RecipeUpdateWithImageRequest: {
      recipe?: components["schemas"]["RecipeUpdateRequestDto"];
      files?: components["schemas"]["FileInfoRequest"][];
    };
    PresignedUrlResponse: {
      /** Format: int64 */
      recipeId?: number;
      uploads?: components["schemas"]["PresignedUrlResponseItem"][];
    };
    PresignedUrlResponseItem: {
      fileKey?: string;
      presignedUrl?: string;
    };
    /** @description 레시피북 순서 변경 요청 */
    ReorderRecipeBooksRequest: {
      bookIds: number[];
    };
    /** @description 레시피북 응답 */
    RecipeBookResponse: {
      /**
       * Format: int64
       * @description 레시피북 ID
       */
      id?: number;
      /**
       * @description 레시피북 이름
       * @example 한식 모음
       */
      name?: string;
      /**
       * Format: int32
       * @description 표시 순서
       */
      displayOrder?: number;
      recipeCount?: number;
      default?: boolean;
    };
    ComponentResponseDto: {
      role?: string;
      name?: string;
      description?: string;
      process?: string[];
    };
    PlatingResponseDto: {
      vessel?: string;
      guide?: string;
      visualKeys?: string[];
      viewpoint?: string;
      lighting?: string;
    };
    RecipeCreateRequestDto: {
      isRecipe?: boolean;
      nonRecipeReason?: string;
      title: string;
      description?: string;
      cookingTips?: string;
      dishType: string;
      /** Format: int32 */
      cookingTime?: number;
      imageKey?: string;
      /** @enum {string} */
      imageStatus?: "PENDING" | "READY" | "FAILED";
      visibility?: "PUBLIC" | "PRIVATE" | "RESTRICTED";
      /** @enum {string} */
      lifecycleStatus?: "ACTIVE" | "HIDDEN" | "BANNED" | "DELETED";
      youtubeUrl?: string;
      youtubeChannelName?: string;
      youtubeChannelId?: string;
      youtubeVideoTitle?: string;
      youtubeThumbnailUrl?: string;
      youtubeChannelProfileUrl?: string;
      /** Format: int64 */
      youtubeSubscriberCount?: number;
      /** Format: int64 */
      youtubeVideoViewCount?: number;
      cookingTools?: string[];
      /** Format: int32 */
      servings?: number;
      /** Format: int32 */
      totalIngredientCost?: number;
      /** Format: int32 */
      marketPrice?: number;
      isPrivate?: boolean;
      /** Format: double */
      totalCalories?: number;
      nutrition?: components["schemas"]["RecipeNutritionDto"];
      ingredients?: components["schemas"]["RecipeIngredientRequestDto"][];
      steps?: components["schemas"]["RecipeStepRequestDto"][];
      tags?: string[];
      components?: components["schemas"]["ComponentResponseDto"][];
      plating?: components["schemas"]["PlatingResponseDto"];
      imageMatchKeywords?: string[];
      originRecipeId?: number;
    };
    AdminIngredientUpdateDto: {
      /** Format: int64 */
      id?: number;
      name?: string;
      quantity?: string;
      unit?: string;
      /** Format: int32 */
      price?: number;
      action?: string;
      calorie?: number;
      carbohydrate?: number;
      protein?: number;
      fat?: number;
      sugar?: number;
      sodium?: number;
    };
    /** @description 큐레이션 아티클 수정 요청 (slug 제외) */
    CurationArticleUpdateRequest: {
      /** @description 제목 */
      title: string;
      /** @description 메타 설명 */
      description?: string;
      coverImageKey?: string;
      /** @description 본문 MDX 원본 */
      contentMdx: string;
      /** @description 카테고리 */
      category?: string;
      /** @description 생성에 사용된 AI 모델 식별자 (재생성 시 갱신) */
      generatedBy?: string;
      /** @description 참조한 레시피 ID 목록 (HashID 문자열 배열) — 요청 값으로 전체 교체된다. */
      recipeIds?: string[];
    };
    /** @description 큐레이션 아티클 번역 저장 요청 */
    CurationArticleTranslationUpsertRequest: {
      /**
       * @description 번역된 제목
       * @example 夏のダイエットきゅうりレシピまとめ
       */
      title: string;
      description?: string;
      /** @description 번역된 본문 MDX */
      contentMdx: string;
      status?: string | null;
      model?: string | null;
    };
    CodeDto: {
      code?: string;
    };
    TokenResponseDTO: {
      accessToken?: string;
      refreshToken?: string;
    };
    ErrorResponse: {
      code?: string;
      message?: string;
      errorId?: string;
    };
    ReactionRequestDto: {
      /** Format: int32 */
      likeCount?: number;
      /** Format: int32 */
      ratingCount?: number;
    };
    /** @description 댓글 이미지 presigned URL 발급 요청 (1장이든 N장이든 항상 배열) */
    CommentImagePresignedUrlRequest: {
      /** @description 발급할 이미지 목록. 1장이어도 배열로 보낸다. */
      files: components["schemas"]["FileItem"][];
    };
    /** @description 개별 파일 정보 */
    FileItem: {
      contentType: string;
      fileSize: number;
    };
    /** @description 댓글 이미지 presigned URL 발급 응답 */
    CommentImagePresignedUrlResponse: {
      uploadKey?: string;
      imageKey?: string;
      /** @description uploadKey에 대한 presigned PUT URL. 10분간 유효. */
      presignedUrl?: string;
    };
    /** @description 레시피 챗봇 질문 요청 */
    ChatRequest: {
      /**
       * @description 유저 질문
       * @example 이거 매워요?
       */
      question: string;
      sessionId?: string | null;
    };
    /** @description 레시피 챗봇 응답 */
    ChatResponse: {
      answer?: string;
      intent?: "IN_SCOPE" | "OUT_OF_SCOPE" | "UNCLEAR" | "UNKNOWN";
      fromLlm?: boolean;
    };
    /** @description 챗봇 답변 만족도 피드백 요청 */
    ChatFeedbackRequest: {
      feedback: "GOOD" | "BAD";
      /**
       * @description 선택 코멘트
       * @example 분량이 정확해서 좋았어요
       */
      comment?: string | null;
    };
    UserSurveyDto: {
      /** Format: int32 */
      spiceLevel?: number;
      allergy?: string;
      tags?: string[];
    };
    ReferralRedeemRequest: {
      /** @example AB12CD34 */
      referralCode: string;
    };
    ReferralRedeemResponse: {
      /** @example 2026-07 */
      campaignKey?: string;
      /** @example true */
      rewardApplied?: boolean;
      /**
       * Format: date-time
       * @example 2026-08-10T04:20:00Z
       */
      adFreeUntil?: string;
    };
    RefrigeratorItemRequestDto: {
      /** Format: int64 */
      ingredientId: number;
    };
    RefrigeratorItemResponseDto: {
      /** Format: int64 */
      id?: number;
      ingredient?: components["schemas"]["IngredientResponseDto"];
      /** Format: date-time */
      createdAt?: string;
    };
    RefrigeratorItemBulkRequestDto: {
      ingredientIds: number[];
    };
    LogRequestDto: {
      action?: string;
      uuid?: string;
    };
    /** @description 여러 재료의 선택 가능한 단위 목록 조회 요청 */
    IngredientUnitsBatchRequest: {
      ingredientIds: number[];
    };
    /** @description 재료별 선택 가능한 단위 */
    IngredientUnitDto: {
      unit?: string;
      /**
       * @description 사용자 표시용 총중량 기준 g
       * @example 150
       */
      gramsPerUnit?: number;
      /**
       * @description 해당 재료의 기본 선택 단위 여부
       * @example true
       */
      isDefault?: boolean;
    };
    /** @description 여러 재료의 선택 가능한 단위 목록 조회 응답 */
    IngredientUnitsBatchResponse: {
      /** @description 입력 재료별 단위 목록 */
      items?: components["schemas"]["IngredientUnitsResponse"][];
    };
    /** @description 재료별 선택 가능한 단위 목록 */
    IngredientUnitsResponse: {
      /**
       * Format: int64
       * @description 재료 ID (HashID)
       */
      ingredientId?: number;
      /** @description 해당 재료에서 선택 가능한 단위 목록 */
      units?: components["schemas"]["IngredientUnitDto"][];
    };
    IngredientReportRequest: {
      ingredientName: string;
      /** @enum {string} */
      reason: "WRONG_QUANTITY" | "WRONG_NAME" | "NOT_EXIST" | "MISSING" | "ETC";
      memo?: string;
    };
    UpdatePresignedUrlRequest: {
      files?: components["schemas"]["FileInfoRequest"][];
    };
    UpdatePresignedUrlResponse: {
      uploads?: components["schemas"]["PresignedUrlResponseItem"][];
    };
    FinalizeResponse: {
      /** Format: int64 */
      recipeId?: number;
      activeImages?: string[];
      missingImages?: string[];
    };
    CommentRequestDto: {
      /** @description 댓글 본문 */
      content: string;
      /** @description 첨부 이미지 키 목록. presigned URL 발급 응답의 imageKey를 동봉. 미첨부 시 생략 또는 빈 배열. */
      imageKeys?: string[];
    };
    CommentUserDto: {
      /** Format: int64 */
      id?: number;
      nickname?: string;
      profileImage?: string;
    };
    ReplyDto: {
      /** Format: int64 */
      id?: number;
      content?: string;
      originalContent?: string;
      /** Format: date-time */
      createdAt?: string;
      /** Format: date-time */
      updatedAt?: string;
      author?: components["schemas"]["CommentUserDto"];
      /** Format: int32 */
      likeCount?: number;
      likedByCurrentUser?: boolean;
      imageUrls?: string[];
      sourceLocale?: string;
      translated?: boolean;
    };
    CommentDto: {
      /** Format: int64 */
      id?: number;
      content?: string;
      originalContent?: string;
      /** Format: date-time */
      createdAt?: string;
      /** Format: date-time */
      updatedAt?: string;
      author?: components["schemas"]["CommentUserDto"];
      /** Format: int32 */
      likeCount?: number;
      likedByCurrentUser?: boolean;
      /** Format: int32 */
      replyCount?: number;
      imageUrls?: string[];
      sourceLocale?: string;
      translated?: boolean;
    };
    /** @description 비동기 작업 ID 응답 */
    JobIdResponse: {
      /**
       * Format: int64
       * @description 생성된 작업 ID (암호화됨)
       */
      jobId?: number;
    };
    DevRecipeStatusRequest: {
      recipeIds?: number[];
    };
    /** @description Dev V3 레시피 목록용 사용자 특정 동적 정보 DTO */
    DevRecipeSimpleStatusDto: {
      /** @description 현재 로그인한 사용자가 좋아요를 눌렀는지 여부 */
      likedByCurrentUser?: boolean;
      /** @description 현재 로그인한 사용자가 즐겨찾기를 눌렀는지 여부 */
      favoriteByCurrentUser?: boolean;
    };
    AiRecipeRequestDto: {
      /** Format: int64 */
      userId?: number;
      dishType?: string;
      /** Format: int32 */
      cookingTime?: number;
      /** Format: double */
      servings?: number;
      tags?: string[];
      /** Format: int32 */
      spiceLevel?: number;
      allergy?: string;
      /** Format: int32 */
      targetBudget?: number;
      targetCategory?: string;
      targetCalories?: string;
      targetCarbs?: string;
      targetProtein?: string;
      targetFat?: string;
      targetStyle?: string;
      ingredientIds?: number[];
      /** @enum {string} */
      diningTier?: "BLACK" | "WHITE";
    };
    RecipeWithImageUploadRequest: {
      recipe?: components["schemas"]["RecipeCreateRequestDto"];
      files?: components["schemas"]["FileInfoRequest"][];
      aiRequest?: components["schemas"]["AiRecipeRequestDto"];
    };
    RecipeRatingRequestDto: {
      /** Format: double */
      rating?: number;
      comment?: string;
    };
    /** @description 레시피북에 레시피 추가 요청 (bulk) */
    AddRecipesToBookRequest: {
      /** @description 추가할 레시피 ID 목록 */
      recipeIds: number[];
    };
    /** @description 레시피북 레시피 추가 결과 */
    AddRecipesToBookResponse: {
      addedCount?: number;
      skippedCount?: number;
    };
    /** @description 레시피북 생성 요청 */
    CreateRecipeBookRequest: {
      /**
       * @description 레시피북 이름
       * @example 한식 모음
       */
      name: string;
    };
    AdminYoutubeMetadataBackfillRequest: {
      /** Format: int32 */
      limit?: number;
      dryRun?: boolean;
      resolveCreatorCountry?: boolean;
      /** Format: int32 */
      maxAiCalls?: number;
      retryFailed?: boolean;
    };
    AdminYoutubeMetadataBackfillResponse: {
      /** Format: int32 */
      limit?: number;
      dryRun?: boolean;
      resolveCreatorCountry?: boolean;
      /** Format: int32 */
      maxAiCalls?: number;
      retryFailed?: boolean;
      /** Format: int32 */
      selectedCount?: number;
      /** Format: int32 */
      processed?: number;
      /** Format: int32 */
      metadataFetched?: number;
      /** Format: int32 */
      recipeLegacyUpdated?: number;
      /** Format: int32 */
      youtubeInfoCreated?: number;
      /** Format: int32 */
      youtubeInfoUpdated?: number;
      /** Format: int32 */
      countryResolved?: number;
      /** Format: int32 */
      aiCalls?: number;
      /** Format: int32 */
      skipped?: number;
      /** Format: int32 */
      failed?: number;
      items?: components["schemas"]["Item"][];
    };
    Item: {
      /** Format: int64 */
      recipeId?: number;
      youtubeUrl?: string;
      /** Format: int64 */
      youtubeInfoId?: number;
      result?: string;
      channelId?: string;
      channelName?: string;
      /** @enum {string} */
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      creatorPrimaryCountryCode?: string;
      creatorCountryStatus?: string;
      creatorCountrySource?: string;
      message?: string;
    };
    AdminYoutubeCreatorCountryBackfillRequest: {
      /** Format: int32 */
      limit?: number;
      /** Format: int32 */
      maxAiCalls?: number;
      dryRun?: boolean;
      retryFailed?: boolean;
    };
    AdminYoutubeCreatorCountryBackfillResponse: {
      /** Format: int32 */
      limit?: number;
      /** Format: int32 */
      maxAiCalls?: number;
      dryRun?: boolean;
      retryFailed?: boolean;
      /** Format: int32 */
      selectedCount?: number;
      /** Format: int32 */
      processed?: number;
      /** Format: int32 */
      aiCalls?: number;
      /** Format: int32 */
      created?: number;
      /** Format: int32 */
      updated?: number;
      /** Format: int32 */
      skipped?: number;
      /** Format: int32 */
      failed?: number;
      items?: components["schemas"]["Item"][];
    };
    UserRequestDTO: {
      nickname: string;
      profileImage?: string;
      introduction?: string;
    };
    /** @description 광고 노출 상태 */
    AdStatusDto: {
      showAds?: boolean;
      adFreeUntil?: string | null;
    };
    UserResponseDTO: {
      /** Format: int64 */
      id?: number;
      nickname?: string;
      profileImage?: string;
      introduction?: string;
      /** Format: date-time */
      createdAt?: string;
      /** Format: date-time */
      updatedAt?: string;
      provider?: string;
      surveyCompleted?: boolean;
      hasFirstRecord?: boolean;
      /** Format: int32 */
      remainingAiQuota?: number;
      /** Format: int32 */
      remainingYoutubeQuota?: number;
      /** Format: int32 */
      aiToken?: number;
      /** Format: int32 */
      youtubeToken?: number;
      /** Format: int32 */
      subscriptionCredit?: number;
      /** Format: int32 */
      cashCredit?: number;
      adStatus?: components["schemas"]["AdStatusDto"];
      preferredLocale?: string;
    };
    BulkTokenRequest: {
      userIds?: number[];
      /** @enum {string} */
      type?: "AI_GENERATION" | "YOUTUBE_EXTRACTION";
      /** Format: int32 */
      amount?: number;
    };
    AdminRecipeFallbackEnhancementResponse: {
      /** Format: int64 */
      recipeId?: number;
      /** Format: int32 */
      ingredientCount?: number;
      /** Format: int32 */
      targetIngredientCount?: number;
      /** Format: int32 */
      updatedIngredientCount?: number;
      /** Format: int32 */
      previousMarketPrice?: number;
      /** Format: int32 */
      marketPrice?: number;
      /** Format: int32 */
      totalIngredientCost?: number;
      /** Format: int32 */
      totalIngredientCount?: number;
      totalCalories?: number;
      changed?: boolean;
      message?: string;
    };
    RecipeSitemapRefreshResponse: {
      results?: components["schemas"]["Result"][];
    };
    Result: {
      locale?: string;
      /** Format: int64 */
      entries?: number;
      /** Format: date-time */
      refreshedAt?: string;
      /** Format: int64 */
      elapsedMs?: number;
    };
    RecipeImportSyncRequest: {
      prefix?: string;
      dryRun?: boolean;
    };
    RecipeImportSyncResponse: {
      prefix?: string;
      dryRun?: boolean;
      /** Format: int64 */
      scannedObjects?: number;
      /** Format: int64 */
      candidateRecipes?: number;
      /** Format: int64 */
      inserted?: number;
      /** Format: int64 */
      alreadyQueued?: number;
      /** Format: int64 */
      duplicateSourceIds?: number;
      /** Format: int64 */
      invalidKeys?: number;
      invalidKeySamples?: string[];
    };
    LocalTime: {
      /** Format: int32 */
      hour?: number;
      /** Format: int32 */
      minute?: number;
      /** Format: int32 */
      second?: number;
      /** Format: int32 */
      nano?: number;
    };
    RecipeImportScheduleRequest: {
      /** Format: date */
      targetDate?: string;
      /** Format: int32 */
      limit?: number;
      activeStartTime?: components["schemas"]["LocalTime"];
      activeEndTime?: components["schemas"]["LocalTime"];
    };
    RecipeImportScheduleResponse: {
      /** Format: date */
      targetDate?: string;
      /** Format: int32 */
      requestedLimit?: number;
      /** Format: int32 */
      scheduledCount?: number;
      /** Format: int64 */
      readyBefore?: number;
      /** Format: int64 */
      readyAfter?: number;
      activeStartTime?: components["schemas"]["LocalTime"];
      activeEndTime?: components["schemas"]["LocalTime"];
      /** Format: date-time */
      firstScheduledAt?: string;
      /** Format: date-time */
      lastScheduledAt?: string;
    };
    RecipeImportProcessResponse: {
      /** Format: int32 */
      requestedLimit?: number;
      /** Format: int32 */
      dueCount?: number;
      /** Format: int32 */
      reservedCount?: number;
      /** Format: int32 */
      registeredCount?: number;
      /** Format: int32 */
      failedCount?: number;
      /** Format: int32 */
      skippedCount?: number;
      items?: components["schemas"]["Item"][];
    };
    RunResult: {
      started?: boolean;
      /** Format: int32 */
      enqueued?: number;
      message?: string;
    };
    /** @description 큐레이션 아티클 생성 요청 */
    CurationArticleCreateRequest: {
      slug: string;
      /**
       * @description 제목
       * @example 여름 다이어트 오이 레시피 모음
       */
      title: string;
      description?: string;
      coverImageKey?: string;
      /** @description 본문 MDX 원본 */
      contentMdx: string;
      /**
       * @description 카테고리
       * @example diet
       */
      category?: string;
      generatedBy?: string;
      /** @description 참조한 레시피 ID 목록 (HashID 문자열 배열, audit/soft link) */
      recipeIds?: string[];
    };
    /** @description 큐레이션 아티클 생성 응답 */
    CurationArticleCreateResponse: {
      articleId?: string;
      slug?: string;
    };
    /** @description 아티클 이미지 presigned URL 발급 요청 */
    ArticleImagePresignedUrlRequest: {
      contentType: string;
      fileSize: number;
    };
    /** @description 아티클 이미지 presigned URL 발급 응답 (articleHashId 기반) */
    ArticleImagePresignedUrlResponse: {
      uploadKey?: string;
      imageKey?: string;
      /** @description uploadKey에 대한 presigned PUT URL. 10분간 유효. */
      presignedUrl?: string;
    };
    /** @description 아티클 이미지 finalize 요청 — S3에 변환 결과(.webp)가 실제로 존재하는지 확인한다. */
    ArticleImageFinalizeRequest: {
      imageKeys: string[];
    };
    /** @description 아티클 이미지 finalize 성공 응답 */
    ArticleImageFinalizeResponse: {
      ready?: boolean;
      imageKeys?: string[];
    };
    UserPatchDTO: {
      nickname?: string;
      introduction?: string;
      profileImageKey?: string;
    };
    CommentUpdateRequest: {
      content?: string;
      /** @description 수정할 이미지 키 목록. null=미변경, []=모두 제거. */
      imageKeys?: string[];
    };
    PreferenceDto: {
      enabled?: boolean;
    };
    UserNotificationPreferenceDto: {
      /** @enum {string} */
      notificationType?:
        | "NEW_COMMENT"
        | "NEW_REPLY"
        | "AI_RECIPE_DONE"
        | "NEW_FAVORITE"
        | "NEW_RECIPE_LIKE"
        | "NEW_COMMENT_LIKE"
        | "NEW_RECIPE_RATING"
        | "RECIPE_POLICY_VIOLATION"
        | "REFERRAL_REWARD_GRANTED";
      enabled?: boolean;
    };
    DevVisibilityUpdateRequest: {
      visibility: "PUBLIC" | "PRIVATE" | "RESTRICTED" | "PUBLIC" | "PRIVATE";
    };
    DevVisibilityUpdateResponse: {
      visibility?: "PUBLIC" | "PRIVATE" | "RESTRICTED" | "PUBLIC" | "PRIVATE";
    };
    /** @description 레시피북 이름 변경 요청 */
    RenameRecipeBookRequest: {
      /**
       * @description 변경할 이름
       * @example 양식 모음
       */
      name: string;
    };
    Pageable: {
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      sort?: string[];
    };
    SliceInfo: {
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      number?: number;
      /** Format: int32 */
      numberOfElements?: number;
      hasNext?: boolean;
    };
    YoutubeChannelRecipeCardDto: {
      /** Format: int64 */
      id?: number;
      title?: string;
      imageUrl?: string;
      /** Format: int64 */
      authorId?: number;
      authorName?: string;
      profileImage?: string;
      /** Format: date-time */
      createdAt?: string;
      /** Format: int32 */
      cookingTime?: number;
      /** Format: int64 */
      likeCount?: number;
      /** Format: int64 */
      favoriteCount?: number;
      /** Format: double */
      avgRating?: number;
      /** Format: int64 */
      ratingCount?: number;
      youtubeUrl?: string;
      youtubeChannelName?: string;
      youtubeChannelId?: string;
      youtubeVideoTitle?: string;
      youtubeThumbnailUrl?: string;
      youtubeChannelProfileUrl?: string;
      /** Format: int64 */
      youtubeSubscriberCount?: number;
      /** Format: int64 */
      youtubeVideoViewCount?: number;
      /** Format: int64 */
      youtubeExtractorId?: number;
      youtubeExtractorName?: string;
      youtubeExtractorProfileImage?: string;
      visibility?: string;
      source?: string;
      /** @enum {string} */
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      tags?: string[];
      likedByCurrentUser?: boolean;
      favoriteByCurrentUser?: boolean;
    };
    YoutubeChannelRecipesResponse: {
      channel?: components["schemas"]["YoutubeChannelSummaryDto"];
      content?: components["schemas"]["YoutubeChannelRecipeCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    YoutubeChannelSummaryDto: {
      channelId?: string;
      channelName?: string;
      channelProfileUrl?: string;
      /** Format: int64 */
      subscriberCount?: number;
      /** @enum {string} */
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      /** Format: int64 */
      recipeCount?: number;
      /** Format: int64 */
      totalFavoriteCount?: number;
      /** Format: int64 */
      weeklyFavoriteCount?: number;
    };
    YoutubeChannelRankingItemDto: {
      /** Format: int32 */
      rank?: number;
      channelId?: string;
      channelName?: string;
      channelProfileUrl?: string;
      /** Format: int64 */
      subscriberCount?: number;
      /** @enum {string} */
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      /** Format: int64 */
      recipeCount?: number;
      /** Format: int64 */
      weeklyFavoriteCount?: number;
      /** Format: int64 */
      totalFavoriteCount?: number;
    };
    YoutubeChannelRankingResponse: {
      content?: components["schemas"]["YoutubeChannelRankingItemDto"][];
    };
    /** @description 작성자 정보 */
    UserDto: {
      /** Format: int64 */
      id?: number;
      nickname?: string;
      profileImage?: string;
      introduction?: string;
    };
    DevMyRecipeSummaryDto: {
      /** Format: int64 */
      id?: number;
      title?: string;
      imageUrl?: string;
      dishType?: string;
      type?: string;
      /** Format: date-time */
      createdAt?: string;
      likedByCurrentUser?: boolean;
      /**
       * @description 레시피 가시성
       * @example PUBLIC
       */
      visibility?: string;
      /**
       * @description source
       * @example USER
       */
      source?: string;
      imageStatus?: string;
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      /**
       * @description remix(클론) 레시피 여부
       * @example true
       */
      isRemix?: boolean;
    };
    SliceResponseDevMyRecipeSummaryDto: {
      content?: components["schemas"]["DevMyRecipeSummaryDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    RecipeSearchCondition: {
      title?: string;
      dishType?: string;
      tags?: string[];
      ingredientIds?: string[];
      creatorCountryTags?: string[];
      types?: ("AI" | "YOUTUBE" | "USER")[];
      minCost?: number;
      maxCost?: number;
      minCalories?: number;
      maxCalories?: number;
      minProtein?: number;
      maxProtein?: number;
      minCarb?: number;
      maxCarb?: number;
      minFat?: number;
      maxFat?: number;
      minSugar?: number;
      maxSugar?: number;
      minSodium?: number;
      maxSodium?: number;
      q?: string;
      /** @enum {string} */
      dishTypeEnum?:
        | "FRYING"
        | "SOUP_STEW"
        | "GRILL"
        | "SALAD"
        | "FRIED_PAN"
        | "STEAMED_BRAISED"
        | "OVEN"
        | "RAW"
        | "PICKLE"
        | "RICE_NOODLE"
        | "DESSERT"
        | "BEVERAGE"
        | "OTHER";
      tagEnums?: (
        | "HOME_PARTY"
        | "PICNIC"
        | "CAMPING"
        | "HEALTHY"
        | "KIDS"
        | "SOLO"
        | "DRINK"
        | "BRUNCH"
        | "LATE_NIGHT"
        | "QUICK"
        | "HOLIDAY"
        | "LUNCHBOX"
        | "AIR_FRYER"
        | "HANGOVER"
        | "CHEF_RECIPE"
      )[];
    };
    PageMetadata: {
      /** Format: int64 */
      size?: number;
      /** Format: int64 */
      number?: number;
      /** Format: int64 */
      totalElements?: number;
      /** Format: int64 */
      totalPages?: number;
    };
    PagedModel: {
      content?: Record<string, never>[];
      page?: components["schemas"]["PageMetadata"];
    };
    DevRecipeListItemDto: {
      /**
       * Format: int64
       * @description 레시피 ID (HashID 인코딩)
       */
      id?: number;
      /** @description 레시피 제목 */
      title?: string;
      /** @description 레시피 대표 이미지 URL */
      imageUrl?: string;
      /**
       * Format: int64
       * @description 작성자 ID (HashID 인코딩)
       */
      authorId?: number;
      /** @description 작성자 닉네임 */
      authorName?: string;
      /** @description 작성자 프로필 이미지 */
      profileImage?: string;
      /**
       * Format: date-time
       * @description 생성일시 (Asia/Seoul)
       */
      createdAt?: string;
      /**
       * Format: int64
       * @description 즐겨찾기 수
       */
      favoriteCount?: number;
      /**
       * Format: int64
       * @description 좋아요 수
       */
      likeCount?: number;
      /** @description 현재 로그인 사용자가 좋아요 누름 여부 */
      likedByCurrentUser?: boolean;
      /** @description 현재 로그인 사용자가 즐겨찾기 추가 여부 */
      favoriteByCurrentUser?: boolean;
      /**
       * Format: int32
       * @description 예상 조리 시간 (분 단위)
       */
      cookingTime?: number;
      /** @description 평균 평점 */
      avgRating?: number;
      /**
       * Format: int64
       * @description 평점 참여 수
       */
      ratingCount?: number;
      /** @description 유튜브 링크 URL (recipe_youtube_info 우선) */
      youtubeUrl?: string;
      /** @description 유튜브 채널명 (recipe_youtube_info 우선) */
      youtubeChannelName?: string;
      /** @description 유튜브 채널 ID (recipe_youtube_info 우선) */
      youtubeChannelId?: string;
      /** @description 유튜브 원본 영상 제목 (recipe_youtube_info 우선) */
      youtubeVideoTitle?: string;
      /** @description 유튜브 썸네일 URL (recipe_youtube_info 우선) */
      youtubeThumbnailUrl?: string;
      /** @description 유튜브 채널 썸네일 URL (recipe_youtube_info 우선) */
      youtubeChannelProfileUrl?: string;
      youtubeSubscriberCount?: number;
      youtubeVideoViewCount?: number;
      youtubeExtractorId?: number;
      /** @description 유튜브 레시피를 추출한 사용자 닉네임 */
      youtubeExtractorName?: string;
      /** @description 유튜브 레시피를 추출한 사용자 프로필 이미지 */
      youtubeExtractorProfileImage?: string;
      visibility?: string;
      source?: string;
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      tags?: string[];
      /**
       * @description remix(클론) 레시피 여부
       * @example false
       */
      isRemix?: boolean;
    };
    SliceResponseDevRecipeListItemDto: {
      content?: components["schemas"]["DevRecipeListItemDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    /** @description 챗봇 대화 기록 항목 (UI 표시용) */
    ChatHistoryItem: {
      id?: string;
      /**
       * Format: date-time
       * @description 생성 시각
       */
      createdAt?: string;
      /**
       * @description 유저 질문
       * @example 이거 매워요?
       */
      question?: string;
      /**
       * @description 챗봇 답변
       * @example 보통 매운맛이에요...
       */
      answer?: string;
      intent?: "IN_SCOPE" | "OUT_OF_SCOPE" | "UNCLEAR" | "UNKNOWN";
      /**
       * @description Pro 호출 여부
       * @example true
       */
      fromLlm?: boolean;
    };
    DevRecipeDiscoveryCardDto: {
      /**
       * Format: int64
       * @description 레시피 ID (HashID 인코딩)
       */
      id?: number;
      /** @description 레시피 제목 */
      title?: string;
      /** @description 레시피 대표 이미지 URL */
      imageUrl?: string;
      /**
       * Format: int64
       * @description 작성자 ID (HashID 인코딩)
       */
      authorId?: number;
      /** @description 작성자 닉네임 */
      authorName?: string;
      /** @description 작성자 프로필 이미지 */
      profileImage?: string;
      /**
       * Format: date-time
       * @description 생성일시 (Asia/Seoul)
       */
      createdAt?: string;
      /**
       * Format: int32
       * @description 예상 조리 시간 (분 단위)
       */
      cookingTime?: number;
      /**
       * Format: int64
       * @description 좋아요 수
       */
      likeCount?: number;
      /**
       * Format: int64
       * @description 즐겨찾기 수
       */
      favoriteCount?: number;
      /**
       * Format: double
       * @description 평균 평점
       */
      avgRating?: number;
      /**
       * Format: int64
       * @description 평점 참여 수
       */
      ratingCount?: number;
      youtubeUrl?: string;
      /** @description 유튜브 채널명 (recipe_youtube_info 우선) */
      youtubeChannelName?: string;
      /** @description 유튜브 채널 ID (recipe_youtube_info 우선) */
      youtubeChannelId?: string;
      /** @description 유튜브 원본 영상 제목 (recipe_youtube_info 우선) */
      youtubeVideoTitle?: string;
      /** @description 유튜브 썸네일 URL (recipe_youtube_info 우선) */
      youtubeThumbnailUrl?: string;
      /** @description 유튜브 채널 썸네일 URL (recipe_youtube_info 우선) */
      youtubeChannelProfileUrl?: string;
      youtubeSubscriberCount?: number;
      youtubeVideoViewCount?: number;
      youtubeExtractorId?: number;
      /** @description 유튜브 레시피 추출자 닉네임 */
      youtubeExtractorName?: string;
      /** @description 유튜브 레시피 추출자 프로필 이미지 */
      youtubeExtractorProfileImage?: string;
      visibility?: string;
      source?: string;
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      tags?: string[];
    };
    DevTitleKeywordRecipesResponse: {
      keyword?: string;
      content?: components["schemas"]["DevRecipeDiscoveryCardDto"][];
    };
    DevSameIngredientRecipesResponse: {
      ingredientName?: string;
      content?: components["schemas"]["DevRecipeDiscoveryCardDto"][];
    };
    YoutubeSearchDto: {
      title?: string;
      videoId?: string;
      channelName?: string;
      thumbnailUrl?: string;
      /** Format: int64 */
      viewCount?: number;
      videoUrl?: string;
    };
    HomeRecipeCardDto: {
      /**
       * Format: int64
       * @description 레시피 ID
       */
      id?: number;
      /** @description 레시피 제목 */
      title?: string;
      /** @description 레시피 대표 이미지 URL */
      imageUrl?: string;
      /**
       * Format: int64
       * @description 작성자 ID
       */
      authorId?: number;
      /** @description 작성자 닉네임 */
      authorName?: string;
      /** @description 작성자 프로필 이미지 */
      profileImage?: string;
      /**
       * Format: date-time
       * @description 생성일시
       */
      createdAt?: string;
      /**
       * Format: int32
       * @description 예상 조리 시간
       */
      cookingTime?: number;
      /**
       * Format: int64
       * @description 좋아요 수
       */
      likeCount?: number;
      /**
       * Format: int64
       * @description 즐겨찾기 수
       */
      favoriteCount?: number;
      /**
       * Format: double
       * @description 평균 평점
       */
      avgRating?: number;
      /**
       * Format: int64
       * @description 평점 수
       */
      ratingCount?: number;
      /** @description 유튜브 URL */
      youtubeUrl?: string;
      /** @description 유튜브 채널명 */
      youtubeChannelName?: string;
      /** @description 유튜브 채널 ID */
      youtubeChannelId?: string;
      /** @description 유튜브 원본 영상 제목 */
      youtubeVideoTitle?: string;
      /** @description 유튜브 썸네일 URL */
      youtubeThumbnailUrl?: string;
      /** @description 유튜브 채널 프로필 URL */
      youtubeChannelProfileUrl?: string;
      /**
       * Format: int64
       * @description 유튜브 구독자 수
       */
      youtubeSubscriberCount?: number;
      /**
       * Format: int64
       * @description 유튜브 영상 조회수
       */
      youtubeVideoViewCount?: number;
      /**
       * Format: int64
       * @description 유튜브 레시피 추출자 ID
       */
      youtubeExtractorId?: number;
      /** @description 유튜브 레시피 추출자 닉네임 */
      youtubeExtractorName?: string;
      /** @description 유튜브 레시피 추출자 프로필 이미지 */
      youtubeExtractorProfileImage?: string;
      /**
       * @description 공개 정책
       * @example PUBLIC
       */
      visibility?: string;
      /**
       * @description 레시피 출처
       * @example YOUTUBE
       */
      source?: string;
      /**
       * @description 유튜브 크리에이터 국가 태그
       * @enum {string}
       */
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      /** @description 레시피 태그 */
      tags?: string[];
      isRemix?: boolean;
    };
    YoutubeVerifiedRecipesResponse: {
      /** Format: int64 */
      minYoutubeViewCount?: number;
      content?: components["schemas"]["HomeRecipeCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    RecipeSitemapResponseDto: {
      id?: string;
      /** Format: date-time */
      updatedAt?: string;
    };
    SeasonalPopularRecipesResponse: {
      /** Format: int32 */
      monthNo?: number;
      seasonalIngredientName?: string;
      content?: components["schemas"]["HomeRecipeCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    DevRecipeSearchResultDto: {
      /**
       * Format: int64
       * @description 레시피 ID (HashID 인코딩)
       */
      id?: number;
      /** @description 레시피 제목 */
      title?: string;
      /** @description 레시피 대표 이미지 URL */
      imageUrl?: string;
      /**
       * Format: int64
       * @description 작성자 ID (HashID 인코딩)
       */
      authorId?: number;
      /** @description 작성자 닉네임 */
      authorName?: string;
      /** @description 작성자 프로필 이미지 */
      profileImage?: string;
      /**
       * Format: date-time
       * @description 생성일시 (Asia/Seoul)
       */
      createdAt?: string;
      /**
       * Format: int32
       * @description 예상 조리 시간 (분 단위)
       */
      cookingTime?: number;
      /**
       * Format: int64
       * @description 좋아요 수
       */
      likeCount?: number;
      /**
       * Format: int64
       * @description 즐겨찾기 수
       */
      favoriteCount?: number;
      /**
       * Format: double
       * @description 평균 평점
       */
      avgRating?: number;
      /**
       * Format: int64
       * @description 평점 참여 수
       */
      ratingCount?: number;
      youtubeUrl?: string;
      /** @description 유튜브 채널명 (recipe_youtube_info 우선) */
      youtubeChannelName?: string;
      /** @description 유튜브 채널 ID (recipe_youtube_info 우선) */
      youtubeChannelId?: string;
      /** @description 유튜브 원본 영상 제목 (recipe_youtube_info 우선) */
      youtubeVideoTitle?: string;
      /** @description 유튜브 썸네일 URL (recipe_youtube_info 우선) */
      youtubeThumbnailUrl?: string;
      /** @description 유튜브 채널 썸네일 URL (recipe_youtube_info 우선) */
      youtubeChannelProfileUrl?: string;
      youtubeSubscriberCount?: number;
      youtubeVideoViewCount?: number;
      youtubeExtractorId?: number;
      /** @description 유튜브 레시피 추출자 닉네임 */
      youtubeExtractorName?: string;
      /** @description 유튜브 레시피 추출자 프로필 이미지 */
      youtubeExtractorProfileImage?: string;
      visibility?: string;
      source?: string;
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      tags?: string[];
      likedByCurrentUser?: boolean;
      favoriteByCurrentUser?: boolean;
      /**
       * @description remix(클론) 레시피 여부
       * @example false
       */
      isRemix?: boolean;
    };
    DevRecipeSearchSliceResponse: {
      content?: components["schemas"]["DevRecipeSearchResultDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    ReportResponse: {
      /** Format: int64 */
      reportId?: number;
      /** Format: int64 */
      recipeId?: number;
      /** Format: int64 */
      ingredientId?: number;
      /** Format: int64 */
      memberId?: number;
      /** @enum {string} */
      reason?:
        | "WRONG_QUANTITY"
        | "WRONG_NAME"
        | "NOT_EXIST"
        | "MISSING"
        | "ETC";
      memo?: string;
      /** Format: date-time */
      createdAt?: string;
      resolved?: boolean;
    };
    QuickPopularRecipesResponse: {
      /** Format: int32 */
      maxCookingTime?: number;
      content?: components["schemas"]["HomeRecipeCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    SliceResponseDevRecipeDiscoveryCardDto: {
      content?: components["schemas"]["DevRecipeDiscoveryCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    CountryPopularRecipesResponse: {
      countryCode?: string;
      countryName?: string;
      content?: components["schemas"]["HomeRecipeCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    CookedPopularRecipesResponse: {
      content?: components["schemas"]["HomeRecipeCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    CategoryPopularRecipesResponse: {
      categoryCode?: string;
      content?: components["schemas"]["HomeRecipeCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    DevRecipeBudgetCardDto: {
      /**
       * Format: int64
       * @description 레시피 ID (HashID 인코딩)
       */
      id?: number;
      /** @description 레시피 제목 */
      title?: string;
      /** @description 레시피 대표 이미지 URL */
      imageUrl?: string;
      /**
       * Format: int64
       * @description 작성자 ID (HashID 인코딩)
       */
      authorId?: number;
      /** @description 작성자 닉네임 */
      authorName?: string;
      /** @description 작성자 프로필 이미지 */
      profileImage?: string;
      /**
       * Format: date-time
       * @description 생성일시 (Asia/Seoul)
       */
      createdAt?: string;
      /**
       * Format: int32
       * @description 예상 조리 시간 (분 단위)
       */
      cookingTime?: number;
      /**
       * Format: int64
       * @description 좋아요 수
       */
      likeCount?: number;
      /**
       * Format: int64
       * @description 즐겨찾기 수
       */
      favoriteCount?: number;
      /**
       * Format: double
       * @description 평균 평점
       */
      avgRating?: number;
      /**
       * Format: int64
       * @description 평점 참여 수
       */
      ratingCount?: number;
      ingredientCost?: number;
      marketPrice?: number;
      /** @description 유튜브 링크 URL (recipe_youtube_info 우선) */
      youtubeUrl?: string;
      /** @description 유튜브 채널명 (recipe_youtube_info 우선) */
      youtubeChannelName?: string;
      /** @description 유튜브 채널 ID (recipe_youtube_info 우선) */
      youtubeChannelId?: string;
      /** @description 유튜브 원본 영상 제목 (recipe_youtube_info 우선) */
      youtubeVideoTitle?: string;
      /** @description 유튜브 썸네일 URL (recipe_youtube_info 우선) */
      youtubeThumbnailUrl?: string;
      /** @description 유튜브 채널 썸네일 URL (recipe_youtube_info 우선) */
      youtubeChannelProfileUrl?: string;
      youtubeSubscriberCount?: number;
      youtubeVideoViewCount?: number;
      youtubeExtractorId?: number;
      /** @description 유튜브 레시피 추출자 닉네임 */
      youtubeExtractorName?: string;
      /** @description 유튜브 레시피 추출자 프로필 이미지 */
      youtubeExtractorProfileImage?: string;
      visibility?: string;
      source?: string;
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      tags?: string[];
    };
    SliceResponseDevRecipeBudgetCardDto: {
      content?: components["schemas"]["DevRecipeBudgetCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    ProductResponseDto: {
      /** Format: int64 */
      id?: number;
      name?: string;
      /** Format: int32 */
      creditAmount?: number;
      /** Format: int32 */
      bonusAmount?: number;
      type?: string;
      checkoutUrl?: string;
      customerPortalUrl?: string;
      /** Format: date-time */
      nextBillingDate?: string;
      subscribed?: boolean;
      currentPlan?: boolean;
    };
    NotificationDto: {
      /** Format: int64 */
      id?: number;
      /** Format: int64 */
      userId?: number;
      /** Format: int64 */
      actorId?: number;
      actorNickname?: string;
      imageUrl?: string;
      /** @enum {string} */
      type?:
        | "NEW_COMMENT"
        | "NEW_REPLY"
        | "AI_RECIPE_DONE"
        | "NEW_FAVORITE"
        | "NEW_RECIPE_LIKE"
        | "NEW_COMMENT_LIKE"
        | "NEW_RECIPE_RATING"
        | "RECIPE_POLICY_VIOLATION"
        | "REFERRAL_REWARD_GRANTED";
      /** @enum {string} */
      relatedType?: "RECIPE" | "COMMENT" | "REFERRAL_REDEMPTION";
      /** Format: int64 */
      relatedId?: number;
      relatedUrl?: string;
      message?: string;
      /** Format: date-time */
      createdAt?: string;
      read?: boolean;
    };
    PagedModelNotificationDto: {
      content?: components["schemas"]["NotificationDto"][];
      page?: components["schemas"]["PageMetadata"];
    };
    CookingStreakDto: {
      /** Format: int32 */
      streak?: number;
      cookedToday?: boolean;
    };
    ReferralCampaignSummaryResponse: {
      /** @example 2026-07 */
      campaignKey?: string;
      /**
       * Format: date-time
       * @example 2026-07-31T15:00:00Z
       */
      endsAt?: string;
      /**
       * Format: int32
       * @example 3
       */
      maxRewardsPerReferrer?: number;
      /**
       * Format: int64
       * @example 3
       */
      referrerRewardedCount?: number;
    } | null;
    ReferralMeResponse: {
      /** @example AB12CD34 */
      myReferralCode?: string;
      campaign?: components["schemas"]["ReferralCampaignSummaryResponse"];
      redeemStatus?: components["schemas"]["ReferralRedeemStatusResponse"];
    };
    ReferralRedeemStatusResponse: {
      /**
       * @example AVAILABLE
       * @enum {string}
       */
      status?:
        | "AVAILABLE"
        | "ALREADY_REDEEMED"
        | "NOT_ELIGIBLE_OLD_USER"
        | "NO_ACTIVE_CAMPAIGN";
      /**
       * Format: date-time
       * @example 2026-07-30T12:30:00Z
       */
      redeemDeadline?: string | null;
      /**
       * Format: date-time
       * @example 2026-07-10T04:20:00Z
       */
      redeemedAt?: string | null;
      referrer?: components["schemas"]["ReferralReferrerResponse"];
    };
    ReferralReferrerResponse: {
      /** @example 요리왕경환 */
      nickname?: string;
      /** @example AB12CD34 */
      referralCode?: string;
    } | null;
    CookedAgainRecipesResponse: {
      content?: components["schemas"]["HomeRecipeCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    FridgeIngredientPopularRecipesResponse: {
      ingredientName?: string;
      content?: components["schemas"]["HomeRecipeCardDto"][];
      slice?: components["schemas"]["SliceInfo"];
    };
    StatsResponseDto: {
      /** Format: int64 */
      todayVisitors?: number;
      /** Format: int64 */
      todayClicks?: number;
      /** Format: int64 */
      totalVisitors?: number;
      /** Format: int64 */
      totalClicks?: number;
    };
    IngredientSitemapResponseDto: {
      id?: string;
      /** Format: date-time */
      updatedAt?: string;
    };
    IngredientIdNameDto: {
      /** Format: int64 */
      id?: number;
      name?: string;
    };
    DishTypeDto: {
      name?: string;
      displayName?: string;
    };
    CommentWithRepliesDto: {
      replies?: components["schemas"]["PageObject"];
    };
    PageObject: {
      /** Format: int32 */
      totalPages?: number;
      /** Format: int64 */
      totalElements?: number;
      pageable?: components["schemas"]["PageableObject"];
      /** Format: int32 */
      numberOfElements?: number;
      /** Format: int32 */
      size?: number;
      content?: components["schemas"]["ReplyDto"][];
      /** Format: int32 */
      number?: number;
      sort?: components["schemas"]["SortObject"][];
      first?: boolean;
      last?: boolean;
      empty?: boolean;
    };
    PageableObject: {
      paged?: boolean;
      /** Format: int32 */
      pageNumber?: number;
      /** Format: int32 */
      pageSize?: number;
      unpaged?: boolean;
      /** Format: int64 */
      offset?: number;
      sort?: components["schemas"]["SortObject"][];
    };
    SortObject: {
      direction?: string;
      nullHandling?: string;
      ascending?: boolean;
      property?: string;
      ignoreCase?: boolean;
    };
    DevRecipeDetailDto: {
      visibility?: "PUBLIC" | "PRIVATE" | "RESTRICTED";
      source?: "USER" | "AI" | "YOUTUBE" | "REELS";
      originRecipeId?: number;
      extractionInfo?: components["schemas"]["ExtractionInfoDto"];
      requestedLocale?: string;
      contentLocale?: string;
      sourceLocale?: string;
      isRemix?: boolean;
    };
    ExtractionInfoDto: {
      evidenceLevel?: "HIGH" | "MEDIUM" | "LOW";
    };
    /** @description Dev V3 댓글 사용자 특정 동적 정보 DTO */
    DevCommentStatusDto: {
      /**
       * Format: int64
       * @description 댓글 ID
       */
      id?: number;
      /** @description 현재 로그인한 사용자가 이 댓글에 좋아요를 눌렀는지 여부 */
      likedByCurrentUser?: boolean;
      /**
       * Format: int32
       * @description 댓글 좋아요 수
       */
      likeCount?: number;
    };
    /** @description Dev V3 레시피 상세 사용자 특정 동적 정보 DTO */
    DevRecipeDetailStatusDto: {
      /**
       * Format: int64
       * @description 좋아요 수
       */
      likeCount?: number;
      /** @description 현재 로그인한 사용자가 좋아요를 눌렀는지 여부 */
      likedByCurrentUser?: boolean;
      /**
       * Format: int64
       * @description 즐겨찾기 수
       */
      favoriteCount?: number;
      /** @description 현재 로그인한 사용자가 즐겨찾기를 눌렀는지 여부 */
      favoriteByCurrentUser?: boolean;
      /**
       * Format: double
       * @description 현재 로그인한 사용자의 평점
       */
      myRating?: number;
      /** @description 댓글들의 사용자 특정 상태 정보 (ID 및 나의 좋아요 여부) */
      comments?: components["schemas"]["DevCommentStatusDto"][];
      ingredientIdsInFridge?: number[];
      clonedByMe?: boolean;
      remixCount?: number;
    };
    /** @description 레시피 저장 상태 응답 */
    RecipeSaveStatusResponse: {
      /**
       * @description 저장 여부
       * @example true
       */
      saved?: boolean;
      savedBookCount?: number;
      /** @description 저장된 폴더 목록 */
      books?: components["schemas"]["SavedBookInfo"][];
    };
    /** @description 저장된 폴더 정보 */
    SavedBookInfo: {
      /**
       * Format: int64
       * @description 레시피북 ID
       */
      id?: number;
      /**
       * @description 레시피북 이름
       * @example 한식 모음
       */
      name?: string;
      default?: boolean;
    };
    JobStatusDto: {
      /** Format: int64 */
      jobId?: number;
      /** @enum {string} */
      status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
      /** Format: int64 */
      resultRecipeId?: number;
      code?: string;
      message?: string;
      /** Format: int32 */
      progress?: number;
    };
    RecipeIdResponse: {
      /** Format: int64 */
      recipeId?: number;
    };
    CookingRecordDto: {
      /** Format: int64 */
      id?: number;
      /** Format: int64 */
      recipeId?: number;
      recipeTitle?: string;
      /** Format: int32 */
      ingredientCost?: number;
      /** Format: int32 */
      marketPrice?: number;
      /** Format: int32 */
      savings?: number;
      /** Format: date-time */
      createdAt?: string;
    };
    /** @description 하루치 요리 기록 그룹 */
    DailyGroup: {
      date?: string;
      /** @description 해당 날짜의 요리 기록 리스트 */
      records?: components["schemas"]["DevCookingRecordSummaryDto"][];
    };
    /** @description Dev V3 요리 기록 피드 응답 (날짜별 그룹, 무한스크롤) */
    DevCookingRecordFeedResponse: {
      /** @description 날짜별 그룹 리스트 (최신순) */
      groups?: components["schemas"]["DailyGroup"][];
      /** @description 다음 페이지 존재 여부 */
      hasNext?: boolean;
    };
    /** @description Dev V3 요리 기록 요약 */
    DevCookingRecordSummaryDto: {
      /**
       * Format: int64
       * @description 기록 ID
       */
      recordId?: number;
      /**
       * Format: int64
       * @description 레시피 ID
       */
      recipeId?: number;
      /** @description 레시피 제목 */
      recipeTitle?: string;
      /**
       * Format: int32
       * @description 재료 비용
       */
      ingredientCost?: number;
      /**
       * Format: int32
       * @description 시장가
       */
      marketPrice?: number;
      nutrition?: components["schemas"]["NutritionSummaryDto"];
      /** @description 총 칼로리 */
      calories?: number;
      /** @description 이미지 URL */
      imageUrl?: string;
      /**
       * @description 레시피 가시성 (현재 시점 기준)
       * @example PUBLIC
       */
      visibility?: string;
      /**
       * @description remix(클론) 레시피 여부
       * @example true
       */
      isRemix?: boolean;
    };
    /** @description 영양 요약 */
    NutritionSummaryDto: {
      protein?: number;
      carbohydrate?: number;
      fat?: number;
      sugar?: number;
      sodium?: number;
    };
    /** @description Dev V3 레시피북 상세 응답 (recipes 항목에 visibility / source / isRemix 추가) */
    DevRecipeBookDetailResponse: {
      /**
       * Format: int64
       * @description 레시피북 ID
       */
      id?: number;
      /** @description 레시피북 이름 */
      name?: string;
      recipeCount?: number;
      /** @description 레시피 목록 (default sort: item.createdAt DESC = 폴더 추가 시각 기준 최신순) */
      recipes?: components["schemas"]["DevRecipeBookItemResponse"][];
      /** @description 다음 페이지 존재 여부 */
      hasNext?: boolean;
      default?: boolean;
    };
    /** @description Dev V3 recipe book recipe item */
    DevRecipeBookItemResponse: {
      /**
       * Format: int64
       * @description Recipe ID
       */
      recipeId?: number;
      /** @description Recipe title */
      title?: string;
      /** @description Recipe image URL */
      imageUrl?: string;
      /** @description Dish type display label (localized) */
      dishType?: string;
      /**
       * Format: int64
       * @description Author ID
       */
      authorId?: number;
      /** @description Author nickname */
      authorName?: string;
      /** @description Author profile image */
      profileImage?: string;
      /**
       * Format: date-time
       * @description Added time
       */
      addedAt?: string;
      createdAt?: string;
      /**
       * Format: int64
       * @description Favorite count
       */
      favoriteCount?: number;
      cookingTime?: number;
      /** @description YouTube URL from recipe_youtube_info first */
      youtubeUrl?: string;
      /** @description YouTube channel name from recipe_youtube_info first */
      youtubeChannelName?: string;
      /** @description YouTube channel ID from recipe_youtube_info first */
      youtubeChannelId?: string;
      /** @description YouTube video title from recipe_youtube_info first */
      youtubeVideoTitle?: string;
      /** @description YouTube thumbnail URL from recipe_youtube_info first */
      youtubeThumbnailUrl?: string;
      /** @description YouTube channel profile URL from recipe_youtube_info first */
      youtubeChannelProfileUrl?: string;
      youtubeSubscriberCount?: number;
      youtubeVideoViewCount?: number;
      youtubeExtractorId?: number;
      /** @description Nickname of the user that extracted this YouTube recipe */
      youtubeExtractorName?: string;
      /** @description Profile image of the user that extracted this YouTube recipe */
      youtubeExtractorProfileImage?: string;
      /**
       * @description Recipe visibility
       * @example PUBLIC
       */
      visibility?: string;
      /**
       * @description Recipe source
       * @example USER
       */
      source?: string;
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      /** @description Recipe tag display names */
      tags?: string[];
      isRemix?: boolean;
    };
    DevFridgeRecipeDto: {
      /**
       * Format: int64
       * @description 레시피 ID (HashID 인코딩)
       */
      id?: number;
      /** @description 레시피 제목 */
      title?: string;
      /** @description 레시피 대표 이미지 URL */
      imageUrl?: string;
      /**
       * Format: int64
       * @description 작성자 ID (HashID 인코딩)
       */
      authorId?: number;
      /** @description 작성자 닉네임 */
      authorName?: string;
      /** @description 작성자 프로필 이미지 */
      profileImage?: string;
      /**
       * Format: date-time
       * @description 생성일시 (Asia/Seoul)
       */
      createdAt?: string;
      /**
       * Format: int64
       * @description 즐겨찾기 수
       */
      favoriteCount?: number;
      /**
       * Format: int64
       * @description 좋아요 수
       */
      likeCount?: number;
      /** @description 현재 로그인 사용자가 좋아요 누름 여부 */
      likedByCurrentUser?: boolean;
      /** @description 현재 로그인 사용자가 즐겨찾기 추가 여부 (운영 fridge와 동일하게 현재 미채움 — false) */
      favoriteByCurrentUser?: boolean;
      /**
       * Format: int32
       * @description 예상 조리 시간 (분 단위)
       */
      cookingTime?: number;
      /** @description 평균 평점 */
      avgRating?: number;
      /**
       * Format: int64
       * @description 평점 참여 수
       */
      ratingCount?: number;
      /** @description 유튜브 링크 URL (recipe_youtube_info 우선) */
      youtubeUrl?: string;
      /** @description 유튜브 채널명 (recipe_youtube_info 우선) */
      youtubeChannelName?: string;
      /** @description 유튜브 채널 ID (recipe_youtube_info 우선) */
      youtubeChannelId?: string;
      /** @description 유튜브 원본 영상 제목 (recipe_youtube_info 우선) */
      youtubeVideoTitle?: string;
      /** @description 유튜브 썸네일 URL (recipe_youtube_info 우선) */
      youtubeThumbnailUrl?: string;
      /** @description 유튜브 채널 썸네일 URL (recipe_youtube_info 우선) */
      youtubeChannelProfileUrl?: string;
      youtubeSubscriberCount?: number;
      youtubeVideoViewCount?: number;
      youtubeExtractorId?: number;
      /** @description 유튜브 레시피를 추출한 사용자 닉네임 */
      youtubeExtractorName?: string;
      /** @description 유튜브 레시피를 추출한 사용자 프로필 이미지 */
      youtubeExtractorProfileImage?: string;
      visibility?: string;
      source?: string;
      creatorCountryTag?: "KR" | "JP" | "US" | "OTHER";
      tags?: string[];
      /** @description 내 냉장고 재료와 겹치는 재료 이름 리스트 */
      matchedIngredients?: string[];
      /** @description 부족한 재료 이름과 구매 링크 리스트 */
      missingIngredients?: components["schemas"]["MissingIngredientDto"][];
      /**
       * @description remix(클론) 레시피 여부
       * @example false
       */
      isRemix?: boolean;
    };
    /** @description 부족한 재료 */
    MissingIngredientDto: {
      /** @description 재료명 */
      name?: string;
      /** @description 쿠팡 파트너스 링크 (없으면 null) */
      coupangLink?: string;
    };
    CalendarDaySummaryDto: {
      /** Format: date */
      date?: string;
      /** Format: int64 */
      totalSavings?: number;
      /** Format: int64 */
      totalCount?: number;
      firstImageUrl?: string;
    };
    CalendarMonthSummaryDto: {
      dailySummaries?: components["schemas"]["CalendarDaySummaryDto"][];
      /** Format: int64 */
      monthlyTotalSavings?: number;
    };
    /** @description Dev V3 내 정보 응답 */
    DevMeResponseDto: {
      /**
       * Format: int64
       * @description 사용자 HashID
       */
      id?: number;
      /** @description 닉네임 */
      nickname?: string;
      /** @description 프로필 이미지 URL */
      profileImage?: string | null;
      /** @description 자기소개 */
      introduction?: string | null;
      createdAt?: string;
      updatedAt?: string;
      /** @description 설문조사 완료 여부 */
      surveyCompleted?: boolean;
      /** @description 첫 요리 기록 작성 여부 */
      hasFirstRecord?: boolean;
      remainingAiGenerationQuota?: number;
      remainingYoutubeExtractionCredits?: number;
      adStatus?: components["schemas"]["AdStatusDto"];
      preferredLocale?: string;
    };
    DevIngredientDetailDto: {
      /**
       * Format: int64
       * @description 재료 ID (해시)
       */
      id?: number;
      /**
       * @description 재료명
       * @example 대파
       */
      name?: string;
      /**
       * @description 재료 카테고리
       * @example 채소
       */
      category?: string;
      /** @description 재료 이미지 URL */
      imageUrl?: string;
      /** @description Coupang Partners link for this ingredient. null이면 링크 없음. */
      coupangLink?: string | null;
      nutritionPer100g?: components["schemas"]["IngredientNutritionPer100gDto"];
      /** @description 보관 위치 (실온/냉장/냉동). 없으면 null. */
      storageLocation?: string | null;
      /** @description 보관 온도 상세. 없으면 null. */
      storageTemperature?: string | null;
      /** @description 보관 기간. 없으면 null. */
      storageDuration?: string | null;
      /** @description 보관 참고사항. 없으면 null. */
      storageNotes?: string | null;
      /** @description 잘 어울리는 재료 (슬래시 구분). 없으면 null. */
      goodPairs?: string | null;
      /** @description goodPairs를 파싱한 구조화 목록. */
      goodPairItems?: components["schemas"]["IngredientPairItemDto"][];
      /** @description 상극 재료 (슬래시 구분). 없으면 null. */
      badPairs?: string | null;
      /** @description badPairs를 파싱한 구조화 목록. */
      badPairItems?: components["schemas"]["IngredientPairItemDto"][];
      /** @description 재료 효능 설명. 없으면 null. */
      benefits?: string | null;
      /** @description 제철 월 목록(1~12). 없으면 null. */
      seasonMonths?: (number | null)[] | null;
      /** @description 추천 조리법 (슬래시 구분). 없으면 null. */
      recommendedCookingMethods?: string | null;
      recipes?: components["schemas"]["DevRecipeListItemDto"][];
    };
    IngredientNutritionPer100gDto: {
      kcal?: number | null;
      carbohydrateG?: number | null;
      /**
       * @description Protein per 100g (g)
       * @example 2
       */
      proteinG?: number | null;
      /**
       * @description Fat per 100g (g)
       * @example 0.1
       */
      fatG?: number | null;
      /**
       * @description Sugar per 100g (g)
       * @example 0.8
       */
      sugarG?: number | null;
      /**
       * @description Sodium per 100g (mg)
       * @example 6
       */
      sodiumMg?: number | null;
    } | null;
    /** @description Structured ingredient pair item parsed from goodPairs/badPairs. */
    IngredientPairItemDto: {
      id?: number | null;
      /**
       * @description Pair ingredient name
       * @example 마늘
       */
      name?: string;
      imageUrl?: string | null;
    };
    /** @description Public 큐레이션 아티클 상세 응답 */
    PublicCurationArticleResponse: {
      id?: string;
      /** @description URL slug */
      slug?: string;
      /** @description 제목 */
      title?: string;
      /** @description 메타 설명 */
      description?: string;
      /** @description 커버 이미지 S3 imageKey (.webp) */
      coverImageKey?: string;
      /** @description 본문 MDX 원본 */
      contentMdx?: string;
      /** @description 카테고리 */
      category?: string;
      /**
       * Format: date-time
       * @description 발행 시각
       */
      publishedAt?: string;
      /** @description 참조한 레시피 ID 목록 (HashID 문자열 배열) */
      recipeIds?: string[];
      /**
       * @description 원본 작성 언어 (현재 항상 ko)
       * @example ko
       */
      sourceLocale?: string;
      translated?: boolean;
    };
    /** @description Public 큐레이션 아티클 추천 카드 응답 */
    CurationArticleRecommendationResponse: {
      slug?: string;
      /**
       * @description 카드 제목
       * @example 단백질 아침 레시피 모음
       */
      title?: string;
      coverImageKey?: string | null;
      /**
       * @description 카테고리 라벨. null 가능
       * @example diet
       */
      category?: string | null;
    };
    /** @description Public 큐레이션 아티클 sitemap 항목 */
    CurationArticleSitemapResponse: {
      slug?: string;
      updatedAt?: string;
    };
    /** @description 챗봇 일일 쿼터 상태 */
    QuotaResponse: {
      dailyLimit?: number;
      used?: number;
      remaining?: number;
      resetAt?: string;
    };
    RecipeSitemapSnapshotStatusResponse: {
      locale?: string;
      /** Format: int64 */
      entries?: number;
      /** Format: date-time */
      refreshedAt?: string;
    };
    PersonaStatusCount: {
      personaId?: string;
      status?: string;
      /** Format: int64 */
      count?: number;
    };
    RecipeImportStatsResponse: {
      /** Format: int64 */
      total?: number;
      statusCounts?: {
        [key: string]: number;
      };
      personaStatusCounts?: components["schemas"]["PersonaStatusCount"][];
    };
    FailedJob: {
      /** Format: int64 */
      recipeId?: number;
      /** Format: int32 */
      retryCount?: number;
      lastError?: string;
    };
    /** @description 큐레이션 아티클 상세 응답 */
    CurationArticleResponse: {
      id?: string;
      /** @description URL slug */
      slug?: string;
      /** @description 제목 */
      title?: string;
      /** @description 메타 설명 */
      description?: string;
      coverImageKey?: string;
      /** @description 본문 MDX 원본 */
      contentMdx?: string;
      /** @description 카테고리 */
      category?: string;
      /**
       * @description 발행 상태
       * @enum {string}
       */
      status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      /** @description 생성 AI 모델 식별자 */
      generatedBy?: string;
      /** @description 사람 검수 완료 여부 */
      humanReviewed?: boolean;
      /**
       * Format: date-time
       * @description 최초 발행 시각
       */
      publishedAt?: string;
      /**
       * Format: date-time
       * @description 생성 시각
       */
      createdAt?: string;
      /**
       * Format: date-time
       * @description 수정 시각
       */
      updatedAt?: string;
      /** @description 참조한 레시피 ID 목록 (HashID 문자열 배열, audit/soft link) */
      recipeIds?: string[];
    };
    /** @description 큐레이션 아티클 번역 현황 (어드민) */
    CurationArticleTranslationView: {
      /**
       * @description 번역 locale
       * @example ja
       */
      locale?: string;
      /** @description 번역된 제목 */
      title?: string;
      /** @description 번역된 메타 설명 */
      description?: string | null;
      /** @description 번역된 본문 MDX */
      contentMdx?: string;
      status?: string;
      /** @description 번역 생산자 식별자 */
      model?: string | null;
      /**
       * Format: date-time
       * @description 마지막 갱신 시각
       */
      updatedAt?: string;
      stale?: boolean;
    };
    /** @description 레시피북에서 레시피 삭제 요청 (bulk) */
    RemoveRecipesFromBookRequest: {
      /** @description 삭제할 레시피 ID 목록 */
      recipeIds: number[];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  updatePreferredLocale: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PreferredLocaleRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getIngredientDetail_1: {
    parameters: {
      query: {
        /** @description 재료 ID (해시) */
        ingredientId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevIngredientDetailDto"];
        };
      };
      /** @description 재료를 찾을 수 없음 (errorCode: INGREDIENT_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  update: {
    parameters: {
      query: {
        /** @description Ingredient ID */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["IngredientRequestDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["IngredientResponseDto"];
        };
      };
    };
  };
  delete_1: {
    parameters: {
      query: {
        /** @description Ingredient ID */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  updateRecipeImageKeys: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeImageKeyUpdateRequest"];
      };
    };
    responses: {
      /** @description 업데이트 성공 (응답 body 없음) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 레시피 아님 (RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  updateRecipeImageKeys_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeImageKeyUpdateRequest"];
      };
    };
    responses: {
      /** @description 업데이트 성공 (응답 body 없음) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 레시피 아님 (RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getRecipeDetail: {
    parameters: {
      query: {
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeDetailDto"];
        };
      };
      /** @description 비공개 레시피 권한 없음 (errorCode=210 RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeDetailDto"];
        };
      };
      /** @description 레시피 없음 (errorCode=201 RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeDetailDto"];
        };
      };
    };
  };
  updateRecipe: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeUpdateWithImageRequest"];
      };
    };
    responses: {
      /** @description 수정 성공 — recipeId + presigned upload URLs */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PresignedUrlResponse"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 레시피 아님 (RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  deleteRecipe: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 삭제 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 레시피 아님 (RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getRecipeDetail_1: {
    parameters: {
      query: {
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeDetailDto"];
        };
      };
      /** @description 비공개 레시피 권한 없음 (errorCode=210 RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeDetailDto"];
        };
      };
      /** @description 레시피 없음 (errorCode=201 RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeDetailDto"];
        };
      };
    };
  };
  updateRecipe_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeUpdateWithImageRequest"];
      };
    };
    responses: {
      /** @description 수정 성공 — recipeId + presigned upload URLs */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PresignedUrlResponse"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 레시피 아님 (RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  deleteRecipe_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 삭제 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 레시피 아님 (RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  reorderBooks: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ReorderRecipeBooksRequest"];
      };
    };
    responses: {
      /** @description 순서 변경 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeBookResponse"][];
        };
      };
      /** @description ID 목록 불일치 (INVALID_INPUT_VALUE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  reorderBooks_1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ReorderRecipeBooksRequest"];
      };
    };
    responses: {
      /** @description 순서 변경 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeBookResponse"][];
        };
      };
      /** @description ID 목록 불일치 (INVALID_INPUT_VALUE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  updateCrawledRecipe: {
    parameters: {
      query: {
        /** @description 레시피 ID */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeCreateRequestDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
    };
  };
  deleteCrawledRecipe: {
    parameters: {
      query: {
        /** @description 레시피 ID */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  updateIngredientsBatch: {
    parameters: {
      query: {
        /** @description 레시피 ID */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AdminIngredientUpdateDto"][];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 아티클 ID (HashID) */
        articleId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CurationArticleResponse"];
        };
      };
    };
  };
  update_1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 아티클 ID (HashID) */
        articleId: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CurationArticleUpdateRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
    };
  };
  upsertTranslation: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 아티클 ID (HashID) */
        articleId: string;
        /** @description 번역 locale (ja/en) */
        locale: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CurationArticleTranslationUpsertRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
    };
  };
  deleteTranslation: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 아티클 ID (HashID) */
        articleId: string;
        /** @description 번역 locale (ja/en) */
        locale: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  oauthCallback: {
    parameters: {
      query?: never;
      header?: {
        "X-Env"?: string;
      };
      path: {
        provider: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CodeDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  issueWebSocketTicket: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
    };
  };
  handleLemonSqueezyWebhook: {
    parameters: {
      query?: never;
      header: {
        "X-Signature": string;
        "X-Event-Name": string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  testLogin: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": Record<string, never>;
        };
      };
    };
  };
  refreshAccessToken: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 토큰 재발급 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["TokenResponseDTO"];
        };
      };
      /** @description 리프레시 토큰 없음 또는 유효하지 않음 (code: 601) / 리프레시 토큰 만료 (code: 602) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  logout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        refreshToken?: string;
      };
    };
    requestBody?: never;
    responses: {
      /** @description 로그아웃 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  logoutAll: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 전체 로그아웃 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  addReactions: {
    parameters: {
      query: {
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ReactionRequestDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  recalculateNutrition: {
    parameters: {
      query: {
        /** @description 레시피 ID */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  issueImagePresignedUrls: {
    parameters: {
      query: {
        /** @description 레시피 ID */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CommentImagePresignedUrlRequest"];
      };
    };
    responses: {
      /** @description presigned URL 발급 성공 (요청 순서대로 정렬된 배열) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CommentImagePresignedUrlResponse"][];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CommentImagePresignedUrlResponse"][];
        };
      };
      /** @description UNAUTHORIZED */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CommentImagePresignedUrlResponse"][];
        };
      };
    };
  };
  chat: {
    parameters: {
      query: {
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ChatRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ChatResponse"];
        };
      };
    };
  };
  feedback: {
    parameters: {
      query: {
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ChatFeedbackRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  analyzeRecipeManually: {
    parameters: {
      query: {
        /** @description 레시피 ID */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  swapRecipesAlias: {
    parameters: {
      query: {
        /** @description alias가 가리킬 신규 인덱스 이름 (필수). 예: recipes_v2 */
        indexName: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": Record<string, never>;
        };
      };
    };
  };
  reindexAllRecipes: {
    parameters: {
      query?: {
        /** @description 색인 대상 인덱스 (alias swap 시 신규 이름). 미지정 시 'recipes' */
        indexName?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
    };
  };
  recreateIngredientsIndex: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
    };
  };
  deleteIngredientsIndex: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: boolean;
          };
        };
      };
    };
  };
  createRecipesIndex: {
    parameters: {
      query?: {
        /** @description 생성할 인덱스 이름 (alias swap 시 신규 이름). 미지정 시 'recipes' */
        indexName?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": Record<string, never>;
        };
      };
    };
  };
  createIngredientsIndex: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
    };
  };
  markAllRead: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getMySurvey: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UserSurveyDto"];
        };
      };
    };
  };
  saveMySurvey: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserSurveyDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  redeem: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ReferralRedeemRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ReferralRedeemResponse"];
        };
      };
    };
  };
  getMyItems: {
    parameters: {
      query: {
        category?: string;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
    };
  };
  addItem: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RefrigeratorItemRequestDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RefrigeratorItemResponseDto"];
        };
      };
    };
  };
  addItemsBulk: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RefrigeratorItemBulkRequestDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  removeItemsBulk: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RefrigeratorItemBulkRequestDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": Record<string, never>;
        };
      };
    };
  };
  trackClick: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["LogRequestDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  search_1: {
    parameters: {
      query: {
        category?: string;
        q?: string;
        inFridge?: boolean;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
    };
  };
  create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["IngredientRequestDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["IngredientResponseDto"];
        };
      };
    };
  };
  getIngredientUnitsBatch: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["IngredientUnitsBatchRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["IngredientUnitsBatchResponse"];
        };
      };
    };
  };
  reportIngredient: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["IngredientReportRequest"];
      };
    };
    responses: {
      /** @description 신고 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
      /** @description payload 검증 실패 (INVALID_INPUT_VALUE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  reportIngredient_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["IngredientReportRequest"];
      };
    };
    responses: {
      /** @description 신고 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
      /** @description payload 검증 실패 (INVALID_INPUT_VALUE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getPresignedUrlsForUpdate: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdatePresignedUrlRequest"];
      };
    };
    responses: {
      /** @description 발급 성공 — uploads (fileKey + presigned URL) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UpdatePresignedUrlResponse"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 레시피 아님 (RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getPresignedUrlsForUpdate_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdatePresignedUrlRequest"];
      };
    };
    responses: {
      /** @description 발급 성공 — uploads (fileKey + presigned URL) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UpdatePresignedUrlResponse"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 레시피 아님 (RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  finalizeRecipeImages: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 처리 성공 — FinalizeResponse(recipeId, activeImages, missingFiles) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["FinalizeResponse"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 레시피 아님 (RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  finalizeRecipeImages_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 처리 성공 — FinalizeResponse(recipeId, activeImages, missingFiles) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["FinalizeResponse"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 레시피 아님 (RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  createReply: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
        /** @description 부모 댓글 ID (HashID) */
        parentId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CommentRequestDto"];
      };
    };
    responses: {
      /** @description 작성 성공 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ReplyDto"];
        };
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description PRIVATE/RESTRICTED non-owner */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피/부모 댓글 없음 또는 non-ACTIVE */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  createReply_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
        /** @description 부모 댓글 ID (HashID) */
        parentId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CommentRequestDto"];
      };
    };
    responses: {
      /** @description 작성 성공 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ReplyDto"];
        };
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description PRIVATE/RESTRICTED non-owner */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피/부모 댓글 없음 또는 non-ACTIVE */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getAllComments: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
      /** @description PRIVATE/RESTRICTED non-owner */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  createComment: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CommentRequestDto"];
      };
    };
    responses: {
      /** @description 작성 성공 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CommentDto"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getAllComments_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
      /** @description PRIVATE/RESTRICTED non-owner */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  createComment_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CommentRequestDto"];
      };
    };
    responses: {
      /** @description 작성 성공 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CommentDto"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  toggleLike: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 토글 성공 — {liked: boolean, message: string} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 신규 추가 시 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  toggleLike_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 토글 성공 — {liked: boolean, message: string} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 신규 추가 시 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  toggleFavorite: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 토글 성공 — {saved: boolean, message: string} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 신규 추가 시 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  toggleFavorite_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 토글 성공 — {saved: boolean, message: string} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 신규 추가 시 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  extractYoutubeRecipe: {
    parameters: {
      query: {
        /** @description YouTube 영상 URL (watch / shorts 모두 지원) */
        url: string;
        imageGenModel?: string;
      };
      header?: {
        "Idempotency-Key"?: string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 작업 접수 성공 (jobId 반환). 신규 또는 기존 job 모두 200. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      /** @description 인증 필요 (errorCode=103 UNAUTHORIZED). */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      /** @description 일일 YouTube 추출 한도(인당 20) 초과 (errorCode=429 DAILY_QUOTA_EXCEEDED). */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
    };
  };
  extractYoutubeRecipe_1: {
    parameters: {
      query: {
        /** @description YouTube 영상 URL (watch / shorts 모두 지원) */
        url: string;
        imageGenModel?: string;
      };
      header?: {
        "Idempotency-Key"?: string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 작업 접수 성공 (jobId 반환). 신규 또는 기존 job 모두 200. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      /** @description 인증 필요 (errorCode=103 UNAUTHORIZED). */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      /** @description 일일 YouTube 추출 한도(인당 20) 초과 (errorCode=429 DAILY_QUOTA_EXCEEDED). */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
    };
  };
  getBatchStatuses: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DevRecipeStatusRequest"];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: components["schemas"]["DevRecipeSimpleStatusDto"];
          };
        };
      };
    };
  };
  getBatchStatuses_1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DevRecipeStatusRequest"];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: components["schemas"]["DevRecipeSimpleStatusDto"];
          };
        };
      };
    };
  };
  generateAiRecipe: {
    parameters: {
      query: {
        concept:
          | "INGREDIENT_FOCUS"
          | "COST_EFFECTIVE"
          | "NUTRITION_BALANCE"
          | "FINE_DINING";
        imageGenModel?: string;
      };
      header?: {
        "Idempotency-Key"?: string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeWithImageUploadRequest"];
      };
    };
    responses: {
      /** @description 작업 접수 성공 (jobId 반환). 신규 또는 기존 job 모두 200. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      /** @description 인증 필요 (errorCode=103 UNAUTHORIZED). */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
    };
  };
  generateAiRecipe_1: {
    parameters: {
      query: {
        concept:
          | "INGREDIENT_FOCUS"
          | "COST_EFFECTIVE"
          | "NUTRITION_BALANCE"
          | "FINE_DINING";
        imageGenModel?: string;
      };
      header?: {
        "Idempotency-Key"?: string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeWithImageUploadRequest"];
      };
    };
    responses: {
      /** @description 작업 접수 성공 (jobId 반환). 신규 또는 기존 job 모두 200. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      /** @description 인증 필요 (errorCode=103 UNAUTHORIZED). */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobIdResponse"];
        };
      };
    };
  };
  createRecipe: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeWithImageUploadRequest"];
      };
    };
    responses: {
      /** @description 생성 성공 — recipeId + presigned upload URLs */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PresignedUrlResponse"];
        };
      };
      /** @description 필수값 누락 (USER_RECIPE_IMAGE_REQUIRED 등) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description remix origin 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description remix 중복 (RECIPE_REMIX_ALREADY_EXISTS) */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  createRecipe_1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeWithImageUploadRequest"];
      };
    };
    responses: {
      /** @description 생성 성공 — recipeId + presigned upload URLs */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PresignedUrlResponse"];
        };
      };
      /** @description 필수값 누락 (USER_RECIPE_IMAGE_REQUIRED 등) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description remix origin 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description remix 중복 (RECIPE_REMIX_ALREADY_EXISTS) */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  rateRecipe: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeRatingRequestDto"];
      };
    };
    responses: {
      /** @description 등록/수정 성공 — {message: string} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 신규 rating/comment 시 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  deleteRating: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 삭제 성공 — {message: string} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description rating 없음 (RATING_NOT_FOUND) 또는 레시피 없음 (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  rateRecipe_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeRatingRequestDto"];
      };
    };
    responses: {
      /** @description 등록/수정 성공 — {message: string} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 신규 rating/comment 시 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  deleteRating_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 삭제 성공 — {message: string} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description rating 없음 (RATING_NOT_FOUND) 또는 레시피 없음 (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  createRecord: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 생성 성공 — {recordId, message} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description recipeId query param 누락 (INVALID_INPUT_VALUE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  createRecord_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 생성 성공 — {recordId, message} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description recipeId query param 누락 (INVALID_INPUT_VALUE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  addRecipes: {
    parameters: {
      query: {
        /** @description 레시피북 ID (HashID) */
        bookId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AddRecipesToBookRequest"];
      };
    };
    responses: {
      /** @description 추가 성공 — {addedCount, skippedCount} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["AddRecipesToBookResponse"];
        };
      };
      /** @description payload 누락/검증 실패 — recipeIds 누락 또는 빈 리스트 (INVALID_INPUT_VALUE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 폴더 아님 (RECIPE_BOOK_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 폴더 없음 (RECIPE_BOOK_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  removeRecipes: {
    parameters: {
      query: {
        /** @description 레시피북 ID (HashID) */
        bookId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RemoveRecipesFromBookRequest"];
      };
    };
    responses: {
      /** @description 삭제 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
      /** @description payload 누락/검증 실패 — recipeIds 누락 또는 빈 리스트 (INVALID_INPUT_VALUE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 폴더 아님 (RECIPE_BOOK_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 폴더 없음 (RECIPE_BOOK_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  addRecipes_1: {
    parameters: {
      query: {
        /** @description 레시피북 ID (HashID) */
        bookId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AddRecipesToBookRequest"];
      };
    };
    responses: {
      /** @description 추가 성공 — {addedCount, skippedCount} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["AddRecipesToBookResponse"];
        };
      };
      /** @description payload 누락/검증 실패 — recipeIds 누락 또는 빈 리스트 (INVALID_INPUT_VALUE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 폴더 아님 (RECIPE_BOOK_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 폴더 없음 (RECIPE_BOOK_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  removeRecipes_1: {
    parameters: {
      query: {
        /** @description 레시피북 ID (HashID) */
        bookId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RemoveRecipesFromBookRequest"];
      };
    };
    responses: {
      /** @description 삭제 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
      /** @description payload 누락/검증 실패 — recipeIds 누락 또는 빈 리스트 (INVALID_INPUT_VALUE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 폴더 아님 (RECIPE_BOOK_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 폴더 없음 (RECIPE_BOOK_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  listBooks: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 (List<RecipeBookResponse>) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeBookResponse"][];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  createBook: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateRecipeBookRequest"];
      };
    };
    responses: {
      /** @description 생성 성공 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeBookResponse"];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 이름 중복 (RECIPE_BOOK_DUPLICATE_NAME) */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  listBooks_1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 (List<RecipeBookResponse>) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeBookResponse"][];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  createBook_1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateRecipeBookRequest"];
      };
    };
    responses: {
      /** @description 생성 성공 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeBookResponse"];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 이름 중복 (RECIPE_BOOK_DUPLICATE_NAME) */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  toggleLike_2: {
    parameters: {
      query: {
        /** @description 댓글 ID (HashID) */
        commentId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 토글 성공 — {liked: boolean, likeCount: int, message: string} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  toggleLike_3: {
    parameters: {
      query: {
        /** @description 댓글 ID (HashID) */
        commentId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 토글 성공 — {liked: boolean, likeCount: int, message: string} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  backfillMissingChannel: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["AdminYoutubeMetadataBackfillRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["AdminYoutubeMetadataBackfillResponse"];
        };
      };
    };
  };
  backfill: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["AdminYoutubeCreatorCountryBackfillRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["AdminYoutubeCreatorCountryBackfillResponse"];
        };
      };
    };
  };
  getAllUsers: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UserResponseDTO"][];
        };
      };
    };
  };
  createUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserRequestDTO"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UserResponseDTO"];
        };
      };
    };
  };
  bulkGiveToken: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["BulkTokenRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  createCrawledRecipe: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeCreateRequestDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
    };
  };
  regenerateRecipeImage: {
    parameters: {
      query: {
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  enhanceFallbackIngredients: {
    parameters: {
      query: {
        /** @description Recipe ID */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["AdminRecipeFallbackEnhancementResponse"];
        };
      };
    };
  };
  createCrawledRecipeWithPresignedUrls: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeWithImageUploadRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PresignedUrlResponse"];
        };
      };
    };
  };
  createCrawledRecipesInBulk: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RecipeCreateRequestDto"][];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
    };
  };
  refresh: {
    parameters: {
      query?: {
        locale?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeSitemapRefreshResponse"];
        };
      };
    };
  };
  sync: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["RecipeImportSyncRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeImportSyncResponse"];
        };
      };
    };
  };
  schedule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["RecipeImportScheduleRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeImportScheduleResponse"];
        };
      };
    };
  };
  processDue: {
    parameters: {
      query?: {
        limit?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeImportProcessResponse"];
        };
      };
    };
  };
  updateIngredientPopularity: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  backfillTitleNorm: {
    parameters: {
      query?: {
        batch?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: number;
          };
        };
      };
    };
  };
  run: {
    parameters: {
      query?: {
        locale?: string;
        count?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RunResult"];
        };
      };
    };
  };
  runByIds: {
    parameters: {
      query: {
        locale?: string;
        recipeIds: number[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RunResult"];
        };
      };
    };
  };
  resetFailed: {
    parameters: {
      query?: {
        locale?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RunResult"];
        };
      };
    };
  };
  run_1: {
    parameters: {
      query?: {
        locale?: string;
        count?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RunResult"];
        };
      };
    };
  };
  run_2: {
    parameters: {
      query?: {
        locale?: string;
        count?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RunResult"];
        };
      };
    };
  };
  runByIds_1: {
    parameters: {
      query?: {
        locale?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": number[];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RunResult"];
        };
      };
    };
  };
  resetFailed_1: {
    parameters: {
      query?: {
        locale?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RunResult"];
        };
      };
    };
  };
  run_3: {
    parameters: {
      query?: {
        locale?: string;
        count?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RunResult"];
        };
      };
    };
  };
  resetFailed_2: {
    parameters: {
      query?: {
        locale?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RunResult"];
        };
      };
    };
  };
  grantWelcomeCreditToAllUsers: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  list_1: {
    parameters: {
      query: {
        /** @description 발행 상태 */
        status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
        /** @description 카테고리 */
        category?: string;
        /** @description 제목 LIKE 검색어 */
        q?: string;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
    };
  };
  create_1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CurationArticleCreateRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CurationArticleCreateResponse"];
        };
      };
    };
  };
  review: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 아티클 ID (HashID) */
        articleId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  publish: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 아티클 ID (HashID) */
        articleId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  issueImagePresignedUrl: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 아티클 ID (HashID) */
        articleId: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ArticleImagePresignedUrlRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ArticleImagePresignedUrlResponse"];
        };
      };
    };
  };
  finalizeImages: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 아티클 ID (HashID) */
        articleId: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ArticleImageFinalizeRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ArticleImageFinalizeResponse"];
        };
      };
    };
  };
  archive: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 아티클 ID (HashID) */
        articleId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  updateIngredientLink: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        ingredientId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": Record<string, never>;
        };
      };
    };
  };
  generateDeepLink: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": {
          [key: string]: string;
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": Record<string, never>;
        };
      };
    };
  };
  runIngredientBatch: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": Record<string, never>;
        };
      };
    };
  };
  runCustomIngredientBatch: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": Record<string, never>;
        };
      };
    };
  };
  getUserProfile: {
    parameters: {
      query: {
        userId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UserDto"];
        };
      };
    };
  };
  patchUser: {
    parameters: {
      query: {
        userId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserPatchDTO"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UserResponseDTO"];
        };
      };
    };
  };
  deleteComment_1: {
    parameters: {
      query: {
        /** @description 댓글 ID (HashID) */
        commentId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 삭제 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 댓글 아님 (COMMENT_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 댓글 없음 (COMMENT_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  updateComment: {
    parameters: {
      query: {
        /** @description 레시피 ID */
        recipeId: number;
        /** @description 댓글 ID */
        commentId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CommentUpdateRequest"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CommentDto"];
        };
      };
    };
  };
  markRead: {
    parameters: {
      query: {
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  update_2: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        type:
          | "NEW_COMMENT"
          | "NEW_REPLY"
          | "AI_RECIPE_DONE"
          | "NEW_FAVORITE"
          | "NEW_RECIPE_LIKE"
          | "NEW_COMMENT_LIKE"
          | "NEW_RECIPE_RATING"
          | "RECIPE_POLICY_VIOLATION"
          | "REFERRAL_REWARD_GRANTED";
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PreferenceDto"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UserNotificationPreferenceDto"];
        };
      };
    };
  };
  getMe: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevMeResponseDto"];
        };
      };
      /** @description 인증 필요 (AUTH_UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 사용자 없음 (USER_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  deleteMyAccount: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  patchMyProfile: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserPatchDTO"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UserResponseDTO"];
        };
      };
    };
  };
  updateVisibility: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID 인코딩) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DevVisibilityUpdateRequest"];
      };
    };
    responses: {
      /** @description 변경 성공 — 갱신된 visibility 반환 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevVisibilityUpdateResponse"];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevVisibilityUpdateResponse"];
        };
      };
      /** @description 인증 필요 (errorCode=103 UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevVisibilityUpdateResponse"];
        };
      };
      /** @description 본인 레시피가 아님 (errorCode=202 RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevVisibilityUpdateResponse"];
        };
      };
      /** @description 레시피 없음 (errorCode=201 RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevVisibilityUpdateResponse"];
        };
      };
    };
  };
  updateVisibility_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID 인코딩) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DevVisibilityUpdateRequest"];
      };
    };
    responses: {
      /** @description 변경 성공 — 갱신된 visibility 반환 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevVisibilityUpdateResponse"];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevVisibilityUpdateResponse"];
        };
      };
      /** @description 인증 필요 (errorCode=103 UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevVisibilityUpdateResponse"];
        };
      };
      /** @description 본인 레시피가 아님 (errorCode=202 RECIPE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevVisibilityUpdateResponse"];
        };
      };
      /** @description 레시피 없음 (errorCode=201 RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevVisibilityUpdateResponse"];
        };
      };
    };
  };
  getBookDetail: {
    parameters: {
      query: {
        /** @description 레시피북 ID (HashID) */
        bookId: number;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeBookDetailResponse"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 폴더 아님 (RECIPE_BOOK_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 폴더 없음 (RECIPE_BOOK_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  deleteBook: {
    parameters: {
      query: {
        /** @description 레시피북 ID (HashID) */
        bookId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 삭제 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
      /** @description 기본 폴더 (RECIPE_BOOK_DEFAULT_CANNOT_DELETE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 폴더 아님 (RECIPE_BOOK_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 폴더 없음 (RECIPE_BOOK_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  renameBook: {
    parameters: {
      query: {
        /** @description 레시피북 ID (HashID) */
        bookId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RenameRecipeBookRequest"];
      };
    };
    responses: {
      /** @description 이름 변경 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeBookResponse"];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 폴더 아님 (RECIPE_BOOK_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 폴더 없음 (RECIPE_BOOK_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 이름 중복 (RECIPE_BOOK_DUPLICATE_NAME) */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getBookDetail_1: {
    parameters: {
      query: {
        /** @description 레시피북 ID (HashID) */
        bookId: number;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeBookDetailResponse"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 폴더 아님 (RECIPE_BOOK_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 폴더 없음 (RECIPE_BOOK_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  deleteBook_1: {
    parameters: {
      query: {
        /** @description 레시피북 ID (HashID) */
        bookId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 삭제 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
      /** @description 기본 폴더 (RECIPE_BOOK_DEFAULT_CANNOT_DELETE) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 폴더 아님 (RECIPE_BOOK_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 폴더 없음 (RECIPE_BOOK_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  renameBook_1: {
    parameters: {
      query: {
        /** @description 레시피북 ID (HashID) */
        bookId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RenameRecipeBookRequest"];
      };
    };
    responses: {
      /** @description 이름 변경 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeBookResponse"];
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 폴더 아님 (RECIPE_BOOK_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 폴더 없음 (RECIPE_BOOK_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 이름 중복 (RECIPE_BOOK_DUPLICATE_NAME) */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  channelRecipes: {
    parameters: {
      query: {
        sort?: string;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path: {
        channelId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["YoutubeChannelRecipesResponse"];
        };
      };
    };
  };
  rankings: {
    parameters: {
      query?: {
        /** @description weekly | all. Defaults to weekly. */
        period?: string;
        /** @description Result size. Defaults to 20, max 50. */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["YoutubeChannelRankingResponse"];
        };
      };
    };
  };
  getUserRecipes: {
    parameters: {
      query: {
        userId: number;
        types?: ("USER" | "AI" | "YOUTUBE" | "REELS")[];
        creatorCountryTags?: string[];
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["SliceResponseDevMyRecipeSummaryDto"];
        };
      };
    };
  };
  presignProfileImage: {
    parameters: {
      query: {
        userId: number;
        contentType?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PresignedUrlResponseItem"];
        };
      };
    };
  };
  getAllTags: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          }[];
        };
      };
    };
  };
  searchRecipes: {
    parameters: {
      query: {
        /** @description Search condition */
        cond: components["schemas"]["RecipeSearchCondition"];
        sort: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
    };
  };
  suggestRecipes: {
    parameters: {
      query: {
        /** @description Input prefix */
        prefix: string;
        /** @description Maximum suggestion count */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string[];
        };
      };
    };
  };
  getRemixes: {
    parameters: {
      query: {
        recipeId: number;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["SliceResponseDevRecipeListItemDto"];
        };
      };
    };
  };
  getHistory: {
    parameters: {
      query: {
        recipeId: number;
        limit?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ChatHistoryItem"][];
        };
      };
    };
  };
  getTitleKeywordRecipes: {
    parameters: {
      query: {
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevTitleKeywordRecipesResponse"];
        };
      };
    };
  };
  getSameIngredientRecipes: {
    parameters: {
      query: {
        recipeId: number;
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevSameIngredientRecipesResponse"];
        };
      };
    };
  };
  getRecommendations: {
    parameters: {
      query: {
        recipeId: number;
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeDiscoveryCardDto"][];
        };
      };
    };
  };
  getRecommendedRecipes: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["YoutubeSearchDto"][];
        };
      };
    };
  };
  youtubeVerified: {
    parameters: {
      query?: {
        /** @description Result size. Defaults to 20, max 50. */
        size?: number;
        excludeRecipeIds?: string[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["YoutubeVerifiedRecipesResponse"];
        };
      };
    };
  };
  getRecipesForSitemap: {
    parameters: {
      query?: {
        page?: number;
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeSitemapResponseDto"][];
        };
      };
    };
  };
  getRecipesForSitemapJa: {
    parameters: {
      query?: {
        page?: number;
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeSitemapResponseDto"][];
        };
      };
    };
  };
  getRecipesForSitemapEn: {
    parameters: {
      query?: {
        page?: number;
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeSitemapResponseDto"][];
        };
      };
    };
  };
  seasonalPopular: {
    parameters: {
      query?: {
        /** @description Month number, 1-12. Defaults to current month in Asia/Seoul. */
        month?: number;
        /** @description Result size. Defaults to 20, max 50. */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["SeasonalPopularRecipesResponse"];
        };
      };
    };
  };
  search: {
    parameters: {
      query: {
        cond: components["schemas"]["RecipeSearchCondition"];
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeSearchSliceResponse"];
        };
      };
    };
  };
  getAllReports: {
    parameters: {
      query?: {
        onlyUnresolved?: boolean;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ReportResponse"][];
        };
      };
    };
  };
  quickPopular: {
    parameters: {
      query?: {
        /** @description Maximum cooking time in minutes. Defaults to 20, max 60. */
        maxCookingTime?: number;
        /** @description Result size. Defaults to 20, max 50. */
        size?: number;
        excludeRecipeIds?: string[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["QuickPopularRecipesResponse"];
        };
      };
    };
  };
  popular: {
    parameters: {
      query: {
        period?: string;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["SliceResponseDevRecipeDiscoveryCardDto"];
        };
      };
    };
  };
  countryPopular: {
    parameters: {
      query?: {
        /** @description Supported country code: US or JP. Defaults to random US/JP. */
        countryCode?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CountryPopularRecipesResponse"];
        };
      };
    };
  };
  cookedPopular: {
    parameters: {
      query?: {
        /** @description Result size. Defaults to 20, max 50. */
        size?: number;
        excludeRecipeIds?: string[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CookedPopularRecipesResponse"];
        };
      };
    };
  };
  categoryPopular: {
    parameters: {
      query?: {
        categoryCode?: string;
        /** @description Result size. Defaults to 20, max 50. */
        size?: number;
        excludeRecipeIds?: string[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CategoryPopularRecipesResponse"];
        };
      };
    };
  };
  budget: {
    parameters: {
      query: {
        maxCost?: number;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["SliceResponseDevRecipeBudgetCardDto"];
        };
      };
    };
  };
  protectedResource: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  getProducts: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ProductResponseDto"][];
        };
      };
    };
  };
  getAll: {
    parameters: {
      query: {
        read?: boolean;
        pg: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModelNotificationDto"];
        };
      };
    };
  };
  deleteAll: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getUnreadCount: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": number;
        };
      };
    };
  };
  getPreferences: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UserNotificationPreferenceDto"][];
        };
      };
    };
  };
  getMyCookingStreak: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CookingStreakDto"];
        };
      };
    };
  };
  getMyReferral: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["ReferralMeResponse"];
        };
      };
    };
  };
  getMyRecipes: {
    parameters: {
      query: {
        types?: ("USER" | "AI" | "YOUTUBE" | "REELS")[];
        creatorCountryTags?: string[];
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["SliceResponseDevMyRecipeSummaryDto"];
        };
      };
    };
  };
  cookedAgain: {
    parameters: {
      query?: {
        /** @description Result size. Defaults to 10, max 50. */
        size?: number;
        excludeRecipeIds?: string[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CookedAgainRecipesResponse"];
        };
      };
    };
  };
  fridgeIngredientPopular: {
    parameters: {
      query?: {
        /** @description Result size. Defaults to 20, max 50. */
        size?: number;
        excludeRecipeIds?: string[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["FridgeIngredientPopularRecipesResponse"];
        };
      };
    };
  };
  getMyIngredientIds: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string[];
        };
      };
    };
  };
  getMyFavorites: {
    parameters: {
      query: {
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["SliceResponseDevRecipeListItemDto"];
        };
      };
    };
  };
  getStats: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["StatsResponseDto"];
        };
      };
    };
  };
  getIngredientUnits: {
    parameters: {
      query: {
        ingredientId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["IngredientUnitsResponse"];
        };
      };
    };
  };
  sitemap: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["IngredientSitemapResponseDto"][];
        };
      };
    };
  };
  getIngredientNames: {
    parameters: {
      query?: {
        ids?: string[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: components["schemas"]["IngredientIdNameDto"][];
          };
        };
      };
    };
  };
  health: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  getAllDishTypes: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DishTypeDto"][];
        };
      };
    };
  };
  getUserRecipes_1: {
    parameters: {
      query: {
        /** @description 대상 사용자 ID (HashID) */
        userId: number;
        /** @description source 필터 (USER/AI/YOUTUBE/REELS, optional) */
        types?: ("USER" | "AI" | "YOUTUBE" | "REELS")[];
        /** @description 음식 국가 코드 필터 (예: KR,IT). 생략하면 전체 */
        creatorCountryTags?: string[];
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevMyRecipeSummaryDto"];
        };
      };
      /** @description 잘못된 query parameter (types에 잘못된 RecipeSourceType enum 값 등) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 사용자 없음 (USER_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  searchIngredients: {
    parameters: {
      query?: {
        /** @description Search keyword */
        q?: string;
        /** @description Ingredient category code */
        category?: string;
        /** @description Sort value, currently kept for operational parity */
        sort?: string;
        /** @description Page number */
        page?: number;
        /** @description Page size, max 50 */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
    };
  };
  searchIngredients_1: {
    parameters: {
      query?: {
        /** @description Search keyword */
        q?: string;
        /** @description Ingredient category code */
        category?: string;
        /** @description Sort value, currently kept for operational parity */
        sort?: string;
        /** @description Page number */
        page?: number;
        /** @description Page size, max 50 */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
    };
  };
  getRemixes_1: {
    parameters: {
      query: {
        /** @description 원본 레시피 ID (HashID) */
        recipeId: number;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
      /** @description PRIVATE/RESTRICTED 원본 non-owner */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 원본 없음 또는 non-ACTIVE */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getCommentWithReplies: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
        /** @description 댓글 ID (HashID) */
        commentId: number;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CommentWithRepliesDto"];
        };
      };
      /** @description PRIVATE/RESTRICTED non-owner */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피/댓글 없음 또는 non-ACTIVE */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getCommentWithReplies_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        recipeId: number;
        /** @description 댓글 ID (HashID) */
        commentId: number;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CommentWithRepliesDto"];
        };
      };
      /** @description PRIVATE/RESTRICTED non-owner */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피/댓글 없음 또는 non-ACTIVE */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getTitleKeywordRecipes_1: {
    parameters: {
      query: {
        /** @description 기준 레시피 ID (HashID) */
        recipeId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 — keyword + List<DevRecipeDiscoveryCardDto> */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevTitleKeywordRecipesResponse"];
        };
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getDetailStatus: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeDetailStatusDto"];
        };
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getDetailStatus_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeDetailStatusDto"];
        };
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getSavedBooks: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeSaveStatusResponse"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getSavedBooks_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeSaveStatusResponse"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getSameIngredientRecipes_1: {
    parameters: {
      query: {
        /** @description 기준 레시피 ID (HashID) */
        recipeId: number;
        /** @description 추천 개수 (default 10, max 20) */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 — ingredientName + List<DevRecipeDiscoveryCardDto> */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevSameIngredientRecipesResponse"];
        };
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getRecommendations_1: {
    parameters: {
      query: {
        /** @description 기준 레시피 ID (HashID) */
        recipeId: number;
        /** @description 추천 개수 (default 10) */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeDiscoveryCardDto"][];
        };
      };
      /** @description PRIVATE/RESTRICTED 레시피 non-owner (RECIPE_PRIVATE_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 레시피 없음 또는 non-ACTIVE (RECIPE_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getYoutubeJobStatus: {
    parameters: {
      query: {
        /** @description 인코딩된 Job ID */
        jobId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 (status: PENDING|IN_PROGRESS|COMPLETED|FAILED) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobStatusDto"];
        };
      };
      /** @description Job ID를 찾을 수 없음 (errorCode=909 RESOURCE_NOT_FOUND). */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobStatusDto"];
        };
      };
    };
  };
  getYoutubeJobStatus_1: {
    parameters: {
      query: {
        /** @description 인코딩된 Job ID */
        jobId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 (status: PENDING|IN_PROGRESS|COMPLETED|FAILED) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobStatusDto"];
        };
      };
      /** @description Job ID를 찾을 수 없음 (errorCode=909 RESOURCE_NOT_FOUND). */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobStatusDto"];
        };
      };
    };
  };
  check: {
    parameters: {
      query: {
        /** @description 유튜브 영상 URL */
        url: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 — {recipeId: HashID} 또는 null */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeIdResponse"];
        };
      };
      /** @description 잘못된 URL 형식 (INVALID_URL_FORMAT) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  check_1: {
    parameters: {
      query: {
        /** @description 유튜브 영상 URL */
        url: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 — {recipeId: HashID} 또는 null */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeIdResponse"];
        };
      };
      /** @description 잘못된 URL 형식 (INVALID_URL_FORMAT) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  search_2: {
    parameters: {
      query: {
        /** @description 검색 조건 (제목, 디시타입, 태그, 영양성분, 가격 등 — 운영 V2와 동일) */
        cond: components["schemas"]["RecipeSearchCondition"];
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 검색 성공 (Page<DevRecipeSearchResultDto>) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DevRecipeSearchResultDto"];
        };
      };
      /** @description 잘못된 query parameter (잘못된 enum 값, sort 필드 등) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 검색 인프라 장애 (OpenSearch + QueryDSL fallback 모두 실패 — 매우 드묾) */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  popular_1: {
    parameters: {
      query: {
        /** @description 기간 (weekly | monthly | all) */
        period?: string;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 (Page<DevRecipeDiscoveryCardDto>) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DevRecipeDiscoveryCardDto"];
        };
      };
    };
  };
  budget_1: {
    parameters: {
      query: {
        /** @description 최대 원가 (원) */
        maxCost?: number;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 (Page<DevRecipeBudgetCardDto>) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DevRecipeBudgetCardDto"];
        };
      };
    };
  };
  getAiJobStatus: {
    parameters: {
      query: {
        jobId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 (status: PENDING|IN_PROGRESS|COMPLETED|FAILED) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobStatusDto"];
        };
      };
      /** @description Job ID를 찾을 수 없음 (errorCode=909 RESOURCE_NOT_FOUND). */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobStatusDto"];
        };
      };
    };
  };
  getAiJobStatus_1: {
    parameters: {
      query: {
        jobId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 (status: PENDING|IN_PROGRESS|COMPLETED|FAILED) */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobStatusDto"];
        };
      };
      /** @description Job ID를 찾을 수 없음 (errorCode=909 RESOURCE_NOT_FOUND). */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["JobStatusDto"];
        };
      };
    };
  };
  getMyRating: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 — {rating: number} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getMyRating_1: {
    parameters: {
      query: {
        /** @description 레시피 ID (HashID) */
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 — {rating: number} */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getRecordDetail: {
    parameters: {
      query: {
        /** @description 기록 ID (HashID) */
        recordId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CookingRecordDto"];
        };
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description record 없음 또는 표시 불가 (COOKING_RECORD_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  deleteRecord: {
    parameters: {
      query: {
        /** @description 기록 ID (HashID) */
        recordId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 삭제 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 record 아님 (USER_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description record 없음 (COOKING_RECORD_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getRecordDetail_1: {
    parameters: {
      query: {
        /** @description 기록 ID (HashID) */
        recordId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CookingRecordDto"];
        };
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description record 없음 또는 표시 불가 (COOKING_RECORD_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  deleteRecord_1: {
    parameters: {
      query: {
        /** @description 기록 ID (HashID) */
        recordId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 삭제 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: string;
          };
        };
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 record 아님 (USER_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description record 없음 (COOKING_RECORD_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getRecordFeed: {
    parameters: {
      query: {
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevCookingRecordFeedResponse"];
        };
      };
      /** @description UNAUTHORIZED */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getRecordFeed_1: {
    parameters: {
      query: {
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevCookingRecordFeedResponse"];
        };
      };
      /** @description UNAUTHORIZED */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getMyRecipes_1: {
    parameters: {
      query: {
        /** @description source 필터 (USER/AI/YOUTUBE/REELS, optional) */
        types?: ("USER" | "AI" | "YOUTUBE" | "REELS")[];
        /** @description 음식 국가 코드 필터 (예: KR,IT). 생략하면 전체 */
        creatorCountryTags?: string[];
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevMyRecipeSummaryDto"];
        };
      };
      /** @description 잘못된 query parameter (types에 잘못된 RecipeSourceType enum 값 등) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  findByFridge: {
    parameters: {
      query: {
        pageable: components["schemas"]["Pageable"];
        /** @description 레거시 호환 파라미터. 현재 냉장고 추천은 YOUTUBE 전용이라 요청값은 무시된다. */
        types?: ("AI" | "YOUTUBE" | "USER")[];
        /** @description 음식 국가 코드 필터 (예: KR,IT). 생략하면 전체 */
        creatorCountryTags?: string[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 추천 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevFridgeRecipeDto"];
        };
      };
      /** @description 잘못된 query parameter (types에 잘못된 RecipeType enum 값 등) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  findByFridge_1: {
    parameters: {
      query: {
        pageable: components["schemas"]["Pageable"];
        /** @description 레거시 호환 파라미터. 현재 냉장고 추천은 YOUTUBE 전용이라 요청값은 무시된다. */
        types?: ("AI" | "YOUTUBE" | "USER")[];
        /** @description 음식 국가 코드 필터 (예: KR,IT). 생략하면 전체 */
        creatorCountryTags?: string[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 추천 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevFridgeRecipeDto"];
        };
      };
      /** @description 잘못된 query parameter (types에 잘못된 RecipeType enum 값 등) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getMyFavorites_1: {
    parameters: {
      query: {
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevRecipeListItemDto"];
        };
      };
      /** @description 인증 필요 (UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  monthSummary_2: {
    parameters: {
      query: {
        year: number;
        /**
         * @description 조회할 월 (1~12)
         * @example 4
         */
        month: number;
        date: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CalendarMonthSummaryDto"];
        };
      };
      /** @description INVALID_INPUT_VALUE */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description UNAUTHORIZED */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  monthSummary_1_1: {
    parameters: {
      query: {
        year: number;
        /**
         * @description 조회할 월 (1~12)
         * @example 4
         */
        month: number;
        date: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CalendarMonthSummaryDto"];
        };
      };
      /** @description INVALID_INPUT_VALUE */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description UNAUTHORIZED */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getMe_1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevMeResponseDto"];
        };
      };
      /** @description 인증 필요 (AUTH_UNAUTHORIZED) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 사용자 없음 (USER_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getIngredientDetail: {
    parameters: {
      query: {
        /** @description 재료 ID (해시) */
        ingredientId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["DevIngredientDetailDto"];
        };
      };
      /** @description 재료를 찾을 수 없음 (errorCode: INGREDIENT_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  list: {
    parameters: {
      query: {
        /** @description 카테고리 필터 */
        category?: string;
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
    };
  };
  getBySlug: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description URL slug */
        slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PublicCurationArticleResponse"];
        };
      };
    };
  };
  recommendations: {
    parameters: {
      query?: {
        /** @description 추천 개수. 기본 6, 최소 4, 최대 12 (범위 밖은 service에서 clamp) */
        size?: number;
      };
      header?: never;
      path: {
        /** @description 현재 보고 있는 아티클의 URL slug */
        slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CurationArticleRecommendationResponse"][];
        };
      };
    };
  };
  sitemap_1: {
    parameters: {
      query?: {
        page?: number;
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CurationArticleSitemapResponse"][];
        };
      };
    };
  };
  sitemapJa: {
    parameters: {
      query?: {
        page?: number;
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CurationArticleSitemapResponse"][];
        };
      };
    };
  };
  sitemapEn: {
    parameters: {
      query?: {
        page?: number;
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CurationArticleSitemapResponse"][];
        };
      };
    };
  };
  getMyCreditHistory: {
    parameters: {
      query: {
        pageable: components["schemas"]["Pageable"];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["PagedModel"];
        };
      };
    };
  };
  getQuota: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["QuotaResponse"];
        };
      };
    };
  };
  getUser: {
    parameters: {
      query: {
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["UserResponseDTO"];
        };
      };
    };
  };
  deleteUser: {
    parameters: {
      query: {
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  status: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeSitemapSnapshotStatusResponse"][];
        };
      };
    };
  };
  stats: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["RecipeImportStatsResponse"];
        };
      };
    };
  };
  status_1: {
    parameters: {
      query?: {
        locale?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: number;
          };
        };
      };
    };
  };
  failures: {
    parameters: {
      query?: {
        locale?: string;
        limit?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["FailedJob"][];
        };
      };
    };
  };
  status_2: {
    parameters: {
      query?: {
        locale?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: number;
          };
        };
      };
    };
  };
  status_3: {
    parameters: {
      query?: {
        locale?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: number;
          };
        };
      };
    };
  };
  failures_1: {
    parameters: {
      query?: {
        locale?: string;
        limit?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["FailedJob"][];
        };
      };
    };
  };
  status_4: {
    parameters: {
      query?: {
        locale?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: number;
          };
        };
      };
    };
  };
  listTranslations: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 아티클 ID (HashID) */
        articleId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": components["schemas"]["CurationArticleTranslationView"][];
        };
      };
    };
  };
  home: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
    };
  };
  deleteIndexByName: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 삭제할 인덱스 이름 */
        name: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": {
            [key: string]: Record<string, never>;
          };
        };
      };
    };
  };
  delete: {
    parameters: {
      query: {
        id: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  removeItem: {
    parameters: {
      query: {
        ingredientId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": Record<string, never>;
        };
      };
    };
  };
  deleteComment: {
    parameters: {
      query: {
        /** @description 댓글 ID (HashID) */
        commentId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 삭제 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "*/*": string;
        };
      };
      /** @description 인증 필요 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 본인 댓글 아님 (COMMENT_ACCESS_DENIED) */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 댓글 없음 (COMMENT_NOT_FOUND) */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
}
