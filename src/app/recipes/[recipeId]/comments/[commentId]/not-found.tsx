import { Suspense } from "react";

import NotFound from "@/shared/ui/NotFound";

const ReplyNotFound = () => {
  return (
    <Suspense fallback={<div />}>
      <NotFound
        title="존재하지 않는 댓글입니다"
        description="댓글이 삭제되었거나 존재하지 않습니다.
다른 댓글을 찾아보시겠어요?"
        emoji="💬"
      />
    </Suspense>
  );
};

export default ReplyNotFound;
