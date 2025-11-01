import { Suspense } from "react";

import NotFound from "@/shared/ui/NotFound";

const RecipeNotFound = () => {
  return (
    <Suspense fallback={<div />}>
      <NotFound
        title="존재하지 않는 레시피입니다"
        description="레시피가 삭제되었거나 존재하지 않습니다.
다른 레시피를 찾아보시겠어요?"
        emoji="🍳"
      />
    </Suspense>
  );
};

export default RecipeNotFound;
