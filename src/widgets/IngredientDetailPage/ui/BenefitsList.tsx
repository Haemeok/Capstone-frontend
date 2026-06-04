type BenefitsListProps = {
  benefits: string | null;
};

const BenefitsList = ({ benefits }: BenefitsListProps) => {
  if (!benefits) return null;

  return (
    <section className="border-t border-gray-100 px-5 py-6">
      <h2 className="mb-1 text-lg font-bold text-gray-900">효능</h2>
      <p className="mb-3 text-sm text-gray-500">이런 점이 좋아요</p>
      <p className="text-sm leading-relaxed text-gray-700">{benefits}</p>
    </section>
  );
};

export default BenefitsList;
