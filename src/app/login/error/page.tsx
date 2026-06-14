import { Suspense } from "react";

import NotFound from "@/shared/ui/NotFound";

const LoginErrorPage = () => {
  return (
    <Suspense fallback={<div />}>
      <NotFound titleKey="generic" descriptionKey="generic" emoji="😢" />
    </Suspense>
  );
};

export default LoginErrorPage;
