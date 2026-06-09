import Link from "next/link";

import { Refrigerator } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

const MyFridgeEmptyState = () => {
  return (
    <div className="flex flex-col items-center gap-5 px-6 pt-16 pb-12">
      <Refrigerator
        className="h-20 w-20 text-gray-300"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold text-gray-900">
          요리 가능한 레시피가 없어요
        </h3>
        <p className="text-sm text-gray-500">
          냉장고에 재료를 추가하면
          <br />더 많은 레시피를 찾을 수 있어요!
        </p>
      </div>
      <Link href="/ingredients/new">
        <Button className="bg-olive-light active:bg-olive-light/90 mt-2 h-12 cursor-pointer rounded-xl px-6 font-medium text-white transition-colors">
          재료 추가하러 가기
        </Button>
      </Link>
    </div>
  );
};

export default MyFridgeEmptyState;
