import { Suspense } from "react";

import NotFound from "@/widgets/NotFound";

const CommentsNotFound = () => {
  return (
    <Suspense fallback={<div />}>
      <NotFound titleKey="recipe" descriptionKey="recipe" emoji="💬" />
    </Suspense>
  );
};

export default CommentsNotFound;
