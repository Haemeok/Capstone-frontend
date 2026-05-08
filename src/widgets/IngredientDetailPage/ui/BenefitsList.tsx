type BenefitsListProps = {
  benefits: string | null;
};

const BenefitsList = ({ benefits }: BenefitsListProps) => {
  if (!benefits) return null;

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1">효능</h2>
      <p className="text-sm text-gray-500 mb-3">이런 점이 좋아요</p>
      <p className="text-sm text-gray-700 leading-relaxed">{benefits}</p>
    </section>
  );
};

export default BenefitsList;
