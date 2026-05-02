import Link from "next/link";

import { Refrigerator } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

const IngredientEmptyState = () => {
  return (
    <div className="col-span-2 flex min-h-[300px] flex-col items-center justify-center gap-5 px-6 py-8">
      <Refrigerator
        className="h-16 w-16 text-gray-300"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-bold text-gray-900">
          아직 등록된 재료가 없어요
        </h3>
        <p className="text-sm text-gray-500">
          냉장고에 재료를 추가하고
          <br />
          맞춤 레시피를 추천받아 보세요
        </p>
      </div>
      <Link href="/ingredients/new">
        <Button className="h-12 cursor-pointer rounded-xl bg-olive-light px-6 font-medium text-white transition-colors active:bg-olive-light/90">
          재료 추가하기
        </Button>
      </Link>
    </div>
  );
};

export default IngredientEmptyState;
