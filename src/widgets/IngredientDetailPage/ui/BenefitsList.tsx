type BenefitsListProps = {
  benefits: string[];
};

const BenefitsList = ({ benefits }: BenefitsListProps) => {
  if (benefits.length === 0) return null;

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1">효능</h2>
      <p className="text-sm text-gray-500 mb-3">이런 점이 좋아요</p>

      <ul className="flex flex-col gap-2">
        {benefits.map((benefit) => (
          <li
            key={benefit}
            className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed"
          >
            <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-olive-light flex-shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BenefitsList;
