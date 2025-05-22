import useScrollAnimate from '@/hooks/useScrollAnimate';

const HomeBanner = () => {
  const { targetRef } = useScrollAnimate<HTMLDivElement>();

  return (
    <div
      ref={targetRef}
      className="flex w-full items-center rounded-lg border-1 border-gray-300 p-2 text-sm"
      style={{ opacity: 0 }}
    >
      <img src="/robot1.png" alt="Coffee" className="h-15 w-15" />
      <div className="flex flex-col">
        <p className="text-lg font-bold">AI 레시피 생성하기</p>
        <p className="text-sm text-slate-400">
          AI가 추천하는 레시피를 확인해보세요!
        </p>
      </div>
    </div>
  );
};

export default HomeBanner;
