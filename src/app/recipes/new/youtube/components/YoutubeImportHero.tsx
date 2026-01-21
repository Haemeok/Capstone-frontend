import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { Image } from "@/shared/ui/image/Image";

export const YoutubeImportHero = () => {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center pt-8 md:pt-12">
      <Image
        src={`${ICON_BASE_URL}youtube.webp`}
        alt="YouTube Premium"
        wrapperClassName="w-1/2"
        imgClassName="drop-shadow-xl"
      />

      <div className="mb-8 space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            유튜브 레시피 가져오기
          </h1>
          <p className="text-lg text-gray-500">
            영상만 보고 따라하기 힘드셨나요?
            <br />
            <span className="text-olive-light font-bold">
              영상과 레시피를 한눈에
            </span>{" "}
            보며 더 편하게 요리하세요.
          </p>
        </div>
      </div>
    </div>
  );
};
