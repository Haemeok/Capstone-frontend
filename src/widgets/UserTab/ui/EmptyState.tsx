import { ChefHat } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20">
      {/* 아이콘 원형 배경 */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-olive-light/10">
        <ChefHat className="h-10 w-10 text-olive-light" />
      </div>

      {/* 제목 */}
      <h3 className="mb-2 text-lg font-bold text-gray-900">
        나만의 요리 기록을 시작해보세요
      </h3>

      {/* 설명 */}
      <p className="text-center text-sm leading-relaxed text-gray-500">
        레시피를 저장하고 요리 일정을 관리할 수 있어요
      </p>
    </div>
  );
};
