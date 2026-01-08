import { LANDING_BASE_URL } from "@/shared/config/constants/recipe";
import { Image } from "@/shared/ui/image";

type ArchetypeLandingProps = {
  onStart: () => void;
};

const ArchetypeLanding = ({ onStart }: ArchetypeLandingProps) => {
  return (
    <div className="relative w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/videos/landing.webm"
          type="video/webm"
        />
      </video>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex flex-col items-center justify-between px-6 py-20">
        <div className="flex flex-col items-center space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="-space-y-2 font-serif text-6xl leading-none font-light tracking-wide text-white md:-space-y-3 md:text-7xl lg:-space-y-4 lg:text-8xl">
              <div>DISCOVER YOUR</div>
              <div>
                <span className="font-semibold">FINE DINING</span>
              </div>
              <div>PERSONA</div>
            </h1>
          </div>

          <div className="max-w-2xl space-y-4 text-center">
            <p className="text-xl leading-relaxed font-light text-white/90 md:text-2xl">
              나를 파인다이닝 디쉬로 표현하고 공유해보세요
            </p>
            <p className="text-base font-light text-white/70 md:text-lg">
              5가지 질문으로 알아보는 나만의 식사 스타일
              <br />
              소요 시간: 약 1분
            </p>
          </div>

          <button
            onClick={onStart}
            className="group relative mb-8 cursor-pointer overflow-hidden rounded-full border-2 border-white bg-transparent px-12 py-4 text-lg font-semibold tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            <span className="relative z-10">테스트 하러가기</span>
          </button>
        </div>

        <div className="flex flex-row items-center justify-center gap-4 pb-8">
          <div className="relative flex h-64 w-48 -rotate-6 items-center justify-center overflow-hidden rounded-lg border-2 border-white/30 bg-gray-300/20 shadow-xl backdrop-blur-xs transition-transform hover:rotate-0">
            <Image
              src={`${LANDING_BASE_URL}landing1.png`}
              alt="Archetype Landing 1"
              wrapperClassName="h-64 w-48"
              className="h-full w-full object-cover blur-[1px]"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="relative flex h-64 w-48 rotate-0 items-center justify-center overflow-hidden rounded-lg border-2 border-white/40 bg-gray-300/30 shadow-2xl backdrop-blur-lg">
            <Image
              src={`${LANDING_BASE_URL}landing2.png`}
              alt="Archetype Landing 2"
              wrapperClassName="h-64 w-48"
              className="h-full w-full object-cover blur-[1px]"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="relative flex h-64 w-48 rotate-6 items-center justify-center overflow-hidden rounded-lg border-2 border-white/30 bg-gray-300/20 shadow-xl backdrop-blur-sm transition-transform hover:rotate-0">
            <Image
              src={`${LANDING_BASE_URL}landing3.png`}
              alt="Archetype Landing 3"
              wrapperClassName="h-64 w-48"
              className="h-full w-full object-cover blur-[1px]"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeLanding;
