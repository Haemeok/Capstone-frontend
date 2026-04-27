type PrepTipCardProps = {
  tip: string | null;
};

const PrepTipCard = ({ tip }: PrepTipCardProps) => {
  if (!tip) return null;

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">손질 팁</h2>

      <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-700 leading-relaxed">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
          <span>🔪</span>
          <span>준비하기</span>
        </span>
        <p>{tip}</p>
      </div>
    </section>
  );
};

export default PrepTipCard;
