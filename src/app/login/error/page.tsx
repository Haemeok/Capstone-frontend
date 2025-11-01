import { Suspense } from "react";

import NotFound from "@/shared/ui/NotFound";

const LoginErrorPage = () => {
  return (
    <Suspense fallback={<div />}>
      <NotFound
        title="로그인 실패"
        description="소셜 로그인 인증 중 문제가 발생했습니다.
잠시 후 다시 시도해주세요."
        emoji="😢"
      />
    </Suspense>
  );
};

export default LoginErrorPage;
