import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { Image } from "@/shared/ui/image/Image";
import Link from "next/link";

export const CreationModeSelector = () => {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-dark mb-4 text-center text-3xl font-bold">
          어떻게 레시피를 만드시겠어요?
        </h1>
        <p className="mb-12 text-center text-pretty break-keep text-gray-500">
          직접 입력하거나 유튜브 영상에서 레시피를 가져올 수 있어요
        </p>

        <div className="grid grid-cols-2 gap-4 md:gap-8">
          <Link
            href="/recipes/new/manual"
            className="group border-olive-light/30 hover:border-olive-mint block rounded-2xl border-2 bg-white p-4 transition-all duration-200 hover:shadow-lg md:p-8"
          >
            <div className="flex flex-col items-center space-y-3 text-center md:space-y-6">
              <div className="relative w-32 overflow-hidden rounded-lg md:h-64 md:w-48">
                <Image
                  src={`${ICON_BASE_URL}note.webp`}
                  alt="직접 입력하기"
                  fit="cover"
                  imgClassName="transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-dark text-lg font-bold md:text-2xl">
                  직접 입력하기
                </h2>
                <p className="text-pretty break-keep text-gray-500">
                  레시피를 직접 작성하고 <br />
                  나만의 요리를 공유해보세요
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/recipes/new/youtube"
            className="group border-olive-light/30 hover:border-olive-mint block rounded-2xl border-2 bg-white p-4 transition-all duration-200 hover:shadow-lg md:p-8"
          >
            <div className="flex flex-col items-center space-y-3 text-center md:space-y-6">
              <div className="relative w-32 overflow-hidden rounded-lg md:h-64 md:w-48">
                <Image
                  src={`${ICON_BASE_URL}youtube.webp`}
                  alt="유튜브로 가져오기"
                  fit="cover"
                  imgClassName="transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-dark text-lg font-bold md:text-2xl">
                  유튜브로 가져오기
                </h2>
                <p className="text-pretty break-keep text-gray-500">
                  유튜브 영상 링크만 있으면
                  <br />
                  자동으로 레시피를 만들어요
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
