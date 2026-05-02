import { getCookingMethodIcon } from "@/entities/ingredient/lib/cookingMethodIcon";

type CookingMethodsSectionProps = {
  methods: string[];
};

const CookingMethodsSection = ({ methods }: CookingMethodsSectionProps) => {
  if (methods.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-3">추천 조리법</h2>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1">
        {methods.map((method) => {
          const Icon = getCookingMethodIcon(method);
          return (
            <span
              key={method}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700 flex-shrink-0"
            >
              {Icon && <Icon size={14} className="text-gray-500" />}
              <span>{method}</span>
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default CookingMethodsSection;
