import { Suspense } from "react";

import NotFound from "@/shared/ui/NotFound";

const PrivateRecipeNotFound = () => {
  return (
    <Suspense fallback={<div />}>
      <NotFound titleKey="recipe" descriptionKey="recipe" emoji="🍳" />
    </Suspense>
  );
};

export default PrivateRecipeNotFound;
