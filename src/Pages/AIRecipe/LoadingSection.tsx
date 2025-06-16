import Circle from '@/components/Icon/Circle';

type LoadingSectionProps = {
  name: string;
  robotImage: string;
  fourCutImage: string;
};

const LoadingSection = ({
  name,
  robotImage,
  fourCutImage,
}: LoadingSectionProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg font-bold">{name}가 레시피를 생성중입니다</p>
        <p className="text-sm text-gray-500">
          평균 1분에서 3분 내로 완성합니다
        </p>
      </div>
      <Circle className="text-olive-mint" size={32} />
      <div className="flex flex-col items-center justify-center">
        <img src={fourCutImage} alt={name} className="h-full w-72" />
      </div>
    </div>
  );
};

export default LoadingSection;
