import { Sparkles } from "lucide-react";

const ChatEmptyState = () => (
  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-olive-light/10">
      <Sparkles className="h-6 w-6 text-olive-light" />
    </div>
    <p className="text-base font-bold text-gray-900">
      이 레시피에 대해 궁금한 걸 물어보세요
    </p>
    <p className="mt-2 text-sm text-gray-500">
      매운맛, 대체 재료, 보관법 등 무엇이든요.
    </p>
  </div>
);

export default ChatEmptyState;
