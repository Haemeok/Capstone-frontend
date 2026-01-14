import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/shared/ui/shadcn/button";
import { Image } from "@/shared/ui/image/Image";
import { ICON_BASE_URL } from "@/shared/config/constants/recipe";

const IngredientsLoginCTA = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 shadow-xl">
        <div className="mb-8 space-y-4">
          <div className="flex items-start gap-2">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
              <Image
                src={`${ICON_BASE_URL}ai.webp`}
                alt="AI"
                wrapperClassName="w-10 h-10"
              />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900">
                AI가 레시피를 추천해드려요
              </h3>
              <p className="text-sm text-gray-600">
                냉장고에 남은 재료로 맞춤 레시피를 AI와 함께 생성할 수 있어요
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
              <Image
                src={`${ICON_BASE_URL}search_intro.webp`}
                alt="레시피 검색"
                wrapperClassName="w-10 h-10"
              />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900">
                재료로 레시피 검색 가능
              </h3>
              <p className="text-sm text-gray-600">
                냉장고 재료를 등록하면 내 재료로 만들 수 있는 레시피를 찾을 수
                있어요
              </p>
            </div>
          </div>
        </div>

        <Link href="/login?redirectUrl=/ingredients" className="block">
          <Button className="bg-olive-light hover:bg-olive-light/90 w-full rounded-xl py-6 font-semibold text-white shadow-lg transition-all hover:shadow-xl">
            <LogIn className="mr-2 h-5 w-5" />
            로그인하고 시작하기
          </Button>
        </Link>

        <p className="mt-4 text-center text-xs text-gray-500">
          회원가입 후 매일 무료 AI 레시피 생성권을 받으세요
        </p>
      </div>
    </div>
  );
};

export default IngredientsLoginCTA;
