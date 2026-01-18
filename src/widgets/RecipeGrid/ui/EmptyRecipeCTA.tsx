import Link from "next/link";

import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";
import { Image } from "@/shared/ui/image/Image";

type EmptyRecipeCTAProps = {
  noResultsMessage: string;
};

const EmptyRecipeCTA = ({ noResultsMessage }: EmptyRecipeCTAProps) => {
  return (
    <section className="flex min-h-[500px] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800">{noResultsMessage}</h3>
          <p className="text-sm text-gray-600">
            30초만에 AI에게 레시피 생성을 맡겨보세요
          </p>
        </div>
        <Link
          href="/recipes/new/ai"
          className="border-olive-light text-olive-light hover:bg-olive-light/10 flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl border bg-white px-4 py-2 font-semibold transition-colors"
        >
          <Image
            src={`${ICON_BASE_URL}ai.webp`}
            alt="AI"
            wrapperClassName="w-8"
          />
          <span>AI 레시피 생성하기</span>
        </Link>
        <Link
          href="/recipes/new/youtube"
          className="border-olive-light text-olive-light hover:bg-olive-light/10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white px-6 py-3 font-semibold transition-colors"
        >
          <YouTubeIconBadge className="h-6 w-6" />
          <span>유튜브 레시피 추출하기</span>
        </Link>
      </div>
    </section>
  );
};

export default EmptyRecipeCTA;
