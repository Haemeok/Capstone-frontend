type AiLoadingProps = {
  name: string;
};

const AiLoading = ({ name }: AiLoadingProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg font-bold">{name}가 레시피를 생성중입니다</p>
        <p className="text-sm text-gray-500">
          평균 40초에서 1분 내로 완성합니다
        </p>
      </div>
      <div className="loading h-72 w-72"></div>
    </div>
  );
};

export default AiLoading;
