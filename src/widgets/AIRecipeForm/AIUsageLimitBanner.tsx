const AIUsageLimitBanner = () => {
  return (
    <div className="mx-auto w-[95%] rounded-t-2xl bg-brown/80 px-4 py-3 shadow-sm">
      <p className="text-sm text-beige">
        오늘 AI 레시피 생성 횟수를 모두 사용했어요. 내일 다시 시도해주세요!
      </p>
    </div>
  );
};

export default AIUsageLimitBanner;
