type BenefitsListProps = {
  benefits: string | null;
};

const BenefitsList = ({ benefits }: BenefitsListProps) => {
  if (!benefits) return null;

  return (
    <section className="border-t border-gray-100 px-5 py-6">
      <h2 className="text-ink mb-1 text-lg font-bold">효능</h2>
      <p className="text-ink-muted mb-3 text-sm">이런 점이 좋아요</p>
      <p className="text-ink-sub text-sm leading-relaxed">{benefits}</p>
    </section>
  );
};

export default BenefitsList;
