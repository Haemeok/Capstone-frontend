import Link from "next/link";

import { Refrigerator } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

const MyFridgeEmptyState = () => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-6 py-12">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <Refrigerator className="h-12 w-12 text-gray-400" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold text-gray-900">
          요리 가능한 레시피가 없어요
        </h3>
        <p className="text-sm text-gray-500">
          냉장고에 재료를 추가하면
          <br />
          더 많은 레시피를 찾을 수 있어요!
        </p>
      </div>
      <Link href="/ingredients/new">
        <Button className="mt-2 h-12 cursor-pointer rounded-xl bg-olive-light px-6 font-medium text-white transition-all hover:bg-olive-light/90 active:scale-[0.98]">
          재료 추가하러 가기
        </Button>
      </Link>
    </div>
  );
};

export default MyFridgeEmptyState;
