import { ChefHat } from "lucide-react";

type PrepTipCardProps = {
  tip: string | null;
};

const PrepTipCard = ({ tip }: PrepTipCardProps) => {
  if (!tip) return null;

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1">손질 팁</h2>
      <p className="text-sm text-gray-500 mb-3">처음이면 이렇게 시작하세요</p>

      <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed">
        <span className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
          <ChefHat size={13} className="text-gray-400" />
          <span>준비하기</span>
        </span>
        <p>{tip}</p>
      </div>
    </section>
  );
};

export default PrepTipCard;
